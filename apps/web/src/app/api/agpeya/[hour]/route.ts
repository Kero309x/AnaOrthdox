import { NextResponse } from "next/server";
import { AGPEYA_HOURS, BUNDLED, VEIL_HOUR, hourBySlug } from "@/domain/agpeya/hours";
import dataset from "@/data/agpeya/agpeya.json";
import { normalizeHour } from "@/domain/agpeya/normalize";

// Default: bundled dataset (see docs/features/AGPEYA.md). Only with NEXT_PUBLIC_AGPEYA_SOURCE=coptic-api: the incomplete open coptic.io API.
const UPSTREAM = process.env.AGPEYA_API_URL ?? "https://api.coptic.io/api/agpeya";

export const revalidate = 43200;

export function generateStaticParams() {
  return [...AGPEYA_HOURS, ...(BUNDLED ? [VEIL_HOUR] : [])].map((h) => ({ hour: h.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ hour: string }> }) {
  const { hour: slug } = await params;
  const hour = hourBySlug(slug);
  if (!hour) return NextResponse.json({ error: "unknown_hour" }, { status: 404 });
  if (BUNDLED) {
    // Bundled dataset: no remote fetch and no fallback text.
    const data = (dataset as Record<string, { items?: unknown[] }>)[hour.upstream];
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return NextResponse.json({ error: "missing_hour" }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=300, s-maxage=43200, stale-while-revalidate=86400" } });
  }
  try {
    const res = await fetch(`${UPSTREAM}/${hour.upstream}?lang=ar&include=sections`, {
      headers: { "X-Client-Name": "AnaOrthodoxi", Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate },
    });
    if (!res.ok) return NextResponse.json({ error: "upstream_status", status: res.status }, { status: 502 });
    const data = normalizeHour(await res.json(), hour.upstream);
    return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=300, s-maxage=43200, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
  }
}
