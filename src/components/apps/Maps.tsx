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
const getMapPadding = (compact: boolean) =>
  compact
    ? { top: 40, bottom: 40, left: 40, right: 40 }
    : { top: 40, bottom: 40, left: 320, right: 40 };

const Maps = ({ width = 1024 }: MapsProps) => {
  const rawToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const token = rawToken?.trim();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapResourceError, setMapResourceError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dark = useStore((state) => state.dark);

  const places = maps.places;

  // Set initial active place to the first favorite
  useEffect(() => {
    const firstFavorite = places.find((p) => p.favorite);
    if (firstFavorite) {
      setActivePlaceId(firstFavorite.id);
    } else if (places.length > 0) {
      setActivePlaceId(places[0].id);
    }
  }, [places]);

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

  const isCompact = width < 720;

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
  }, [token, dark]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(dark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE);
  }, [dark]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    // Remove old markers
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
      map.fitBounds(bounds, { padding: getMapPadding(isCompact), duration: 0 });
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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setPadding(getMapPadding(width < 720));
    }
    mapRef.current?.resize();
  }, [width]);

  const tokenMissing = !token;

  return (
    <div
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
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, ${dark ? "0.5" : "0.1"}), 0 8px 10px -6px rgba(0, 0, 0, ${dark ? "0.3" : "0.1"}) !important;
        }
      `}</style>
      <div className={`h-full flex ${isCompact ? "flex-col" : ""}`}>
        <div
          className={`${
            isCompact
              ? `w-full max-h-[40%] border-b ${
                  dark ? "border-gray-700" : "border-gray-200"
                }`
              : `w-72 h-full border-r ${dark ? "border-gray-700" : "border-gray-200"}`
          } ${dark ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur flex flex-col overflow-hidden`}
        >
          {/* Search Bar in Sidebar */}
          <div className="p-3">
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
                    dark
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  <span className="i-ion:close text-[10px] text-white" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3 custom-scrollbar">
            {/* Favorites Section */}
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
                    const locationLine = [place.city, place.country]
                      .filter(Boolean)
                      .join(", ");

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
                              isActive
                                ? "text-white"
                                : dark
                                  ? "text-gray-100"
                                  : "text-gray-900"
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

            {/* Traveled Section */}
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
                  const locationLine = [place.city, place.country]
                    .filter(Boolean)
                    .join(", ");

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
                        {/* Placeholder for place image or icon */}
                        <span
                          className={`i-ion:location text-lg ${
                            isActive ? "text-white" : "text-blue-500"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 text-left">
                        <div
                          className={`text-sm font-semibold truncate ${
                            isActive
                              ? "text-white"
                              : dark
                                ? "text-gray-100"
                                : "text-gray-900"
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
        </div>

        <div className={`flex-1 relative ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
          {tokenMissing && (
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center text-sm ${
                dark ? "bg-gray-800/90 text-gray-300" : "bg-white/90 text-gray-600"
              }`}
            >
              Add `VITE_MAPBOX_TOKEN` to `.env` or `.env.local`, then restart the dev
              server.
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
                <code className="font-mono">api.mapbox.com</code> (403 often means token
                URL restrictions). In Mapbox → Access tokens, allow this site’s URL (e.g.{" "}
                <code className="font-mono">http://localhost:5173</code> for dev) or use a
                token without URL restrictions while testing.
              </p>
              <p className="max-w-md text-xs opacity-75 font-mono">{mapResourceError}</p>
            </div>
          )}
          <div
            ref={mapContainerRef}
            className={`w-full ${isCompact ? "min-h-[260px]" : "h-full"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Maps;
