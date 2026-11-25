"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, MoonIcon, UserOutlineIcon } from "../components/icons";
import { BrandMark } from "../components/ui";
import { pad2 } from "../lib/utils";

const formatClock = (date: Date) =>
  `${pad2(date.getHours())}.${pad2(date.getMinutes())}.${pad2(date.getSeconds())}`;

/** Halaman 2: Login */
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [clock, setClock] = useState("--.--.--");

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="login">
      <div className="login-top">
        <span suppressHydrationWarning>{clock}</span>
        <button aria-label="Mode gelap">
          <MoonIcon size={32} />
        </button>
      </div>

      <svg className="waves" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden>
        <path className="wave-1" d="M0 120C60 60 110 80 160 150c60 90 150 110 260 120 100 10 130 60 160 150 20 50 40 60 420 80V500H0Z" />
        <path className="wave-2" d="M0 250c80-60 150-40 190 40 40 90 40 150 130 200 90 50 180 10 280 10H0Z" />
        <path className="wave-3" d="M0 330c60-30 110 0 140 60 30 70 60 110 140 140H0Z" />
        <path className="wave-4" d="M420 500c140-60 280-70 400-60 100 8 130 20 180 10v50Z" />
      </svg>

      <div className="login-main">
        <BrandMark />
        <div className="divider" />

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
        >
          <label className="field">
            <UserOutlineIcon size={32} />
            <input type="text" placeholder="Username" autoComplete="username" />
          </label>
          <label className="field">
            <LockIcon size={32} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
            />
            <button type="button" aria-label="Tampilkan password" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOffIcon size={28} /> : <EyeIcon size={28} />}
            </button>
          </label>
          <button type="submit" className="btn btn-solid btn-lg">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}