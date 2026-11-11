"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Blob, CapIcon, EyeIcon, EyeOffIcon, LockIcon, MoonIcon, UserOutlineIcon } from "../components/icons";

/** Halaman 2 — Login */
export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [time, setTime] = useState("15.25.45");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setTime(`${p(d.getHours())}.${p(d.getMinutes())}.${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="login">
      <div className="login-top">
        <span suppressHydrationWarning>{time}</span>
        <button aria-label="Mode gelap">
          <MoonIcon size={34} />
        </button>
      </div>

      <svg className="waves" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden>
        <path d="M0 120C60 60 110 80 160 150c60 90 150 110 260 120 100 10 130 60 160 150 20 50 40 60 420 80V500H0Z" fill="#f4f9ff" />
        <path d="M0 250c80-60 150-40 190 40 40 90 40 150 130 200 90 50 180 10 280 10H0Z" fill="#e8f2fe" />
        <path d="M0 330c60-30 110 0 140 60 30 70 60 110 140 140H0Z" fill="#dfeafc" />
        <path d="M420 500c140-60 280-70 400-60 100 8 130 20 180 10v50Z" fill="#eef6ff" />
      </svg>

      <div className="login-main">
        <div className="blob">
          <Blob className="bg" />
          <CapIcon className="cap" size={120} style={{ width: "42%", height: "auto" }} />
        </div>
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
            <input type={show ? "text" : "password"} placeholder="Password" autoComplete="current-password" />
            <button type="button" aria-label="Tampilkan password" onClick={() => setShow((s) => !s)}>
              {show ? <EyeOffIcon size={30} /> : <EyeIcon size={30} />}
            </button>
          </label>
          <button type="submit" className="btn-black">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}