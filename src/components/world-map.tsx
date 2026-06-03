"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import type { Letter } from "@/lib/redis";

interface Props {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
  flyTo?: { lat: number; lng: number } | null;
  onFlyDone?: () => void;
}

const TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function makeIcon() {
  return L.divIcon({
    html: `<div class="letter-icon" style="font-size:32px;text-align:center;line-height:1;">
      <span style="display:block;">&#x1F48C;</span>
    </div>`,
    className: "letter-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function WorldMap({ letters, onLetterClick, flyTo, onFlyDone }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = L.map(container.current, {
      center: [25, 10],
      zoom: 3,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });
    L.tileLayer(TILE, { maxZoom: 18 }).addTo(m);
    L.control.zoom({ position: "bottomright" }).addTo(m);

    const cluster = (L as unknown as { markerClusterGroup: (opts: unknown) => L.MarkerClusterGroup }).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (c: { getChildCount: () => number }) => {
        const count = c.getChildCount();
        const size = count > 10 ? 52 : count > 5 ? 46 : 40;
        return L.divIcon({
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background: linear-gradient(135deg, #c9935a 0%, #8b6914 100%);
            color:#fff;font-size:${count > 10 ? 15 : 13}px;font-weight:700;
            display:flex;align-items:center;justify-content:center;
            box-shadow: 0 4px 16px rgba(100,70,10,0.4), 0 0 0 3px rgba(255,255,255,0.5);
            font-family:system-ui;
            letter-spacing:-0.5px;
          "><span style="margin-right:2px;">&#x1F48C;</span>${count}</div>`,
          className: "letter-cluster",
          iconSize: [size, size],
          iconAnchor: [size/2, size/2],
        });
      },
    });
    m.addLayer(cluster);
    clusterRef.current = cluster;
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    for (const letter of letters) {
      const mk = L.marker([letter.lat, letter.lng], { icon: makeIcon() })
        .on("click", () => onLetterClick(letter));
      cluster.addLayer(mk);
    }
  }, [letters, onLetterClick]);

  useEffect(() => {
    if (!map.current || !flyTo) return;
    map.current.flyTo([flyTo.lat, flyTo.lng], 6, { duration: 2 });
    const timer = setTimeout(() => onFlyDone?.(), 2200);
    return () => clearTimeout(timer);
  }, [flyTo, onFlyDone]);

  return <div ref={container} className="w-full h-full" />;
}
