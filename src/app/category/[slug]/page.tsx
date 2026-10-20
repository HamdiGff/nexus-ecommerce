import { Suspense } from "react";
import type { Metadata } from "next";
import { INITIAL_CATEGORIES, MOCK_DIGITAL_PRODUCTS } from "@/data/mockProducts";
import CategoryClient from "./CategoryClient";
import CategoryJsonLd from "@/components/seo/CategoryJsonLd";
import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export function generateStaticParams() {
  return INITIAL_CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    return {
      title: "Category Not Found | NEXUS Digital",
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/category/${category.slug}`;
  const title = `${category.name} - Instant Digital Delivery`;
  const description = `${category.description} 100% verified authentic licenses with instant delivery and secure checkout.`;

  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} license`,
      "buy online",
      "instant activation",
      "cheap digital licenses",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: `${category.name} | ${SITE_CONFIG.name}`,
      description,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${category.name} on ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${SITE_CONFIG.shortName}`,
      description,
      creator: SITE_CONFIG.social.twitter,
      images: [`${siteUrl}/og-image.png`],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
  const matchingProducts = category
    ? MOCK_DIGITAL_PRODUCTS.filter((p) => p.category === category.id || p.category === category.slug)
    : [];

  return (
    <>
      {category && <CategoryJsonLd category={category} products={matchingProducts} />}
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#090a0f] text-neutral-400 flex items-center justify-center text-xs font-mono">
            Loading category...
          </div>
        }
      >
        <CategoryClient slug={slug} />
      </Suspense>
    </>
  );
}
