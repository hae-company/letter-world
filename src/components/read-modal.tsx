"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Letter } from "@/lib/redis";

import { t, type Locale } from "@/lib/i18n";

interface Props {
  letter: Letter | null;
  onClose: () => void;
  locale: Locale;
}

const STAMPS = ["🌍", "✈️", "🕊️", "🌸", "⭐", "🎭", "🏔️", "🌊", "🎪", "🎨"];
const CHEERS = ["❤️", "🤗", "💪", "🌟", "🍀"];

export function ReadModal({ letter, onClose, locale }: Props) {
  const [hearts, setHearts] = useState(0);
  const [selectedCheer, setSelectedCheer] = useState<string | null>(null);
  const [cheerSent, setCheerSent] = useState(false);

  // Reset on new letter
  if (letter && hearts === 0 && letter.hearts > 0) {
    setHearts(letter.hearts);
  }

  const handleCheer = async (emoji: string) => {
    if (cheerSent || !letter) return;
    setSelectedCheer(emoji);
    setCheerSent(true);
    setHearts(h => h + 1);
    try {
      await fetch("/api/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId: letter.id }),
      });
    } catch { /* ignore */ }
  };

  const handleClose = () => {
    setHearts(0);
    setSelectedCheer(null);
    setCheerSent(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            {/* Envelope top flap */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 180 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-8 bg-[#d4b896] rounded-t-lg mx-4"
              style={{ transformOrigin: "top", perspective: 400 }}
            />

            {/* Letter paper */}
            <div className="bg-[#fdf6e3] shadow-2xl px-7 py-6 relative overflow-hidden mx-0 rounded-lg"
                 style={{
                   backgroundImage: `
                     repeating-linear-gradient(transparent, transparent 31px, rgba(200,180,140,0.3) 32px),
                     linear-gradient(135deg, #fdf6e3 0%, #f8edd5 100%)
                   `,
                   boxShadow: "0 12px 40px rgba(100, 70, 10, 0.25)",
                 }}
            >
              {/* Stamp */}
              <div className="absolute top-3 right-3 w-11 h-13 border-2 border-dashed border-[#c4a060]/50 rounded-sm flex items-center justify-center text-xl">
                {STAMPS[letter.stampIdx % STAMPS.length]}
              </div>

              {/* Location */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e8d5b0]/60 rounded-full text-[10px] text-[#8b6914] mb-4">
                &#x1F4CD; {letter.locationName}
              </div>

              {/* To */}
              <p className="text-[11px] text-[#b0986a] tracking-widest uppercase mb-0.5">To.</p>
              <p className="text-2xl text-[#5a4a20] font-[family-name:var(--font-caveat)] mb-5 pb-2 border-b border-[#e8d5b0]">
                {letter.to}
              </p>

              {/* Body */}
              <p className="text-xl text-[#3a3010] font-[family-name:var(--font-nanum-pen)] leading-[32px] min-h-[120px] whitespace-pre-wrap">
                {letter.body}
              </p>

              {/* From + Date */}
              <div className="flex items-end justify-between mt-8 pt-4 border-t border-[#e8d5b0]">
                <div>
                  <p className="text-[11px] text-[#b0986a] tracking-widest uppercase mb-0.5">From.</p>
                  <p className="text-xl text-[#5a4a20] font-[family-name:var(--font-caveat)]">
                    {letter.from}
                  </p>
                </div>
                <span className="text-[11px] text-[#c4a060]">
                  {new Date(letter.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </span>
              </div>

              {/* Cheer section */}
              <div className="mt-6 pt-4 border-t border-[#e8d5b0]">
                {!cheerSent ? (
                  <div>
                    <p className="text-xs text-[#b0986a] mb-2 font-[family-name:var(--font-caveat)] text-base">{t(locale, "cheerPrompt")}</p>
                    <div className="flex gap-2">
                      {CHEERS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleCheer(emoji)}
                          className="w-10 h-10 rounded-xl bg-[#f0e4c8] hover:bg-[#e8d5b0] flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-90"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-2xl">{selectedCheer}</span>
                    <span className="text-sm text-[#8b6914] font-[family-name:var(--font-caveat)] text-lg">
                      {t(locale, "cheerSent")} ({hearts})
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Close hint */}
            <div className="text-center mt-3">
              <button onClick={handleClose} className="text-white/60 text-xs hover:text-white/80 transition-colors">
                {t(locale, "tapToClose")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
