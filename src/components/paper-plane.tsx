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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/25 backdrop-blur-[2px] pointer-events-none"
        >
          <motion.div
            initial={{ x: -80, y: 120, rotate: 10, scale: 1, opacity: 1 }}
            animate={{
              x: [-80, 60, 180, 120, 40],
              y: [120, 20, -80, -180, -280],
              rotate: [10, -10, -25, -15, -40],
              scale: [1, 1.15, 1, 0.85, 0.3],
              opacity: [1, 1, 1, 0.8, 0],
            }}
            transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
            onAnimationComplete={onComplete}
            className="text-5xl"
          >
            ✈️
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7 }}
            className="mt-4 text-center px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg"
          >
            <p className="text-[#5a4a20] font-[family-name:var(--font-caveat)] text-lg">
              {t(locale, "yourLetter")}
            </p>
            <p className="text-[#3a2e10] font-[family-name:var(--font-caveat)] text-2xl font-bold mt-0.5">
              📍 {locationName}
            </p>
            <p className="text-[#5a4a20] font-[family-name:var(--font-caveat)] text-lg">
              {t(locale, "arrived")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
