import type { Metadata } from "next";
import { Caveat, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const nanumPen = Nanum_Pen_Script({ variable: "--font-nanum-pen", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Letter to the World",
  description: "Write a letter. Let it fly. Someone will find it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${caveat.variable} ${nanumPen.variable} h-full`}>
      <body className="h-full bg-[#f5ead6] overflow-hidden">{children}</body>
    </html>
  );
}
