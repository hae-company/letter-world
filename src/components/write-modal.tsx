"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, type Locale } from "@/lib/i18n";

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

  const handleSend = () => {
    if (!body.trim()) return;
    onSend({ to: to || t(locale, "toPlaceholder"), body, from: from || t(locale, "fromPlaceholder") });
    setTo(""); setBody(""); setFrom("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md">
            <div className="bg-[#fdf6e3] rounded-lg shadow-2xl p-7 relative overflow-hidden"
                 style={{
                   backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, rgba(200,180,140,0.3) 32px), linear-gradient(135deg, #fdf6e3 0%, #f8edd5 100%)",
                   boxShadow: "0 12px 40px rgba(100, 70, 10, 0.25)",
                 }}>
              <div className="absolute top-3 right-3 w-11 h-14 border-2 border-dashed border-[#c4a060]/50 rounded-sm flex items-center justify-center text-xl">
                {["🌍","✈️","🕊️","🌸","⭐","🎭","🏔️","🌊","🎪","🎨"][Math.floor(Math.random()*10)]}
              </div>
              <div className="mb-4">
                <label className="text-[11px] text-[#b0986a] tracking-widest uppercase">{t(locale, "to")}</label>
                <input value={to} onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-transparent border-b border-[#d4c4a0] text-[#5a4a20] font-[family-name:var(--font-caveat)] text-xl py-1 focus:outline-none focus:border-[#8b6914]"
                  placeholder={t(locale, "toPlaceholder")} />
              </div>
              <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, 500))}
                className="w-full h-48 bg-transparent text-[#3a3010] font-[family-name:var(--font-nanum-pen)] text-xl leading-[32px] resize-none focus:outline-none placeholder:text-[#c4a060]"
                placeholder={t(locale, "bodyPlaceholder")} />
              <div className="flex items-end justify-between mt-4">
                <div className="flex-1 mr-4">
                  <label className="text-[11px] text-[#b0986a] tracking-widest uppercase">{t(locale, "from")}</label>
                  <input value={from} onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-transparent border-b border-[#d4c4a0] text-[#5a4a20] font-[family-name:var(--font-caveat)] text-lg py-1 focus:outline-none"
                    placeholder={t(locale, "fromPlaceholder")} />
                </div>
                <span className="text-[11px] text-[#c4a060] whitespace-nowrap">
                  {new Date().toLocaleDateString(locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="text-right mt-2">
                <span className={`text-xs ${body.length > 450 ? "text-red-400" : "text-[#c4a060]"}`}>{body.length}/500</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#8b6914] border border-[#d4c4a0] hover:bg-[#f0e4c8] transition-colors">
                  {t(locale, "cancel")}
                </button>
                <button onClick={handleSend} disabled={!body.trim() || sending}
                  className="flex-1 py-2.5 rounded-xl text-sm bg-[#8b6914] text-white hover:bg-[#a07818] disabled:opacity-40 transition-colors font-medium">
                  {sending ? t(locale, "sending") : `${t(locale, "send")} ✉️`}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
