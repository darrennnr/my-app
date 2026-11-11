"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Blob, CapIcon } from "./components/icons";

/** Halaman 1 — Splash screen, otomatis menuju /login */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/login"), 2200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="center-screen">
      <div className="blob">
        <Blob className="bg" />
        <CapIcon className="cap" size={120} style={{ width: "42%", height: "auto" }} />
      </div>
    </div>
  );
}