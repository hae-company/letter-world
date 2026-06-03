"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, type Locale } from "@/lib/i18n";

const STAMPS = ["🌍", "✈️", "🕊️", "🌸", "⭐", "🎭", "🏔️", "🌊", "🎪", "🎨"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: (data: { to: string; body: string; from: string }) => void;
  sending: boolean;
  locale: Locale;
}

export function WriteModal({ open, onClose, onSend, sending, locale }: Props) {
  const [to, setTo] = useState("");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState("");
  const stamp = useMemo(() => STAMPS[Math.floor(Math.random() * STAMPS.length)], []);

  const handleSend = () => {
    if (!body.trim()) return;
    onSend({
      to: to.trim() || t(locale, "toPlaceholder"),
      body: body.trim(),
      from: from.trim() || t(locale, "fromPlaceholder"),
    });
    setTo("");
    setBody("");
    setFrom("");
  };

  const dateStr = new Date().toLocaleDateString(
    locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR",
    { year: "numeric", month: "long", day: "numeric" }
  );

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
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <div
              className="bg-[#fdf6e3] rounded-xl shadow-2xl p-7 relative"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 30px, rgba(190,170,130,0.2) 31px)",
                boxShadow: "0 16px 48px rgba(80,60,10,0.2), 0 0 0 1px rgba(180,160,120,0.2)",
              }}
            >
              {/* Stamp */}
              <div className="absolute top-4 right-4 w-11 h-13 border-2 border-dashed border-[#c4a060]/40 rounded flex items-center justify-center text-xl opacity-70 rotate-3">
                {stamp}
              </div>

              {/* To */}
              <label className="text-[10px] text-[#b09868] uppercase tracking-[0.15em]">{t(locale, "to")}</label>
              <input
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder={t(locale, "toPlaceholder")}
                className="w-full bg-transparent border-b border-[#ddd0b8] text-[#4a3a15] font-[family-name:var(--font-caveat)] text-xl py-1 mb-5 focus:outline-none focus:border-[#8b6914] placeholder:text-[#c8b48a]"
              />

              {/* Body */}
              <textarea
                value={body}
                onChange={e => setBody(e.target.value.slice(0, 500))}
                placeholder={t(locale, "bodyPlaceholder")}
                className="w-full h-44 bg-transparent text-[#3a2e10] font-[family-name:var(--font-nanum-pen)] text-[22px] leading-[31px] resize-none focus:outline-none placeholder:text-[#c8b48a]/70"
              />

              {/* From + date */}
              <div className="flex items-end justify-between mt-3">
                <div className="flex-1 mr-4">
                  <label className="text-[10px] text-[#b09868] uppercase tracking-[0.15em]">{t(locale, "from")}</label>
                  <input
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    placeholder={t(locale, "fromPlaceholder")}
                    className="w-full bg-transparent border-b border-[#ddd0b8] text-[#4a3a15] font-[family-name:var(--font-caveat)] text-lg py-0.5 focus:outline-none placeholder:text-[#c8b48a]"
                  />
                </div>
                <span className="text-[11px] text-[#c4a868] whitespace-nowrap">{dateStr}</span>
              </div>

              {/* Count */}
              <div className="text-right mt-1.5">
                <span className={`text-[11px] ${body.length > 450 ? "text-red-400" : "text-[#c4a868]"}`}>
                  {body.length}/500
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm text-[#8b6914] border border-[#d8c8a0] hover:bg-[#f0e4c8] transition-colors"
                >
                  {t(locale, "cancel")}
                </button>
                <button
                  onClick={handleSend}
                  disabled={!body.trim() || sending}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-[#8b6914] text-white hover:bg-[#9a7818] disabled:opacity-30 transition-colors font-medium"
                >
                  {sending ? t(locale, "sending") : t(locale, "send")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
