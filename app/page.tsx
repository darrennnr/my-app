"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrandMark } from "./components/ui";

const SPLASH_DURATION_MS = 2200;

/** Halaman 1: Splash screen, otomatis menuju /login */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/login"), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="center-screen">
      <BrandMark />
    </div>
  );
}