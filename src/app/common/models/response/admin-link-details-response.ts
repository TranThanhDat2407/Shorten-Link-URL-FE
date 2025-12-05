export interface AdminLinkDetailsResponse  {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  dailyClicks: {
    date: string;
    clicks: number;
  }[];
}
