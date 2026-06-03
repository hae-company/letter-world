"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, type Locale } from "@/lib/i18n";
import type { Letter } from "@/lib/redis";

const STAMPS = ["🌍", "✈️", "🕊️", "🌸", "⭐", "🎭", "🏔️", "🌊", "🎪", "🎨"];
const CHEERS = [
  { emoji: "❤️", label: "사랑" },
  { emoji: "🤗", label: "응원" },
  { emoji: "💪", label: "힘내" },
  { emoji: "🌟", label: "멋져" },
  { emoji: "🍀", label: "행운" },
];

interface Props {
  letter: Letter | null;
  onClose: () => void;
  locale: Locale;
}

export function ReadModal({ letter, onClose, locale }: Props) {
  const [hearts, setHearts] = useState(0);
  const [cheerSent, setCheerSent] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  // Reset when letter changes
  useEffect(() => {
    if (letter) {
      setHearts(letter.hearts || 0);
      setCheerSent(false);
      setSelectedEmoji("");
    }
  }, [letter?.id]);

  const handleCheer = async (emoji: string) => {
    if (cheerSent || !letter) return;
    setSelectedEmoji(emoji);
    setCheerSent(true);
    setHearts(h => h + 1);
    try {
      await fetch("/api/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId: letter.id }),
      });
    } catch {}
  };

  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Wax seal */}
            <div className="flex justify-center -mb-5 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-10 h-10 rounded-full bg-[#c0392b] shadow-lg flex items-center justify-center text-white text-sm font-bold border-2 border-[#a93226]"
              >
                ♥
              </motion.div>
            </div>

            {/* Letter */}
            <div
              className="bg-[#fdf6e3] rounded-xl shadow-2xl px-5 sm:px-7 pt-6 sm:pt-8 pb-5 sm:pb-6 relative"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 30px, rgba(190,170,130,0.2) 31px)",
                boxShadow: "0 16px 48px rgba(80,60,10,0.2), 0 0 0 1px rgba(180,160,120,0.15)",
              }}
            >
              {/* Stamp */}
              <div className="absolute top-4 right-4 text-xl opacity-60 rotate-6">
                {STAMPS[letter.stampIdx % STAMPS.length]}
              </div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#ecdcc0]/50 rounded-full text-[10px] text-[#907840] mb-4"
              >
                📍 {letter.locationName}
              </motion.div>

              {/* To */}
              <p className="text-[10px] text-[#b09868] uppercase tracking-[0.15em]">{t(locale, "to")}</p>
              <p className="text-2xl text-[#4a3a15] font-[family-name:var(--font-caveat)] mb-4 pb-2 border-b border-[#e8dcc0]">
                {letter.to}
              </p>

              {/* Body */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[22px] text-[#3a2e10] font-[family-name:var(--font-nanum-pen)] leading-[31px] min-h-[100px] whitespace-pre-wrap"
              >
                {letter.body}
              </motion.p>

              {/* From + Date */}
              <div className="flex items-end justify-between mt-6 pt-3 border-t border-[#e8dcc0]">
                <div>
                  <p className="text-[10px] text-[#b09868] uppercase tracking-[0.15em]">{t(locale, "from")}</p>
                  <p className="text-xl text-[#4a3a15] font-[family-name:var(--font-caveat)]">{letter.from}</p>
                </div>
                <span className="text-[10px] text-[#c4a868]">
                  {new Date(letter.createdAt).toLocaleDateString(
                    locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              </div>

              {/* Cheer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-5 pt-4 border-t border-[#e8dcc0]"
              >
                {!cheerSent ? (
                  <>
                    <p className="text-sm text-[#b09868] font-[family-name:var(--font-caveat)] text-[17px] mb-2.5">
                      {t(locale, "cheerPrompt")}
                    </p>
                    <div className="flex gap-2">
                      {CHEERS.map(c => (
                        <button
                          key={c.emoji}
                          onClick={() => handleCheer(c.emoji)}
                          className="flex-1 py-2 rounded-xl bg-[#f0e4c8]/60 hover:bg-[#e8d8b8] flex flex-col items-center gap-0.5 transition-all hover:scale-105 active:scale-95"
                        >
                          <span className="text-lg">{c.emoji}</span>
                          <span className="text-[9px] text-[#a08850]">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-2 py-2"
                  >
                    <span className="text-2xl">{selectedEmoji}</span>
                    <span className="text-[#8b6914] font-[family-name:var(--font-caveat)] text-lg">
                      {t(locale, "cheerSent")} ({hearts})
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Close + Share */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white/70 text-sm hover:bg-white/30 hover:text-white transition-all"
              >
                {t(locale, "tapToClose")}
              </button>
              <button
                onClick={() => {
                  const url = typeof window !== "undefined" ? window.location.origin + "?letter=" + letter.id : "";
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: "Letter to the World", text: letter.body.slice(0, 80) + "...", url });
                  } else if (typeof navigator !== "undefined") {
                    navigator.clipboard.writeText(url);
                    alert("링크가 복사되었어요!");
                  }
                }}
                className="px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white/70 text-sm hover:bg-white/30 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>&#x1F517;</span> 공유하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
