// context/AppContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Location = {
  lat: number;
  lng: number;
};

type AppContextType = {
  userLocation: Location | null;
  effectiveLocation: Location;
  locationError: string | null;
  locationLoading: boolean;
  requestLocation: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  function requestLocation() {
    console.log("[AppContext] requestLocation called");

    if (!navigator.geolocation) {
      // console.warn("[AppContext] Geolocation not supported");
      setLocationError("Geolocation not supported by your browser");
      return;
    }

    // console.log("[AppContext] Requesting position from browser...");
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // console.log("[AppContext] Location success:", {
        //   lat: latitude,
        //   lng: longitude,
        //   accuracyMeters: Math.round(accuracy),
        // });
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationLoading(false);
        setLocationError(null);
      },
      (error) => {
        // console.error("[AppContext] Location error:", {
        //   code: error.code,
        //   message: error.message,
        // });
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied — using Denver as default",
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  const effectiveLocation = userLocation ?? {
    lat: 39.7392,
    lng: -104.9903,
  };

  console.log("[AppContext] state:", {
    userLocation,
    effectiveLocation,
    locationLoading,
    locationError,
  });

  return (
    <AppContext.Provider
      value={{
        userLocation,
        effectiveLocation,
        locationError,
        locationLoading,
        requestLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
