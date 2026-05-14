"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: (data: { to: string; body: string; from: string }) => void;
  sending: boolean;
}

export function WriteModal({ open, onClose, onSend, sending }: Props) {
  const [to, setTo] = useState("세상 누군가에게");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState("");

  const handleSend = () => {
    if (!body.trim()) return;
    onSend({ to, body, from: from || "익명의 누군가" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md relative"
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
                {["🌍", "✈️", "🕊️", "🌸", "⭐", "🎭", "🏔️", "🌊", "🎪", "🎨"][Math.floor(Math.random() * 10)]}
              </div>

              {/* To */}
              <div className="mb-4">
                <label className="text-xs text-[#8b6914] tracking-wider">To.</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-transparent border-b border-[#d4c4a0] text-[#5a4a20] font-[family-name:var(--font-caveat)] text-xl py-1 focus:outline-none focus:border-[#8b6914]"
                  placeholder="받는 사람"
                />
              </div>

              {/* Body */}
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, 500))}
                className="w-full h-48 bg-transparent text-[#3a3010] font-[family-name:var(--font-nanum-pen)] text-xl leading-[28px] resize-none focus:outline-none placeholder:text-[#c4a060]"
                placeholder="편지를 써보세요..."
              />

              <div className="flex items-end justify-between mt-4">
                {/* From */}
                <div className="flex-1 mr-4">
                  <label className="text-xs text-[#8b6914] tracking-wider">From.</label>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-transparent border-b border-[#d4c4a0] text-[#5a4a20] font-[family-name:var(--font-caveat)] text-lg py-1 focus:outline-none focus:border-[#8b6914]"
                    placeholder="익명의 누군가"
                  />
                </div>

                {/* Date */}
                <span className="text-xs text-[#b0986a] whitespace-nowrap">
                  {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>

              {/* Character count */}
              <div className="text-right mt-2">
                <span className={`text-xs ${body.length > 450 ? "text-red-400" : "text-[#b0986a]"}`}>
                  {body.length}/500
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg text-sm text-[#8b6914] border border-[#d4c4a0] hover:bg-[#f0e4c8] transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSend}
                  disabled={!body.trim() || sending}
                  className="flex-1 py-2.5 rounded-lg text-sm bg-[#8b6914] text-white hover:bg-[#a07818] disabled:opacity-40 transition-colors font-medium"
                >
                  {sending ? "보내는 중..." : "편지 보내기 ✉️"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
