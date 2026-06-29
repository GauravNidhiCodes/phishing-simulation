export type Pt = { x: number; y: number };

/**
 * Builds a smooth, continuous SVG path through a set of waypoints using a
 * Catmull-Rom spline converted to cubic béziers. Unlike a mechanical sine
 * wave, the curve only bends where the waypoints ask it to — so the line reads
 * as something hand-routed down the page rather than a templated animation.
 *
 * `tension` controls how relaxed the curve is between points (1 = natural).
 */
export function smoothPath(points: Pt[], tension = 1): string {
  if (points.length < 2) return "";

  const p = points;
  const segs: string[] = [`M ${r(p[0].x)} ${r(p[0].y)}`];

  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    segs.push(
      `C ${r(cp1x)} ${r(cp1y)}, ${r(cp2x)} ${r(cp2y)}, ${r(p2.x)} ${r(p2.y)}`
    );
  }

  return segs.join(" ");
}

function r(n: number): number {
  return Math.round(n * 100) / 100;
}
