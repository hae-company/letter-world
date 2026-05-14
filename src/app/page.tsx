"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { WriteModal } from "@/components/write-modal";
import { ReadModal } from "@/components/read-modal";
import { PaperPlane } from "@/components/paper-plane";
import { Footer } from "@/components/footer";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import type { Letter } from "@/lib/redis";

const WorldMap = dynamic(() => import("@/components/world-map").then(m => ({ default: m.WorldMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#f5ead6] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">&#x2708;</div>
        <p className="text-[#b0986a] font-[family-name:var(--font-caveat)] text-xl">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [writeOpen, setWriteOpen] = useState(false);
  const [readLetter, setReadLetter] = useState<Letter | null>(null);
  const [sending, setSending] = useState(false);
  const [planeVisible, setPlaneVisible] = useState(false);
  const [sentLocation, setSentLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    fetch("/api/letters").then(r => r.json()).then(setLetters).catch(() => {});
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
    setTimeout(() => { setPlaneVisible(false); setSentLocation(null); }, 2000);
  }, []);

  const openRandomLetter = useCallback(() => {
    if (letters.length === 0) return;
    const random = letters[Math.floor(Math.random() * letters.length)];
    setReadLetter(random);
    setFlyTo({ lat: random.lat, lng: random.lng });
  }, [letters]);

  return (
    <div className="h-full relative">
      <WorldMap letters={letters} onLetterClick={setReadLetter} flyTo={flyTo} />

      <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto px-4 py-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40">
          <h1 className="text-lg font-[family-name:var(--font-caveat)] text-[#5a4a20]">
            &#x2709; {t(locale, "title")}
          </h1>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="px-3 py-2 bg-white/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/40 text-sm">
              {LOCALES.find(l => l.id === locale)?.flag}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden">
                {LOCALES.map(l => (
                  <button key={l.id} onClick={() => { setLocale(l.id); setLangOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#f0e4c8] ${locale === l.id ? "bg-[#f0e4c8]" : ""}`}>
                    <span>{l.flag}</span><span className="text-[#5a4a20]">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="px-3 py-2 bg-white/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/40 text-xs text-[#8b6914] font-[family-name:var(--font-caveat)] text-base">
            {letters.length} {t(locale, "letterCount")}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <button onClick={openRandomLetter} disabled={letters.length === 0}
          className="px-5 py-3 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 text-[#8b6914] font-[family-name:var(--font-caveat)] text-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-40">
          &#x1F3B2; {t(locale, "randomLetter")}
        </button>
        <button onClick={() => setWriteOpen(true)}
          className="px-6 py-3 bg-[#8b6914] text-white rounded-2xl shadow-lg font-[family-name:var(--font-caveat)] text-lg tracking-wider hover:bg-[#a07818] hover:scale-105 active:scale-95 transition-all">
          &#x270F; {t(locale, "writeLetter")}
        </button>
      </div>

      <WriteModal open={writeOpen} onClose={() => setWriteOpen(false)} onSend={handleSend} sending={sending} locale={locale} />
      <ReadModal letter={readLetter} onClose={() => setReadLetter(null)} locale={locale} />
      <PaperPlane visible={planeVisible} locationName={sentLocation?.name || ""} onComplete={handlePlaneComplete} locale={locale} />
      <Footer />
    </div>
  );
}
