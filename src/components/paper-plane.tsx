"use client";

import { motion, AnimatePresence } from "framer-motion";
import { t, type Locale } from "@/lib/i18n";

interface Props {
  visible: boolean;
  locationName: string;
  onComplete: () => void;
  locale: Locale;
}

export function PaperPlane({ visible, locationName, onComplete, locale }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none">
          <motion.div
            initial={{ x: 0, y: 100, rotate: 0, scale: 1 }}
            animate={{ x: [0, 100, 200, 100, 0], y: [100, -50, -150, -200, -300], rotate: [0, -15, -30, -20, -45], scale: [1, 1.2, 1, 0.8, 0.4] }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            onAnimationComplete={onComplete}
            className="text-6xl">
            &#x2708;
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 text-center">
            <p className="text-white text-lg font-[family-name:var(--font-caveat)] drop-shadow-lg">{t(locale, "yourLetter")}</p>
            <p className="text-white text-2xl font-[family-name:var(--font-caveat)] font-bold drop-shadow-lg mt-1">{locationName}</p>
            <p className="text-white text-lg font-[family-name:var(--font-caveat)] drop-shadow-lg">{t(locale, "arrived")} &#x2709;</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
