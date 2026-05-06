import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { maps } from "~/configs";
import type { MapPlace } from "~/types";
import { useStore } from "~/stores";

interface MapsProps {
  width?: number;
}

interface MarkerEntry {
  id: string;
  marker: mapboxgl.Marker;
}

const LIGHT_MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
const DARK_MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
const DEFAULT_CENTER: [number, number] = [0, 20];

const getMapPadding = (compact: boolean, sheetHeight = 0) =>
  compact
    ? { top: 40, bottom: sheetHeight + 24, left: 40, right: 40 }
    : { top: 40, bottom: 40, left: 320, right: 40 };

const Maps = ({ width = 1024 }: MapsProps) => {
  const rawToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const token = rawToken?.trim();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapResourceError, setMapResourceError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dark = useStore((state) => state.dark);

  // iOS bottom sheet
  const [containerHeight, setContainerHeight] = useState(500);
  const [sheetHeight, setSheetHeight] = useState(240);
  const isDraggingRef = useRef(false);
  const pointerStartY = useRef(0);
  const sheetStartHeight = useRef(0);
  const liveSheetHeight = useRef(sheetHeight);

  const places = maps.places;
  const isCompact = width < 720;

  const snapHeights = useMemo(
    () => ({
      peek: 96,
      half: Math.round(containerHeight * 0.52),
      full: Math.round(containerHeight * 0.88)
    }),
    [containerHeight]
  );

  // Measure container height for snap calculations
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      setContainerHeight(h);
      setSheetHeight(Math.round(h * 0.52));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const snapTo = useCallback(
    (target: "peek" | "half" | "full") => {
      const h = snapHeights[target];
      liveSheetHeight.current = h;
      setSheetHeight(h);
    },
    [snapHeights]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    pointerStartY.current = e.clientY;
    sheetStartHeight.current = liveSheetHeight.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dy = pointerStartY.current - e.clientY;
    const newHeight = Math.max(
      snapHeights.peek,
      Math.min(snapHeights.full, sheetStartHeight.current + dy)
    );
    liveSheetHeight.current = newHeight;
    setSheetHeight(newHeight);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const h = liveSheetHeight.current;
    const closest = (["peek", "half", "full"] as const).reduce(
      (best, key) =>
        Math.abs(snapHeights[key] - h) < Math.abs(snapHeights[best] - h) ? key : best,
      "half" as "peek" | "half" | "full"
    );
    snapTo(closest);
  };

  const places_ = maps.places;

  // Set initial active place to the first favorite
  useEffect(() => {
    const firstFavorite = places_.find((p) => p.favorite);
    if (firstFavorite) {
      setActivePlaceId(firstFavorite.id);
    } else if (places_.length > 0) {
      setActivePlaceId(places_[0].id);
    }
  }, [places_]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const search = searchTerm.toLowerCase();
      return (
        place.name.toLowerCase().includes(search) ||
        place.city?.toLowerCase().includes(search) ||
        place.country?.toLowerCase().includes(search)
      );
    });
  }, [places, searchTerm]);

  const favorites = useMemo(
    () => filteredPlaces.filter((p) => p.favorite),
    [filteredPlaces]
  );
  const traveled = useMemo(
    () => filteredPlaces.filter((p) => !p.favorite),
    [filteredPlaces]
  );

  const openPlace = useCallback((place: MapPlace) => {
    setActivePlaceId(place.id);

    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [place.lng, place.lat],
      zoom: 4,
      essential: true
    });

    markersRef.current.forEach(({ id, marker }) => {
      const popup = marker.getPopup();
      if (!popup) return;
      if (id === place.id) popup.addTo(mapRef.current as mapboxgl.Map);
      else popup.remove();
    });
  }, []);

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: dark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: 1.4
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");
    mapRef.current = map;

    const onMapError = (e: { error?: Error }) => {
      const msg = e.error?.message ?? "Unknown Mapbox error";
      console.error("[Maps]", msg, e.error);
      setMapResourceError(msg);
    };

    map.on("error", onMapError);

    map.on("load", () => {
      mapRef.current = map;
      setMapResourceError(null);
      setIsMapLoaded(true);
    });

    return () => {
      map.off("error", onMapError);
      map.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, [token, dark, isCompact]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(dark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE);
  }, [dark]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    markersRef.current = filteredPlaces.map((place) => {
      const popupContent = [
        `<strong>${place.name}</strong>`,
        place.city || place.country
          ? `${place.city || ""}${place.city && place.country ? ", " : ""}${place.country || ""}`
          : "",
        place.visitedOn ? `Visited: ${place.visitedOn}` : "",
        place.notes ? place.notes : ""
      ]
        .filter(Boolean)
        .join("<br />");

      const popup = new mapboxgl.Popup({ offset: 18 }).setHTML(popupContent);
      const marker = new mapboxgl.Marker({ color: "#2563eb" })
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(map);

      marker.getElement().addEventListener("click", () => openPlace(place));
      bounds.extend([place.lng, place.lat]);

      return { id: place.id, marker };
    });

    if (activePlaceId && searchTerm === "") {
      const activePlace = places.find((p) => p.id === activePlaceId);
      if (activePlace) {
        openPlace(activePlace);
      }
    } else if (filteredPlaces.length > 0 && searchTerm === "") {
      map.fitBounds(bounds, {
        padding: getMapPadding(isCompact, liveSheetHeight.current),
        duration: 0
      });
    }
  }, [
    filteredPlaces,
    isCompact,
    openPlace,
    searchTerm,
    isMapLoaded,
    activePlaceId,
    places
  ]);

  // Update map size and padding when window width changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setPadding(getMapPadding(isCompact, liveSheetHeight.current));
      mapRef.current.resize();
    }
  }, [width, isCompact]);

  // Update map bottom padding as sheet height changes in compact mode
  useEffect(() => {
    if (mapRef.current && isCompact) {
      mapRef.current.setPadding(getMapPadding(true, sheetHeight));
      mapRef.current.resize();
    }
  }, [sheetHeight, isCompact]);

  const tokenMissing = !token;

  // Shared place list JSX (used in both sidebar and bottom sheet)
  const placeList = (
    <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4 custom-scrollbar">
      {favorites.length > 0 && (
        <div className="mb-4">
          <div
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${
              dark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Favorites
          </div>
          <div className="grid grid-cols-1 gap-1">
            {favorites.map((place) => {
              const isActive = place.id === activePlaceId;
              const locationLine = [place.city, place.country].filter(Boolean).join(", ");
              return (
                <button
                  key={place.id}
                  onClick={() => openPlace(place)}
                  className={`group flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : dark
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`size-8 rounded-full flex-center text-white shrink-0 ${
                      isActive ? "bg-white/20" : "bg-blue-500 shadow-sm"
                    }`}
                  >
                    <span className="i-ion:star text-lg" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div
                      className={`text-sm font-semibold truncate ${
                        isActive ? "text-white" : dark ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {place.name}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive
                          ? "text-white/80"
                          : dark
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {locationLine || "Saved place"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-2">
        <div
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${
            dark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Traveled
        </div>
        <div className="space-y-0.5">
          {traveled.map((place) => {
            const isActive = place.id === activePlaceId;
            const locationLine = [place.city, place.country].filter(Boolean).join(", ");
            return (
              <button
                key={place.id}
                onClick={() => openPlace(place)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : dark
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`size-8 rounded-lg overflow-hidden shrink-0 flex-center ${
                    isActive ? "bg-white/20" : dark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`i-ion:location text-lg ${
                      isActive ? "text-white" : "text-blue-500"
                    }`}
                  />
                </div>
                <div className="min-w-0 text-left">
                  <div
                    className={`text-sm font-semibold truncate ${
                      isActive ? "text-white" : dark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {place.name}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive
                        ? "text-white/80"
                        : dark
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                  >
                    {locationLine || "1 Place"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const searchBar = (
    <div className="px-3 py-2 shrink-0">
      <div className="relative">
        <span
          className={`absolute left-2.5 top-1/2 -translate-y-1/2 i-ion:search-outline text-sm ${
            dark ? "text-gray-500" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          placeholder="Search for a place or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => snapTo("half")}
          className={`w-full h-8 pl-8 pr-8 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none ${
            dark
              ? "bg-gray-700 text-gray-100 placeholder-gray-500"
              : "bg-gray-100 text-gray-900 placeholder-gray-400"
          }`}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors flex-center ${
              dark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            <span className="i-ion:close text-[10px] text-white" />
          </button>
        )}
      </div>
    </div>
  );

  const mapErrorOverlay = (
    <>
      {tokenMissing && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center text-sm ${
            dark ? "bg-gray-800/90 text-gray-300" : "bg-white/90 text-gray-600"
          }`}
        >
          Add `VITE_MAPBOX_TOKEN` to `.env` or `.env.local`, then restart the dev server.
        </div>
      )}
      {!tokenMissing && mapResourceError && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-6 text-center text-sm ${
            dark ? "bg-gray-800/95 text-gray-200" : "bg-white/95 text-gray-700"
          }`}
        >
          <p className="max-w-md font-medium">Map tiles could not load.</p>
          <p className="max-w-md text-xs opacity-90">
            Check the browser Network tab for{" "}
            <code className="font-mono">api.mapbox.com</code> (403 often means token URL
            restrictions). In Mapbox → Access tokens, allow this site's URL (e.g.{" "}
            <code className="font-mono">http://localhost:5173</code> for dev) or use a
            token without URL restrictions while testing.
          </p>
          <p className="max-w-md text-xs opacity-75 font-mono">{mapResourceError}</p>
        </div>
      )}
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden text-c-900 ${
        dark ? "bg-gray-900" : "bg-[#f5f5f7]"
      }`}
    >
      <style>{`
        .mapboxgl-popup-close-button {
          padding: 8px 10px !important;
          font-size: 16px !important;
          color: ${dark ? "#999" : "#666"} !important;
          border-radius: 0 8px 0 0 !important;
        }
        .mapboxgl-popup-close-button:hover {
          background-color: transparent !important;
          color: ${dark ? "#fff" : "#000"} !important;
        }
        .mapboxgl-popup-content {
          padding: 15px 18px !important;
          border-radius: 12px !important;
          background-color: ${dark ? "#1f1f1f" : "#fff"} !important;
          color: ${dark ? "#e5e5e5" : "#000"} !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,${dark ? "0.5" : "0.1"}), 0 8px 10px -6px rgba(0,0,0,${dark ? "0.3" : "0.1"}) !important;
        }
      `}</style>

      {isCompact ? (
        /* ── iOS-style layout: full-screen map + draggable bottom sheet ── */
        <div className="relative w-full h-full">
          {/* Map fills entire container */}
          <div ref={mapContainerRef} className="w-full h-full" />
          {mapErrorOverlay}

          {/* Bottom sheet */}
          <div
            className={`absolute bottom-0 left-0 right-0 flex flex-col rounded-t-2xl shadow-2xl overflow-hidden ${
              dark ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              height: sheetHeight,
              transition: isDraggingRef.current
                ? "none"
                : "height 0.3s cubic-bezier(0.32,0.72,0,1)"
            }}
          >
            {/* Drag handle */}
            <div
              className="shrink-0 flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className={`w-10 h-1 rounded-full ${dark ? "bg-gray-600" : "bg-gray-300"}`}
              />
            </div>

            {searchBar}
            {placeList}
          </div>
        </div>
      ) : (
        /* ── Desktop layout: sidebar + map side by side ── */
        <div className="h-full flex">
          <div
            className={`w-72 h-full border-r ${
              dark ? "border-gray-700 bg-gray-800/90" : "border-gray-200 bg-white/90"
            } backdrop-blur flex flex-col overflow-hidden`}
          >
            {searchBar}
            {placeList}
          </div>

          <div className={`flex-1 relative ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
            {mapErrorOverlay}
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Maps;
