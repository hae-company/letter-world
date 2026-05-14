"use client";

import Image from "next/image";

export function Footer() {
  return (
    <a
      href="https://blog.hae02y.me"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 opacity-30 hover:opacity-60 transition-opacity"
    >
      <Image src="/logo-light.svg" alt="hae02y" width={20} height={14} />
      <span className="text-[9px] text-[#8b6914] tracking-widest">hae02y</span>
    </a>
  );
}
