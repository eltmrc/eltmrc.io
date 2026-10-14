import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GEO } from "./data";

/** A real OpenStreetMap of the subject's location history, markers + path. */
export function LocationMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);

    const pts = GEO.map((p) => [p.lat, p.lng] as [number, number]);

    // path through the years
    L.polyline(pts, {
      color: "#a855c8",
      weight: 2.5,
      opacity: 0.8,
      dashArray: "4 6",
    }).addTo(map);

    GEO.forEach((p, i) => {
      const last = i === GEO.length - 1;
      L.circleMarker([p.lat, p.lng], {
        radius: last ? 9 : 7,
        color: "#fff",
        weight: 2,
        fillColor: p.origin ? "#e879b8" : last ? "#a855c8" : "#7b5cd6",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(`${p.year} · ${p.place}`, {
          direction: "top",
          offset: [0, -6],
          className: "mosaic-maptip",
        });
    });

    map.fitBounds(L.latLngBounds(pts).pad(0.3));

    return () => {
      map.remove();
    };
  }, []);

  return <div className="mosaic-map" ref={ref} aria-label="Location history map" />;
}
