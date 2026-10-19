import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MOCK_DIGITAL_PRODUCTS } from "@/data/mockProducts";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export function generateStaticParams() {
  if (MOCK_DIGITAL_PRODUCTS.length === 0) {
    return [{ slug: "preview" }];
  }
  return MOCK_DIGITAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_DIGITAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | NEXUS Digital",
    };
  }

  const title = `${product.title} - Official License & Instant Delivery`;
  const description = `${product.shortDescription || product.description.slice(0, 160)} Instant delivery, secure checkout with Card, PayPal, or Crypto.`;

  return {
    title: `${title} | NEXUS`,
    description,
    keywords: product.seoKeywords.join(", "),
    openGraph: {
      title,
      description,
      images: [{ url: product.images[0] }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = MOCK_DIGITAL_PRODUCTS.find((p) => p.slug === slug);

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

  return (
    <>
      <JsonLd product={resolved} url={`http://localhost:3000/products/${resolved.slug}`} />
      <ProductDetailClient product={resolved} />
    </>
  );
}
