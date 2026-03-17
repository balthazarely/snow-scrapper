"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

type UserPrefs = {
  favoriteResorts: string[];
  darkMode: boolean;
};

const DEFAULTS: UserPrefs = {
  favoriteResorts: [],
  darkMode: false,
};

type UserPrefsContextValue = {
  prefs: UserPrefs;
  toggleFavorite: (resortName: string) => void;
  isFavorite: (resortName: string) => boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const UserPrefsContext = createContext<UserPrefsContextValue | null>(null);

export function UserPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("snowhound-prefs");
      if (saved) setPrefs({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("snowhound-prefs", JSON.stringify(prefs));
  }, [prefs]);

  const toggleFavorite = (resortName: string) => {
    const isFav = prefs.favoriteResorts.includes(resortName);
    if (isFav) {
      toast(`Removed ${resortName} from favorites`);
    } else {
      toast.success(`Added ${resortName} to favorites`);
    }
    setPrefs((prev) => ({
      ...prev,
      favoriteResorts: isFav
        ? prev.favoriteResorts.filter((r) => r !== resortName)
        : [...prev.favoriteResorts, resortName],
    }));
  };

  const isFavorite = (resortName: string) =>
    prefs.favoriteResorts.includes(resortName);

  const setDarkMode = (value: boolean) =>
    setPrefs((prev) => ({ ...prev, darkMode: value }));

  const toggleDarkMode = () =>
    setPrefs((prev) => ({ ...prev, darkMode: !prev.darkMode }));

  return (
    <UserPrefsContext.Provider
      value={{ prefs, toggleFavorite, isFavorite, setDarkMode, toggleDarkMode }}
    >
      {children}
    </UserPrefsContext.Provider>
  );
}

export function useUserPrefs() {
  const ctx = useContext(UserPrefsContext);
  if (!ctx)
    throw new Error("useUserPrefs must be used within UserPrefsProvider");
  return ctx;
}
