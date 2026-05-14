import type { Metadata } from "next";
import { Caveat, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const nanumPen = Nanum_Pen_Script({ variable: "--font-nanum-pen", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Letter to the World",
  description: "세계 어딘가에 편지를 남기고, 누군가 발견하는 감성 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${caveat.variable} ${nanumPen.variable} h-full`}>
      <body className="h-full bg-[#f5ead6] overflow-hidden">{children}</body>
    </html>
  );
}
