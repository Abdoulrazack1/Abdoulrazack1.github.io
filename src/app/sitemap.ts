import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/projets/${p.slug}/`, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
