import type { LostFoundReport } from "../types";

export const findMatchingReport = (
  reports: LostFoundReport[],
  queryType: string,
  queryColor: string
): LostFoundReport | null => {
  const foundReports = reports.filter(
    (report) => report.type === "found" && report.status === "active"
  );

  for (const report of foundReports) {
    const itemLower = report.item.toLowerCase();
    const colorLower = report.color.toLowerCase();
    const descLower = report.description.toLowerCase();

    const matchesItem =
      itemLower.includes(queryType) || descLower.includes(queryType);

    const matchesColor =
      colorLower.includes(queryColor) || descLower.includes(queryColor);

    if (matchesItem && matchesColor) {
      return report;
    }
  }

  return null;
};