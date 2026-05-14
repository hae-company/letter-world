"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import type { Letter } from "@/lib/redis";

interface Props {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
  accessToken: string;
  flyTo?: { lat: number; lng: number } | null;
}

export function WorldMap({ letters, onLetterClick, accessToken, flyTo }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // Vintage / outdoors style
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [0, 20],
      zoom: 2,
      projection: "globe",
      attributionControl: false,
    });

    // Apply vintage color overrides after style loads
    map.on("style.load", () => {
      // Warm tint on the globe
      map.setFog({
        color: "rgb(240, 230, 210)",
        "high-color": "rgb(200, 180, 150)",
        "horizon-blend": 0.05,
        "space-color": "rgb(230, 220, 200)",
        "star-intensity": 0.0,
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken]);

  // Update markers when letters change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    for (const letter of letters) {
      // Create envelope marker element
      const el = document.createElement("div");
      el.innerHTML = `<div style="
        font-size: 28px;
        cursor: pointer;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.3) rotate(-5deg)'" onmouseout="this.style.transform='scale(1)'">&#x2709;</div>`;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([letter.lng, letter.lat])
        .addTo(mapRef.current!);

      el.addEventListener("click", () => onLetterClick(letter));

      markersRef.current.push(marker);
    }
  }, [letters, onLetterClick]);

  // Fly to location when letter is sent
  useEffect(() => {
    if (!mapRef.current || !flyTo) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: 5,
      duration: 3000,
      essential: true,
    });
  }, [flyTo]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
