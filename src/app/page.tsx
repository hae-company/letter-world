"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { WriteModal } from "@/components/write-modal";
import { ReadModal } from "@/components/read-modal";
import { PaperPlane } from "@/components/paper-plane";
import { LoadingScreen } from "@/components/loading-screen";
import { Footer } from "@/components/footer";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import type { Letter } from "@/lib/redis";

const WorldMap = dynamic(
  () => import("@/components/world-map").then(m => ({ default: m.WorldMap })),
  { ssr: false }
);

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [readLetter, setReadLetter] = useState<Letter | null>(null);
  const [sending, setSending] = useState(false);
  const [planeVisible, setPlaneVisible] = useState(false);
  const [sentLocation, setSentLocation] = useState<{lat:number;lng:number;name:string}|null>(null);
  const [flyTo, setFlyTo] = useState<{lat:number;lng:number}|null>(null);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    fetch("/api/letters")
      .then(r => r.json())
      .then(data => { setLetters(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const handleSend = useCallback(async (data: {to:string;body:string;from:string}) => {
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
    } catch (err) { console.error("Send error:", err); }
    setSending(false);
  }, []);

  const handlePlaneComplete = useCallback(() => {
    setTimeout(() => { setPlaneVisible(false); setSentLocation(null); }, 2500);
  }, []);

  const clearFlyTo = useCallback(() => setFlyTo(null), []);

  const openRandomLetter = useCallback(() => {
    if (letters.length === 0) return;
    const r = letters[Math.floor(Math.random() * letters.length)];
    setReadLetter(r);
    setFlyTo({ lat: r.lat, lng: r.lng });
  }, [letters]);

  const handleLetterClick = useCallback((letter: Letter) => {
    setReadLetter(letter);
  }, []);

  return (
    <div className="h-full relative">
      <LoadingScreen />

      {/* Map */}
      <WorldMap
        letters={letters}
        onLetterClick={handleLetterClick}
        flyTo={flyTo}
        onFlyDone={clearFlyTo}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto px-4 py-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-md border border-white/50">
          <h1 className="text-lg sm:text-xl font-[family-name:var(--font-caveat)] text-[#4a3a15]">
            ✉️ {t(locale, "title")}
          </h1>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-9 h-9 bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-white/50 flex items-center justify-center text-sm hover:bg-white/90 transition-colors"
            >
              {LOCALES.find(l => l.id === locale)?.flag}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/60 overflow-hidden z-50">
                  {LOCALES.map(l => (
                    <button
                      key={l.id}
                      onClick={() => { setLocale(l.id); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 hover:bg-[#f0e4c8] transition-colors ${locale === l.id ? "bg-[#f0e4c8]" : ""}`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className="text-[#4a3a15]">{l.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Count */}
          <div className="px-3 py-2 bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-white/50 text-[#8b6914] font-[family-name:var(--font-caveat)] text-base">
            {letters.length} {t(locale, "letterCount")}
          </div>
        </div>
      </div>

      {/* Empty state hint */}
      {loaded && letters.length === 0 && !writeOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-fade-in-up pointer-events-none">
          <div className="text-5xl mb-4 animate-float">✉️</div>
          <p className="text-[#8b6914] font-[family-name:var(--font-caveat)] text-2xl mb-1">
            아직 편지가 없어요
          </p>
          <p className="text-[#b09868] font-[family-name:var(--font-caveat)] text-lg">
            첫 번째 편지를 세계에 보내보세요
          </p>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3">
        {letters.length > 0 && (
          <button
            onClick={openRandomLetter}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white/75 backdrop-blur-xl rounded-2xl shadow-md border border-white/50 text-[#8b6914] font-[family-name:var(--font-caveat)] text-base sm:text-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all"
          >
            🎲 {t(locale, "randomLetter")}
          </button>
        )}
        <button
          onClick={() => setWriteOpen(true)}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#8b6914] text-white rounded-2xl shadow-lg font-[family-name:var(--font-caveat)] text-base sm:text-lg hover:bg-[#9a7818] hover:scale-105 active:scale-95 transition-all"
        >
          ✏️ {t(locale, "writeLetter")}
        </button>
      </div>

      {/* Modals */}
      <WriteModal open={writeOpen} onClose={() => setWriteOpen(false)} onSend={handleSend} sending={sending} locale={locale} />
      <ReadModal letter={readLetter} onClose={() => setReadLetter(null)} locale={locale} />
      <PaperPlane visible={planeVisible} locationName={sentLocation?.name || ""} onComplete={handlePlaneComplete} locale={locale} />
      <Footer />
    </div>
  );
}
