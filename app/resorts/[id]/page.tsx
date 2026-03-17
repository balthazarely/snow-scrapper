"use client";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MdArrowBack } from "react-icons/md";
import { Resort } from "@/types/Resort";
import { DailyForecast } from "@/types/ResortWeather";
import { useResortWeather } from "@/hooks/useResortWeather";

function dayLetter(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "narrow" });
}

function weatherLabel(code: number): string {
  if (code === 0) return "Clear skies";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snowfall";
  if (code <= 84) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Mixed";
}

function windDir(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function SnowBars({ daily }: { daily: DailyForecast[] }) {
  const maxSnow = Math.max(...daily.map((d) => d.snowfallSum), 1);
  return (
    <div className="flex items-end gap-1.5">
      {daily.map((day) => {
        const heightPct = (day.snowfallSum / maxSnow) * 100;
        const hasSnow = day.snowfallSum > 0;
        return (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <div className="w-5 h-10 flex items-end">
              <div
                className={`w-full rounded-sm ${hasSnow ? "bg-orange-400" : "bg-zinc-100"}`}
                style={{ height: hasSnow ? `${Math.max(heightPct, 15)}%` : "4px" }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">{dayLetter(day.date)}</span>
          </div>
        );
      })}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
      <div className="p-4">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">{children}</p>
  );
}

export default function ResortPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const resorts = queryClient.getQueryData<Resort[]>(["resorts"]);
  const resort = resorts?.find((r) => r.id === id);

  const { data: weather, isLoading } = useResortWeather(resort?.lat ?? 0, resort?.lng ?? 0);

  if (!resort) return <div className="p-4 text-zinc-400">Resort not found</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-4 px-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-3"
        >
          <MdArrowBack className="text-lg" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-zinc-900">{resort.name}</h1>
          {resort.pass && (
            <span className="rounded-full bg-sky-50 border border-sky-100 px-2 py-0.5 text-xs font-medium text-sky-600">
              {resort.pass}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 mt-0.5">
          {resort.base.toLocaleString()}–{resort.summit.toLocaleString()} ft · Colorado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Left column */}
        <div className="flex flex-col gap-3">

          {/* Mountain status card */}
          <Card>
            <SectionLabel>Mountain Status</SectionLabel>
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              <div className="text-center pr-3">
                <p className="text-2xl font-bold text-orange-400 leading-none">{resort.snowfall3d}"</p>
                <p className="text-xs text-zinc-400 mt-1">3-day snow</p>
              </div>
              <div className="text-center px-3">
                <p className="text-2xl font-bold text-orange-400 leading-none">{resort.baseDepth}"</p>
                <p className="text-xs text-zinc-400 mt-1">base depth</p>
              </div>
              <div className="text-center pl-3">
                <p className="text-2xl font-bold leading-none">
                  <span className="text-zinc-900">{resort.openLifts}</span>
                  <span className="text-zinc-300 font-normal text-lg">/{resort.totalLifts}</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">lifts open</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span className="capitalize text-sm text-zinc-500">{resort.conditions}</span>
              <span className="text-sm text-zinc-400">{resort.openTrails}/{resort.totalTrails} trails</span>
            </div>
          </Card>

          {/* Current weather card */}
          {isLoading ? (
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse">
              <div className="h-1 w-full bg-zinc-100" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-24 bg-zinc-100 rounded-full" />
                <div className="h-10 w-1/2 bg-zinc-100 rounded-xl" />
              </div>
            </div>
          ) : weather && (
            <Card>
              <SectionLabel>Right Now</SectionLabel>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-zinc-900">
                    {weather.current.temp}°<span className="text-2xl font-normal text-zinc-400">F</span>
                  </p>
                  <p className="text-sm text-zinc-400 mt-0.5">{weatherLabel(weather.current.weatherCode)}</p>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-700">{weather.current.windSpeed} mph {windDir(weather.current.windDirection)}</p>
                    <p className="text-xs text-zinc-400">wind</p>
                  </div>
                  {weather.current.snowfall > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-sky-500">{(weather.current.snowfall / 2.54).toFixed(1)}" falling</p>
                      <p className="text-xs text-zinc-400">now</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right column — 7-day forecast */}
        {weather && (
          <Card>
            <SectionLabel>7-Day Forecast</SectionLabel>
            <div className="flex items-end justify-between mb-4">
              <p className="text-xs text-zinc-400">Snowfall forecast</p>
              <SnowBars daily={weather.daily} />
            </div>
            <div className="space-y-3">
              {weather.daily.map((day, i) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="w-10">
                    <p className={`text-sm font-semibold ${i === 0 ? "text-sky-500" : "text-zinc-500"}`}>
                      {i === 0 ? "Today" : dayLetter(day.date)}
                    </p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-300 to-orange-300"
                        style={{
                          marginLeft: `${((day.tempMin) / 80) * 100}%`,
                          width: `${((day.tempMax - day.tempMin) / 80) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {day.snowfallSum > 0 && (
                      <span className="text-xs font-semibold text-orange-400 w-8 text-right">
                        {(day.snowfallSum / 2.54).toFixed(1)}"
                      </span>
                    )}
                    {day.snowfallSum === 0 && <span className="w-8" />}
                    <div className="w-14 flex justify-between">
                      <span className="text-sm text-zinc-400">{day.tempMin}°</span>
                      <span className="text-sm font-semibold text-zinc-700">{day.tempMax}°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
