import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { maps } from "~/configs";
import type { MapPlace } from "~/types";

interface MapsProps {
  width?: number;
}

interface MarkerEntry {
  id: string;
  marker: mapboxgl.Marker;
}

const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
const DEFAULT_CENTER: [number, number] = [0, 20];
const getMapPadding = (compact: boolean) =>
  compact
    ? { top: 40, bottom: 40, left: 40, right: 40 }
    : { top: 40, bottom: 40, left: 320, right: 40 };

const Maps = ({ width = 1024 }: MapsProps) => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(
    maps.places[0]?.id ?? null
  );

  const places = maps.places;
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
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: 1.4
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      const bounds = new mapboxgl.LngLatBounds();

      markersRef.current = places.map((place) => {
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

      if (places.length > 0) {
        map.fitBounds(bounds, { padding: getMapPadding(isCompact), duration: 0 });
      }

      if (places[0]) openPlace(places[0]);
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [isCompact, openPlace, places, token]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setPadding(getMapPadding(width < 720));
    }
    mapRef.current?.resize();
  }, [width]);

  const tokenMissing = !token;

  return (
    <div className="w-full h-full bg-[#f5f5f7] text-c-900">
      <div className="h-10 flex items-center justify-between px-3 bg-white/80 border-b border-gray-200">
        <div className="font-semibold text-sm">Maps</div>
        <div className="flex-1 flex items-center justify-center px-3">
          <div className="h-6 w-full max-w-sm px-2 rounded-md bg-gray-100 text-xs text-gray-500 flex items-center">
            Search (coming soon)
          </div>
        </div>
        <div className="text-xs text-gray-500">{places.length} places</div>
      </div>

      <div className={`h-[calc(100%-40px)] flex ${isCompact ? "flex-col" : ""}`}>
        <div
          className={`${
            isCompact
              ? "w-full max-h-56 border-b border-gray-200"
              : "w-72 border-r border-gray-200"
          } bg-white/90 backdrop-blur`}
        >
          <div className="px-3 pt-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Saved places
          </div>
          <div className="px-2 pb-3 space-y-1 overflow-y-auto max-h-full">
            {places.map((place) => {
              const isActive = place.id === activePlaceId;
              const locationLine = [place.city, place.country].filter(Boolean).join(", ");

              return (
                <button
                  key={place.id}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    isActive ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                  }`}
                  onClick={() => openPlace(place)}
                >
                  <div className="text-sm font-semibold">{place.name}</div>
                  {locationLine && (
                    <div className="text-xs text-gray-500">{locationLine}</div>
                  )}
                  {place.visitedOn && (
                    <div className="text-[11px] text-gray-400">
                      Visited {place.visitedOn}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 relative bg-gray-100">
          {tokenMissing && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 text-sm text-gray-600">
              Add `VITE_MAPBOX_TOKEN` to `.env.local` to load the map.
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
