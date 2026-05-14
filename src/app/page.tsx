"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { WriteModal } from "@/components/write-modal";
import { ReadModal } from "@/components/read-modal";
import { PaperPlane } from "@/components/paper-plane";
import { Footer } from "@/components/footer";
import type { Letter } from "@/lib/redis";

const WorldMap = dynamic(() => import("@/components/world-map").then(m => ({ default: m.WorldMap })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f5ead6] flex items-center justify-center text-[#b0986a] font-[family-name:var(--font-caveat)] text-2xl">지도를 불러오는 중...</div>,
});



export default function Home() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [writeOpen, setWriteOpen] = useState(false);
  const [readLetter, setReadLetter] = useState<Letter | null>(null);
  const [sending, setSending] = useState(false);
  const [planeVisible, setPlaneVisible] = useState(false);
  const [sentLocation, setSentLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);

  // Load letters
  useEffect(() => {
    fetch("/api/letters")
      .then(r => r.json())
      .then(setLetters)
      .catch(() => {});
  }, []);

  const handleSend = useCallback(async (data: { to: string; body: string; from: string }) => {
    setSending(true);
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const letter = await res.json();
      if (letter.id) {
        setWriteOpen(false);
        setSentLocation({ lat: letter.lat, lng: letter.lng, name: letter.locationName });
        setPlaneVisible(true);
        setFlyTo({ lat: letter.lat, lng: letter.lng });
        setLetters(prev => [letter, ...prev]);
      }
    } catch (err) {
      console.error("Send error:", err);
    }
    setSending(false);
  }, []);

  const handlePlaneComplete = useCallback(() => {
    setTimeout(() => {
      setPlaneVisible(false);
      setSentLocation(null);
    }, 2000);
  }, []);

  return (
    <div className="h-full relative">
      {/* Map */}
      <WorldMap
        letters={letters}
        onLetterClick={setReadLetter}
        
        flyTo={flyTo}
      />

      {/* Top bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className="px-5 py-2 bg-[#fdf6e3]/80 backdrop-blur-md rounded-full shadow-lg border border-[#d4c4a0]">
          <h1 className="text-lg font-[family-name:var(--font-caveat)] text-[#5a4a20] tracking-wide">
            Letter to the World
          </h1>
        </div>
      </div>

      {/* Letter count */}
      <div className="absolute top-4 right-4 z-30 px-3 py-1.5 bg-[#fdf6e3]/70 backdrop-blur-sm rounded-lg text-xs text-[#8b6914]">
        ✉️ {letters.length}통의 편지
      </div>

      {/* Write button */}
      <button
        onClick={() => setWriteOpen(true)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-[#8b6914] text-white rounded-full shadow-xl hover:bg-[#a07818] transition-all font-[family-name:var(--font-caveat)] text-lg tracking-wider hover:scale-105 active:scale-95"
      >
        ✏️ 편지 쓰기
      </button>

      {/* Modals */}
      <WriteModal open={writeOpen} onClose={() => setWriteOpen(false)} onSend={handleSend} sending={sending} />
      <ReadModal letter={readLetter} onClose={() => setReadLetter(null)} />
      <PaperPlane
        visible={planeVisible}
        locationName={sentLocation?.name || ""}
        onComplete={handlePlaneComplete}
      />

      <Footer />
    </div>
  );
}
