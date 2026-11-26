import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Providers from "./components/Providers";
import { initScript } from "./lib/preferences";
import { colors, darkColors, themeCss } from "./lib/theme";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: colors.surface },
    { media: "(prefers-color-scheme: dark)", color: darkColors.surface ?? colors.surface },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: atribut data-* pada <html> diisi skrip inline sebelum hydrate
    <html lang="id" className={plex.variable} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}