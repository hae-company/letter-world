"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import type { Letter } from "@/lib/redis";

interface Props {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
  flyTo?: { lat: number; lng: number } | null;
  onFlyDone?: () => void;
}

const TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function makeIcon(hearts: number) {
  const badge = hearts > 0
    ? `<span style="position:absolute;top:-5px;right:-7px;background:#e85d75;color:#fff;border-radius:50%;width:15px;height:15px;font-size:9px;display:flex;align-items:center;justify-content:center;font-family:sans-serif;">${hearts}</span>`
    : "";
  return L.divIcon({
    html: `<div style="font-size:24px;cursor:pointer;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.25));position:relative;transition:transform .15s;" onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">&#x2709;&#xFE0F;${badge}</div>`,
    className: "letter-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function WorldMap({ letters, onLetterClick, flyTo, onFlyDone }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = L.map(container.current, {
      center: [25, 10],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });
    L.tileLayer(TILE, { maxZoom: 18 }).addTo(m);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  // Sync markers
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markers.current.forEach(mk => mk.remove());
    markers.current = [];
    for (const letter of letters) {
      const mk = L.marker([letter.lat, letter.lng], { icon: makeIcon(letter.hearts) })
        .addTo(m)
        .on("click", () => onLetterClick(letter));
      markers.current.push(mk);
    }
  }, [letters, onLetterClick]);

  // Fly to
  useEffect(() => {
    if (!map.current || !flyTo) return;
    map.current.flyTo([flyTo.lat, flyTo.lng], 6, { duration: 2 });
    const timer = setTimeout(() => onFlyDone?.(), 2200);
    return () => clearTimeout(timer);
  }, [flyTo, onFlyDone]);

  return <div ref={container} className="w-full h-full" />;
}
