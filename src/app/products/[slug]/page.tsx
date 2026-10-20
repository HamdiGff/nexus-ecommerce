import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MOCK_DIGITAL_PRODUCTS } from "@/data/mockProducts";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export function generateStaticParams() {
  if (MOCK_DIGITAL_PRODUCTS.length === 0) {
    return [{ slug: "preview" }];
  }
  const slugs: { slug: string }[] = [];
  MOCK_DIGITAL_PRODUCTS.forEach((product) => {
    slugs.push({ slug: product.slug });
    if (product.slug === "rank-math-pro") {
      slugs.push({ slug: "rank-math-pro-just-pro" });
      slugs.push({ slug: "rank-math-pro-seo" });
    }
    if (product.slug === "elementor-pro") {
      slugs.push({ slug: "elementor" });
      slugs.push({ slug: "elementor-pro-page-builder" });
    }
    if (product.slug === "astra-pro-theme") {
      slugs.push({ slug: "astra-pro" });
      slugs.push({ slug: "astra-pro-theme-agency" });
    }
    if (product.slug === "google-adsense-approved-websites") {
      slugs.push({ slug: "adsense-approved-websites" });
      slugs.push({ slug: "google-adsense" });
      slugs.push({ slug: "adsense-websites" });
    }
    if (product.slug === "chatgpt-plus") {
      slugs.push({ slug: "chatgpt" });
      slugs.push({ slug: "chatgpt-4" });
      slugs.push({ slug: "openai-chatgpt-plus" });
    }
  });
  return slugs;
}

function resolveProduct(slug: string) {
  const clean = slug.toLowerCase();
  return MOCK_DIGITAL_PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase() === clean ||
      (clean.startsWith("rank-math") && p.slug.startsWith("rank-math")) ||
      (clean.startsWith("elementor") && p.slug.startsWith("elementor")) ||
      (clean.startsWith("astra") && p.slug.startsWith("astra")) ||
      (clean.includes("adsense") && p.slug.includes("adsense")) ||
      (clean.includes("chatgpt") && p.slug.includes("chatgpt"))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = resolveProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | NEXUS Digital",
    };
  }

  const title = `${product.title} - Official License & Instant Delivery`;
  const description = `${product.shortDescription || product.description.slice(0, 160)} Instant delivery, secure checkout with Card, PayPal, or Crypto.`;

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrl = product.images?.[0]?.startsWith("http")
    ? product.images[0]
    : `${siteUrl}${product.images?.[0] || "/og-image.png"}`;

  return {
    title,
    description,
    keywords: product.seoKeywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          alt: `${product.title} - Official Digital License`,
        },
      ],
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.social.twitter,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = resolveProduct(slug);

  const fallbackProduct = {
    id: `prod-${slug}`,
    title: slug.replace(/-/g, " "),
    slug,
    category: "wordpress",
    deliveryType: "INSTANT_CODE" as const,
    isInstantDelivery: true,
    shortDescription: "",
    description: "",
    price: 0,
    rating: 5,
    reviewsCount: 1,
    images: ["/products/rank-math-pro.svg"],
    variants: [],
    features: [],
    seoKeywords: [],
  };

  const resolved = product || fallbackProduct;
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd product={resolved} url={`${siteUrl}/products/${resolved.slug}`} />
      <ProductDetailClient product={resolved} />
    </>
  );
}
