import { MetadataRoute } from "next";
import { MOCK_DIGITAL_PRODUCTS, INITIAL_CATEGORIES } from "@/data/mockProducts";
import { getSiteUrl } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const buildDate = new Date("2026-10-20T00:00:00Z");

  const productUrls: MetadataRoute.Sitemap = MOCK_DIGITAL_PRODUCTS.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: buildDate,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = INITIAL_CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: buildDate,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: buildDate,
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
