import { geoMercator, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { feature, merge, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import topo from 'swiss-maps/2026/ch-combined.json';
import { KANTONE, GEMEINDEN } from './kantone';

/*
 * Maps are rendered to SVG path strings at build time (ADR 0001): no map service and
 * no geodata download at runtime. Boundaries: BFS generalised boundaries via swiss-maps (© swisstopo / BFS).
 */

const t = topo as unknown as Topology<{
  country: GeometryCollection; cantons: GeometryCollection; municipalities: GeometryCollection; lakes: GeometryCollection;
}>;

export const KARTEN_QUELLE = {
  titel: 'BFS, Generalisierte Gemeindegrenzen 2026 (swisstopo), aufbereitet von swiss-maps',
  url: 'https://www.bfs.admin.ch/bfs/de/home.assetdetail.34367751.html',
};

export type Flaeche = { id: number; code: string; name: string; d: string };
/** `umriss`: outline the lakes are clipped to (canton maps), so neighbouring lakes don't spill in. */
export type Karte = { breite: number; hoehe: number; flaechen: Flaeche[]; seen: string; grenzen: string; umriss?: string };

const runden = (d: string | null) => (d ?? '').replace(/-?\d+\.\d+/g, (z) => String(Math.round(Number(z) * 2) / 2));

function projektion(ziel: GeoPermissibleObjects, breite: number) {
  const vorlaeufig = geoMercator().fitWidth(breite, ziel);
  const [[, y0], [, y1]] = geoPath(vorlaeufig).bounds(ziel);
  return { projektion: vorlaeufig, hoehe: Math.ceil(y1 - y0 + 2) };
}

const seenAlle = feature(t, t.objects.lakes);

/** Switzerland with its 26 cantons. */
export function schweizKarte(breite = 800): Karte {
  const land = feature(t, t.objects.country);
  const { projektion: p, hoehe } = projektion(land, breite);
  const pfad = geoPath(p);
  const kantone = feature(t, t.objects.cantons).features;
  return {
    breite,
    hoehe,
    flaechen: kantone.map((f) => {
      const k = KANTONE[Number(f.id) - 1];
      return { id: k.nr, code: k.code, name: k.name, d: runden(pfad(f)) };
    }),
    seen: runden(pfad(seenAlle)),
    grenzen: runden(pfad(mesh(t, t.objects.cantons))),
  };
}

/** One canton with its municipalities. Municipalities not in the BFS list (shared territories) are left out. */
export function kantonKarte(nr: number, breite = 640): Karte {
  const kanton = feature(t, t.objects.cantons).features.find((f) => Number(f.id) === nr);
  if (!kanton) throw new Error(`Kanton ${nr} nicht in den Kartendaten`);
  const code = KANTONE[nr - 1].code;
  const namen = new Map(GEMEINDEN.filter((g) => g.kanton === code).map((g) => [g.bfs, g.name]));
  const { projektion: p, hoehe } = projektion(kanton, breite);
  const pfad = geoPath(p);
  const gemeinden = { ...t.objects.municipalities, geometries: t.objects.municipalities.geometries.filter((g) => namen.has(Number(g.id))) };
  return {
    breite,
    hoehe,
    flaechen: feature(t, gemeinden).features.map((f) => ({ id: Number(f.id), code, name: namen.get(Number(f.id))!, d: runden(pfad(f)) })),
    seen: runden(pfad(seenAlle)),
    grenzen: runden(pfad(mesh(t, gemeinden))),
    umriss: runden(pfad(kanton)),
  };
}

export type Bezirk = { name: string; d: string; x: number; y: number };
export type BezirkKarte = { breite: number; hoehe: number; bezirke: Bezirk[]; seen: string; umriss: string };

type Punkt = [number, number];

/**
 * Label point: the point of the district's largest part that lies farthest from its edges
 * (grid search). Unlike the centroid it stays inside ring-shaped districts that surround another one.
 */
function beschriftungspunkt(polygone: Punkt[][][]): Punkt {
  const flaeche = (r: Punkt[]) => Math.abs(r.reduce((s, [x, y], i) => { const [x2, y2] = r[(i + 1) % r.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
  const ringe = polygone.reduce((a, b) => (flaeche(b[0]) > flaeche(a[0]) ? b : a));
  const xs = ringe[0].map((q) => q[0]), ys = ringe[0].map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const innen = (x: number, y: number) => ringe.reduce((drin, r) => {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      if ((r[i][1] > y) !== (r[j][1] > y) && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) drin = !drin;
    }
    return drin;
  }, false);
  const abstand = (x: number, y: number) => {
    let min = Infinity;
    for (const r of ringe) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [ax, ay] = r[j], dx = r[i][0] - ax, dy = r[i][1] - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
      min = Math.min(min, Math.hypot(x - ax - t * dx, y - ay - t * dy));
    }
    return min;
  };
  let best: Punkt = [(x0 + x1) / 2, (y0 + y1) / 2], bestD = -1;
  const schritt = Math.max(x1 - x0, y1 - y0) / 40;
  for (let x = x0; x <= x1; x += schritt) for (let y = y0; y <= y1; y += schritt) {
    if (!innen(x, y)) continue;
    const d = abstand(x, y);
    if (d > bestD) { bestD = d; best = [x, y]; }
  }
  return best;
}

/** One canton divided into its BFS districts (merged municipalities), with a label point per district. */
export function bezirkKarte(code: string, breite = 640): BezirkKarte {
  const nr = KANTONE.findIndex((k) => k.code === code) + 1;
  const kanton = feature(t, t.objects.cantons).features.find((f) => Number(f.id) === nr);
  if (!kanton) throw new Error(`Kanton ${code} nicht in den Kartendaten`);
  const bezirkVon = new Map(GEMEINDEN.filter((g) => g.kanton === code).map((g) => [g.bfs, g.bezirk]));
  const { projektion: p, hoehe } = projektion(kanton, breite);
  const pfad = geoPath(p);
  const namen = [...new Set(bezirkVon.values())];
  return {
    breite,
    hoehe,
    bezirke: namen.map((name) => {
      const flaeche = merge(t, t.objects.municipalities.geometries.filter((g) => bezirkVon.get(Number(g.id)) === name) as never);
      const [x, y] = beschriftungspunkt((flaeche.coordinates as Punkt[][][]).map((poly) => poly.map((ring) => ring.map((c) => p(c) as Punkt))));
      return { name, d: runden(pfad(flaeche)), x: Math.round(x), y: Math.round(y) };
    }),
    seen: runden(pfad(seenAlle)),
    umriss: runden(pfad(kanton)),
  };
}
