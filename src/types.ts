export type DeerDataRow = {
  Name: string;
  Age: string;
  "Weather Conditions": string;
};

export type PieDataRow = {
  name: string;
  value: number;
};
export type BarDataRow = {
  name: string;
  crashes: number;
};
export type GraphDataRow = {
  name: string;
  crashes: number;
};

export let clearList = ['Clear', 'Clear/Clear', 'Clear/Other', 'Cloudy', 'Severe Crosswinds', 'Severe Crosswinds/Clear', 'Clear/Severe Crosswinds', 'Cloudy/Clear', 'Cloudy/Cloudy'];
export let rainList = [
  "Rain",
  "Cloudy/Rain",
  "Rain/Unknown",
  "Cloudy/Sleet, hail (freezing rain or drizzle)",
  "Rain/Rain",
  "Rain/Severe Crosswinds",
  "Sleet, hail (freezing rain or drizzle)/Cloudy",
  "Sleet, hail (freezing rain or drizzle)/Sleet, hail (freezing rain or drizzle)",
];
export let fogList = [
  "Fog, smog, smoke",
  "Cloudy/Fog, smog, smoke",
  "Fog",
  "Clear/Fog, smog, smoke",
  "Fog, smog, smoke/Rain",
  "Fog, smog, smoke/Fog, smog, smoke",
  "Fog, smog, smoke/Other",
  "Sleet, hail (freezing rain or drizzle)/Fog, smog, smoke",
  "Fog, smog, smoke/Unknown",
];
export let snowList = [
  "Rain/Snow",
  "Snow",
  "Blowing sand, snow",
  "Blowing sand, snow/Snow",
  "Clear/Blowing sand, snow",
  "Clear/Snow",
  "Cloudy/Blowing sand",
  "snow",
  "Rain/Sleet, hail (freezing rain or drizzle)",
  "Sleet, hail (freezing rain or drizzle)/Snow",
  "Sleet, hail (freezing rain or drizzle)/Clear",
  "Sleet, hail (freezing rain or drizzle)/Cloudy",
];
