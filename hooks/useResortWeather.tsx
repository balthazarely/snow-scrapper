// hooks/useResortWeather.ts
import { useQuery } from "@tanstack/react-query";
import { ResortWeather } from "@/types/ResortWeather";

export async function fetchResortWeather(
  lat: number,
  lng: number,
): Promise<ResortWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lng.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,snowfall,precipitation",
  );
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,snowfall_sum,weather_code",
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", "America/Denver");
  url.searchParams.set("forecast_days", "7");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

  const data = await res.json();
  const c = data.current;
  const d = data.daily;

  return {
    current: {
      temp: Math.round(c.temperature_2m),
      weatherCode: c.weather_code,
      windSpeed: Math.round(c.wind_speed_10m),
      windDirection: c.wind_direction_10m,
      snowfall: c.snowfall ?? 0,
      precipitation: c.precipitation ?? 0,
    },
    daily: d.time.map((date: string, i: number) => ({
      date,
      tempMax: Math.round(d.temperature_2m_max[i]),
      tempMin: Math.round(d.temperature_2m_min[i]),
      snowfallSum: d.snowfall_sum[i] ?? 0,
      weatherCode: d.weather_code[i],
    })),
  };
}

export function useResortWeather(lat: number, lng: number) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchResortWeather(lat, lng),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    enabled: !!lat && !!lng,
    refetchOnWindowFocus: true,
  });
}
