import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  const safe = normalizeDisplayNumber(value);
  return `₳${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(safe)}`;
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(normalizeDisplayNumber(value));
}

export function signedPercent(value: number) {
  const safe = normalizeDisplayNumber(value);
  return `${safe >= 0 ? "+" : ""}${safe.toFixed(2)}%`;
}

export function formatQuantity(value: number) {
  const safe = normalizeDisplayNumber(value);
  return safe.toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: safe % 1 ? 4 : 0 });
}

export function normalizeDisplayNumber(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Object.is(value, -0) || Math.abs(value) < 0.000001 ? 0 : value;
}
