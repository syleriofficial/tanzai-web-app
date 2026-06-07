import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tanzaiai.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://tanzaiai.com/chat",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://tanzaiai.com/pricing",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://tanzaiai.com/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://tanzaiai.com/signup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...["about", "contact", "help", "privacy", "terms", "security"].map(
      (path) => ({
        url: `https://tanzaiai.com/${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })
    ),
  ];
}
