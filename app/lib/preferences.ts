/* Penyimpanan preferensi pengguna (tema, ukuran teks, aksesibilitas, notifikasi).
   Disimpan di localStorage dan dibaca lewat useSyncExternalStore di Providers.tsx,
   jadi aman untuk SSR dan tidak menyebabkan hydration mismatch. */

export const PREFS_KEY = "portal-akademik:prefs";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";
export type FontScale = "sm" | "md" | "lg" | "xl";
export type NotifyKey = "tugas" | "jadwal" | "kas" | "pengumuman" | "materi";

export type Preferences = {
  theme: ThemeMode;
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
  largeTargets: boolean;
  relaxedSpacing: boolean;
  notify: Record<NotifyKey, boolean>;
};

export const DEFAULT_PREFS: Preferences = {
  theme: "system",
  fontScale: "md",
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
  largeTargets: false,
  relaxedSpacing: false,
  notify: { tugas: true, jadwal: true, kas: true, pengumuman: true, materi: true },
};

const THEMES: ThemeMode[] = ["system", "light", "dark"];
const FONTS: FontScale[] = ["sm", "md", "lg", "xl"];

const bool = (value: unknown, fallback: boolean) => (typeof value === "boolean" ? value : fallback);

/** Data dari localStorage tidak dipercaya begitu saja */
const sanitize = (raw: unknown): Preferences => {
  if (!raw || typeof raw !== "object") return DEFAULT_PREFS;
  const r = raw as Partial<Preferences>;
  const d = DEFAULT_PREFS;
  return {
    theme: THEMES.includes(r.theme as ThemeMode) ? (r.theme as ThemeMode) : d.theme,
    fontScale: FONTS.includes(r.fontScale as FontScale) ? (r.fontScale as FontScale) : d.fontScale,
    highContrast: bool(r.highContrast, d.highContrast),
    reduceMotion: bool(r.reduceMotion, d.reduceMotion),
    underlineLinks: bool(r.underlineLinks, d.underlineLinks),
    largeTargets: bool(r.largeTargets, d.largeTargets),
    relaxedSpacing: bool(r.relaxedSpacing, d.relaxedSpacing),
    notify: {
      tugas: bool(r.notify?.tugas, d.notify.tugas),
      jadwal: bool(r.notify?.jadwal, d.notify.jadwal),
      kas: bool(r.notify?.kas, d.notify.kas),
      pengumuman: bool(r.notify?.pengumuman, d.notify.pengumuman),
      materi: bool(r.notify?.materi, d.notify.materi),
    },
  };
};

export const resolveTheme = (mode: ThemeMode, systemDark: boolean): ResolvedTheme =>
  mode === "system" ? (systemDark ? "dark" : "light") : mode;

/* ---------- Store ---------- */
let current: Preferences = DEFAULT_PREFS;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const readStorage = (): Preferences => {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? sanitize(JSON.parse(raw)) : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
};

const writeStorage = (prefs: Preferences) => {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* penyimpanan penuh atau diblokir: preferensi tetap berlaku selama sesi */
  }
};

export const getPrefsSnapshot = (): Preferences => {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    current = readStorage();
  }
  return current;
};

export const getPrefsServerSnapshot = (): Preferences => DEFAULT_PREFS;

export const subscribePrefs = (callback: () => void) => {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PREFS_KEY) {
      current = readStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const updatePrefs = (patch: Partial<Preferences>) => {
  current = { ...getPrefsSnapshot(), ...patch };
  writeStorage(current);
  emit();
};

export const resetPrefs = () => {
  current = DEFAULT_PREFS;
  writeStorage(current);
  emit();
};

/* ---------- Terapkan ke <html> ---------- */
export const applyPrefs = (el: HTMLElement, prefs: Preferences, theme: ResolvedTheme) => {
  el.dataset.theme = theme;
  el.dataset.font = prefs.fontScale;
  el.dataset.contrast = prefs.highContrast ? "high" : "normal";
  el.dataset.motion = prefs.reduceMotion ? "reduce" : "normal";
  el.dataset.links = prefs.underlineLinks ? "underline" : "normal";
  el.dataset.targets = prefs.largeTargets ? "large" : "normal";
  el.dataset.spacing = prefs.relaxedSpacing ? "relaxed" : "normal";
};

/** Skrip inline di <head>: menerapkan preferensi sebelum React hydrate agar tidak berkedip */
export const initScript = `(function(){try{
var d=document.documentElement,p={};
try{p=JSON.parse(localStorage.getItem("${PREFS_KEY}")||"{}")||{}}catch(e){}
var t=p.theme||"system";
if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
d.dataset.theme=t;
d.dataset.font=p.fontScale||"md";
d.dataset.contrast=p.highContrast?"high":"normal";
d.dataset.motion=p.reduceMotion?"reduce":"normal";
d.dataset.links=p.underlineLinks?"underline":"normal";
d.dataset.targets=p.largeTargets?"large":"normal";
d.dataset.spacing=p.relaxedSpacing?"relaxed":"normal";
}catch(e){}})();`;