import type { GeoAIConfig } from 'geo-ai-core';

export default {
  siteName: "My Site",
  siteUrl: "https://example.com",
  siteDescription: "A brief description of my site for AI crawlers.",
  crawlers: "all",
  provider: {
    Pages: [
      {
        title: "Home",
        url: "https://example.com/",
        description: "Welcome to My Site",
      },
    ],
  },
} satisfies GeoAIConfig;
