import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { colors, themeVars } from "./lib/theme";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "Portal Akademik",
  description: "Dummy portal akademik mahasiswa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: colors.surface,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plex.variable} style={themeVars}>
      <body>{children}</body>
    </html>
  );
}