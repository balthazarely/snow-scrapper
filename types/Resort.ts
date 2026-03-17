// Raw shape returned by the /api/snow scraper
export type ResortSnowReport = {
  name: string;
  snowfall3d: string;
  forecast3d: string;
  baseDepth: string;
  conditions: string;
  openTrails: string;
  totalTrails: string;
  openLifts: string;
  totalLifts: string;
  lastUpdated: string;
};

// Full /api/snow response envelope
export type SnowReportResponse = {
  lastScraped: string;
  count: number;
  resorts: ResortSnowReport[];
};

// Static resort details from colorado-resorts-enriched.json
export type ResortDetails = {
  name: string;
  id: string;
  lat: number;
  lng: number;
  pass: "Epic" | "Ikon" | null;
  passAccess: string;
  base: number;
  summit: number;
  state: string;
};

// Canonical UI type — snow report merged with static resort details
export type Resort = ResortSnowReport & Omit<ResortDetails, "name">;
