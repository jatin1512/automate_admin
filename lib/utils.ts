import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function sortYearsAscending(years: Array<any>): Array<any> {
  return [...years].sort((a, b) => (a.year || 0) - (b.year || 0));
}

export function sortCompaniesByName(companies: Array<any>): Array<any> {
  return [...companies].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "")
  );
}
