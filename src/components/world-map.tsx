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
    html: '<div style="font-size:22px;cursor:pointer;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.2));transition:transform .15s;" onmouseover="this.style.transform=\'scale(1.25)\'" onmouseout="this.style.transform=\'scale(1)\'">&#x2709;&#xFE0F;</div>',
    className: "letter-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
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

    // Cluster group with custom styling
    const cluster = (L as unknown as { markerClusterGroup: (opts: unknown) => L.MarkerClusterGroup }).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (c: { getChildCount: () => number }) => {
        const count = c.getChildCount();
        return L.divIcon({
          html: `<div style="
            width:38px;height:38px;border-radius:50%;
            background:rgba(139,105,20,0.85);
            color:#fff;font-size:13px;font-weight:bold;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 8px rgba(100,70,10,0.3);
            border:2px solid rgba(255,255,255,0.5);
            font-family:system-ui;
          ">&#x2709; ${count}</div>`,
          className: "letter-cluster",
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });
      },
    });
    m.addLayer(cluster);
    clusterRef.current = cluster;

    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  // Sync markers into cluster
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

  // Fly to
  useEffect(() => {
    if (!map.current || !flyTo) return;
    map.current.flyTo([flyTo.lat, flyTo.lng], 6, { duration: 2 });
    const timer = setTimeout(() => onFlyDone?.(), 2200);
    return () => clearTimeout(timer);
  }, [flyTo, onFlyDone]);

  return <div ref={container} className="w-full h-full" />;
}
