"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { NOTIFICATIONS, isNotifEnabled, type AppNotification } from "../lib/notifications";
import {
  applyPrefs,
  getPrefsServerSnapshot,
  getPrefsSnapshot,
  resetPrefs,
  resolveTheme,
  subscribePrefs,
  updatePrefs,
  type NotifyKey,
  type Preferences,
  type ResolvedTheme,
} from "../lib/preferences";

/* ---------- Preferensi ---------- */
type PreferencesContextValue = {
  prefs: Preferences;
  resolvedTheme: ResolvedTheme;
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  setNotify: (key: NotifyKey, value: boolean) => void;
  toggleTheme: () => void;
  reset: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const subscribeSystemTheme = (callback: () => void) => {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getSystemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const getSystemDarkServer = () => false;

function PreferencesProvider({ children }: { children: ReactNode }) {
  const prefs = useSyncExternalStore(subscribePrefs, getPrefsSnapshot, getPrefsServerSnapshot);
  const systemDark = useSyncExternalStore(subscribeSystemTheme, getSystemDark, getSystemDarkServer);
  const resolvedTheme = resolveTheme(prefs.theme, systemDark);

  useEffect(() => {
    applyPrefs(document.documentElement, prefs, resolvedTheme);
  }, [prefs, resolvedTheme]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      prefs,
      resolvedTheme,
      setPref: (key, val) => updatePrefs({ [key]: val } as Partial<Preferences>),
      setNotify: (key, val) => updatePrefs({ notify: { ...getPrefsSnapshot().notify, [key]: val } }),
      toggleTheme: () => updatePrefs({ theme: resolvedTheme === "dark" ? "light" : "dark" }),
      reset: resetPrefs,
    }),
    [prefs, resolvedTheme]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences harus dipakai di dalam <Providers>");
  return ctx;
}

/* ---------- Notifikasi (data dummy, disimpan di memori selama sesi) ---------- */
type NotificationsContextValue = {
  /** Hanya notifikasi dari kategori yang diaktifkan */
  items: AppNotification[];
  hiddenCount: number;
  unreadCount: number;
  markRead: (id: number) => void;
  toggleRead: (id: number) => void;
  markAllRead: () => void;
  remove: (id: number) => void;
  restore: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function NotificationsProvider({ children }: { children: ReactNode }) {
  const { prefs } = usePreferences();
  const [all, setAll] = useState<AppNotification[]>(NOTIFICATIONS);

  const patch = useCallback(
    (match: (n: AppNotification) => boolean, changes: (n: AppNotification) => Partial<AppNotification>) =>
      setAll((prev) => prev.map((n) => (match(n) ? { ...n, ...changes(n) } : n))),
    []
  );

  const value = useMemo<NotificationsContextValue>(() => {
    const items = all.filter((n) => isNotifEnabled(n.type, prefs.notify));
    return {
      items,
      hiddenCount: all.length - items.length,
      unreadCount: items.filter((n) => !n.read).length,
      markRead: (id) => patch((n) => n.id === id, () => ({ read: true })),
      toggleRead: (id) => patch((n) => n.id === id, (n) => ({ read: !n.read })),
      markAllRead: () => patch((n) => isNotifEnabled(n.type, prefs.notify), () => ({ read: true })),
      remove: (id) => setAll((prev) => prev.filter((n) => n.id !== id)),
      restore: () => setAll(NOTIFICATIONS),
    };
  }, [all, prefs.notify, patch]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications harus dipakai di dalam <Providers>");
  return ctx;
}

/** Dipasang sekali di app/layout.tsx */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <NotificationsProvider>{children}</NotificationsProvider>
    </PreferencesProvider>
  );
}