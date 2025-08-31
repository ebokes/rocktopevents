import "dotenv/config";
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { resolve } from "path";

const SITE_URL = (process.env.SITE_URL || "").replace(/\/$/, "");
if (!SITE_URL) throw new Error("SITE_URL is required");

const OUT = resolve("public", "sitemap.xml");

const staticRoutes = [
  "/",
  "/about",
  "/events",
  "/gallery",
  "/contact",
  "/services",
  "/blog",
  "/venues",
];

// Optionally fetch dynamic event slugs if you have an API that returns e.g. [{ slug: 'lagos-tech-gala' }, ...]
async function getEventSlugs() {
  const api = process.env.EVENTS_API;
  if (!api) return [];
  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error(`Bad response: ${res.status}`);
    const events = await res.json();
    return events.filter((e) => e?.slug).map((e) => `/events/${e.slug}`);
  } catch (err) {
    console.warn("⚠️ Event slugs fetch failed:", err.message);
    return [];
  }
}

async function run() {
  const sm = new SitemapStream({ hostname: SITE_URL });
  const ws = createWriteStream(OUT);
  sm.pipe(ws);

  const events = await getEventSlugs();
  const routes = Array.from(new Set([...staticRoutes, ...events]));

  const lastmodISO = new Date().toISOString();
  for (const url of routes) {
    sm.write({
      url,
      changefreq: "weekly",
      priority: url === "/" ? 1.0 : 0.7,
      lastmodISO,
    });
  }
  sm.end();
  await streamToPromise(sm);
  console.log(`✅ sitemap.xml created at ${OUT} with ${routes.length} urls`);
}

run().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
