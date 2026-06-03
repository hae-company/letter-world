"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2000);
    const t2 = setTimeout(() => setVisible(false), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      animate={{ opacity: fade ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f5ead6]"
      style={{ pointerEvents: fade ? "none" : "auto" }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-5xl mb-6"
        >
          ✉️
        </motion.div>
        <h1 className="text-3xl font-[family-name:var(--font-caveat)] text-[#5a4a20] mb-2">
          Letter to the World
        </h1>
        <p className="text-sm text-[#b09868] font-[family-name:var(--font-caveat)] text-lg">
          세계 어딘가에 편지를 남겨보세요
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12"
      >
        <Image src="/logo-light.svg" alt="hae02y" width={40} height={28} className="opacity-30" />
      </motion.div>
    </motion.div>
  );
}
