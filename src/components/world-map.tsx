"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Letter } from "@/lib/redis";

interface Props {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
  flyTo?: { lat: number; lng: number } | null;
}

const TILE_URL = "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg";
const LABEL_URL = "https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}.png";

const envelopeIcon = (hearts: number) => L.divIcon({
  html: `<div style="font-size:26px;cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));text-align:center;position:relative;">&#x2709;${hearts > 0 ? '<span style="font-size:10px;position:absolute;top:-6px;right:-8px;background:#e85d75;color:white;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;">' + hearts + '</span>' : ''}</div>`,
  className: "letter-marker",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export function WorldMap({ letters, onLetterClick, flyTo }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = L.map(mapContainer.current, {
      center: [20, 0], zoom: 3, minZoom: 2, maxZoom: 10,
      zoomControl: false, attributionControl: false,
    });
    L.tileLayer(TILE_URL, { maxZoom: 18 }).addTo(map);
    L.tileLayer(LABEL_URL, { maxZoom: 18, opacity: 0.4 }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    for (const letter of letters) {
      const marker = L.marker([letter.lat, letter.lng], { icon: envelopeIcon(letter.hearts) })
        .addTo(mapRef.current).on("click", () => onLetterClick(letter));
      markersRef.current.push(marker);
    }
  }, [letters, onLetterClick]);

  useEffect(() => {
    if (!mapRef.current || !flyTo) return;
    mapRef.current.flyTo([flyTo.lat, flyTo.lng], 5, { duration: 2 });
  }, [flyTo]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
