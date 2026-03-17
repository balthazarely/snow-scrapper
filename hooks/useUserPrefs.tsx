"use client";

import { useState, useEffect } from "react";

type UserPrefs = {
  favoriteResorts: string[];
  darkMode: boolean;
};

const DEFAULTS: UserPrefs = {
  favoriteResorts: [],
  darkMode: false,
};

function loadPrefs(): UserPrefs {
  try {
    const saved = localStorage.getItem("snowhound-prefs");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useUserPrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULTS);

  // Load from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem("snowhound-prefs", JSON.stringify(prefs));
  }, [prefs]);

  const toggleFavorite = (resortName: string) => {
    setPrefs((prev) => {
      const isFav = prev.favoriteResorts.includes(resortName);
      return {
        ...prev,
        favoriteResorts: isFav
          ? prev.favoriteResorts.filter((r) => r !== resortName)
          : [...prev.favoriteResorts, resortName],
      };
    });
  };

  const isFavorite = (resortName: string) =>
    prefs.favoriteResorts.includes(resortName);

  const setDarkMode = (value: boolean) => {
    setPrefs((prev) => ({ ...prev, darkMode: value }));
  };

  const toggleDarkMode = () => {
    setPrefs((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return {
    prefs,
    toggleFavorite,
    isFavorite,
    setDarkMode,
    toggleDarkMode,
  };
}
