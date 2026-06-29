export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassValue[];

/**
 * Minimal, dependency-free className joiner.
 * Later classes win naturally because they appear later in the string,
 * which is sufficient for our controlled component API.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (Array.isArray(v)) {
      v.forEach(walk);
    } else {
      out.push(String(v));
    }
  };
  inputs.forEach(walk);
  return out.join(" ");
}

export function initials(name?: string | null): string {
  if (!name) return "··";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Compact relative time, e.g. "2m ago", "3h ago", "Apr 12". */
export function timeAgo(input: string | number | Date): string {
  const date = new Date(input);
  const diff = Date.now() - date.getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDate(input?: string | number | Date | null): string {
  if (!input) return "—";
  return new Date(input).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
