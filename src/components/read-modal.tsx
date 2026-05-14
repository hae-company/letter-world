"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Letter } from "@/lib/redis";

interface Props {
  letter: Letter | null;
  onClose: () => void;
}

const STAMPS = ["🌍", "✈️", "🕊️", "🌸", "⭐", "🎭", "🏔️", "🌊", "🎪", "🎨"];

export function ReadModal({ letter, onClose }: Props) {
  const [hearts, setHearts] = useState(letter?.hearts || 0);
  const [hearted, setHearted] = useState(false);

  const handleHeart = async () => {
    if (hearted || !letter) return;
    setHearted(true);
    setHearts(h => h + 1);
    try {
      await fetch("/api/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId: letter.id }),
      });
    } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateX: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            {/* Letter paper */}
            <div className="bg-[#fdf6e3] rounded-sm shadow-2xl p-8 relative overflow-hidden"
                 style={{
                   backgroundImage: `
                     repeating-linear-gradient(transparent, transparent 27px, #e8d5b0 28px),
                     linear-gradient(135deg, #fdf6e3 0%, #f5ead0 50%, #fdf6e3 100%)
                   `,
                   boxShadow: "0 8px 32px rgba(139, 105, 20, 0.3), inset 0 0 80px rgba(139, 105, 20, 0.05)",
                 }}
            >
              {/* Stamp */}
              <div className="absolute top-4 right-4 w-12 h-14 border-2 border-dashed border-[#c4a060] rounded-sm flex items-center justify-center text-2xl opacity-60">
                {STAMPS[letter.stampIdx % STAMPS.length]}
              </div>

              {/* Location badge */}
              <div className="inline-block px-2 py-0.5 bg-[#e8d5b0] rounded text-[10px] text-[#8b6914] mb-3">
                📍 {letter.locationName}
              </div>

              {/* To */}
              <p className="text-xs text-[#8b6914] tracking-wider">To.</p>
              <p className="text-xl text-[#5a4a20] font-[family-name:var(--font-caveat)] mb-4 border-b border-[#e8d5b0] pb-1">
                {letter.to}
              </p>

              {/* Body */}
              <p className="text-xl text-[#3a3010] font-[family-name:var(--font-nanum-pen)] leading-[28px] min-h-32 whitespace-pre-wrap">
                {letter.body}
              </p>

              {/* From + Date */}
              <div className="flex items-end justify-between mt-6 pt-4 border-t border-[#e8d5b0]">
                <div>
                  <p className="text-xs text-[#8b6914] tracking-wider">From.</p>
                  <p className="text-lg text-[#5a4a20] font-[family-name:var(--font-caveat)]">
                    {letter.from}
                  </p>
                </div>
                <span className="text-xs text-[#b0986a]">
                  {new Date(letter.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handleHeart}
                  disabled={hearted}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
                    hearted
                      ? "bg-pink-100 text-pink-500"
                      : "bg-[#f0e4c8] text-[#8b6914] hover:bg-[#e8d5b0]"
                  }`}
                >
                  {hearted ? "❤️" : "🤍"} 마음 보내기
                  {hearts > 0 && <span className="text-xs opacity-60">{hearts}</span>}
                </button>

                <button
                  onClick={onClose}
                  className="text-sm text-[#b0986a] hover:text-[#8b6914] transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
