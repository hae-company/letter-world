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
      .then((data: Letter[]) => {
        setLetters(data);
        setLoaded(true);
        // URL에 ?letter=id 파라미터 있으면 해당 편지 열기 (공유 링크)
        const params = new URLSearchParams(window.location.search);
        const letterId = params.get("letter");
        if (letterId) {
          const found = data.find(l => l.id === letterId);
          if (found) {
            setReadLetter(found);
            setFlyTo({ lat: found.lat, lng: found.lng });
          }
        }
      })
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
  const handleLetterClick = useCallback((letter: Letter) => setReadLetter(letter), []);

  return (
    <div className="h-full relative">
      <LoadingScreen />
      <WorldMap letters={letters} onLetterClick={handleLetterClick} flyTo={flyTo} onFlyDone={clearFlyTo} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white/75 backdrop-blur-xl rounded-full shadow-md border border-[#e0d0b0]/60">
          <h1 className="text-sm sm:text-xl font-[family-name:var(--font-caveat)] text-[#6a5420] flex items-center gap-1">
            <span className="animate-sway inline-block">&#x1F48C;</span>
            <span className="hidden xs:inline">{t(locale, "title")}</span>
            <span className="xs:hidden">Letter</span>
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/75 backdrop-blur-xl rounded-full shadow-md border border-[#e0d0b0]/60 flex items-center justify-center text-sm sm:text-base hover:bg-white/90 transition-colors"
            >
              {LOCALES.find(l => l.id === locale)?.flag}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#e0d0b0]/50 overflow-hidden z-50 min-w-[130px]">
                  {LOCALES.map(l => (
                    <button key={l.id} onClick={() => { setLocale(l.id); setLangOpen(false); }}
                      className={`w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-[#f5ead6] transition-colors ${locale === l.id ? "bg-[#f5ead6]" : ""}`}>
                      <span className="text-base">{l.flag}</span>
                      <span className="text-[#4a3a15]">{l.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Count */}
          <div className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-white/75 backdrop-blur-xl rounded-full shadow-md border border-[#e0d0b0]/60 text-[#8b6914] font-[family-name:var(--font-caveat)] text-xs sm:text-base">
            &#x2709;&#xFE0F; {letters.length}<span className="hidden sm:inline"> {t(locale, "letterCount")}</span>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {loaded && letters.length === 0 && !writeOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-fade-in-up pointer-events-none px-6">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-5 animate-float">&#x1F48C;</div>
          <p className="text-[#6a5420] font-[family-name:var(--font-caveat)] text-2xl sm:text-3xl mb-1 sm:mb-2">
            아직 편지가 없어요
          </p>
          <p className="text-[#b09868] font-[family-name:var(--font-caveat)] text-base sm:text-xl">
            첫 번째 편지를 세계에 보내보세요
          </p>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-[90%] sm:w-auto">
        <button
          onClick={() => setWriteOpen(true)}
          className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#8b6914] to-[#a07818] text-white rounded-full shadow-lg font-[family-name:var(--font-caveat)] text-base sm:text-lg hover:from-[#9a7818] hover:to-[#b08820] hover:scale-105 active:scale-95 transition-all hover:shadow-xl"
        >
          &#x270F;&#xFE0F; {t(locale, "writeLetter")}
        </button>
        {letters.length > 0 && (
          <button
            onClick={openRandomLetter}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-[#e0d0b0]/60 text-[#8b6914] font-[family-name:var(--font-caveat)] text-sm sm:text-base hover:bg-white/95 hover:scale-105 active:scale-95 transition-all"
          >
            &#x1F3B2; {t(locale, "randomLetter")}
          </button>
        )}
      </div>

      <WriteModal open={writeOpen} onClose={() => setWriteOpen(false)} onSend={handleSend} sending={sending} locale={locale} />
      <ReadModal letter={readLetter} onClose={() => setReadLetter(null)} locale={locale} />
      <PaperPlane visible={planeVisible} locationName={sentLocation?.name || ""} onComplete={handlePlaneComplete} locale={locale} />
      <Footer />
    </div>
  );
}
