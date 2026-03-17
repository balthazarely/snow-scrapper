export type CurrentWeather = {
  temp: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  snowfall: number;
  precipitation: number;
};

export type DailyForecast = {
  date: string;
  tempMax: number;
  tempMin: number;
  snowfallSum: number;
  weatherCode: number;
};

export type ResortWeather = {
  current: CurrentWeather;
  daily: DailyForecast[];
};
