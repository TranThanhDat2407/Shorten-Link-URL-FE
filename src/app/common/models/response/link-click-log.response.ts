export interface LinkClickLogResponse {
  clickedAt: string; // Instant (ISO 8601 string)
  ip: string;
  country: string;
  device: string;
  browser: string;
}
