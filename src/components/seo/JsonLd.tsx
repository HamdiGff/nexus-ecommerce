import { DigitalProduct } from "@/data/mockProducts";
import { INITIAL_WP_ROCKET_REVIEWS } from "@/data/mockReviews";
import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

interface JsonLdProps {
  product: DigitalProduct;
  url: string;
}

export default function JsonLd({ product, url }: JsonLdProps) {
  const siteUrl = getSiteUrl();
  const cleanUrl = url || `${siteUrl}/products/${product.slug}`;
  const priceValidUntil = "2027-12-31";

  const sellerEntity = {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: siteUrl,
  };

  const offers =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => ({
          "@type": "Offer",
          name: v.title,
          price: v.price,
          priceCurrency: "USD",
          priceValidUntil,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: cleanUrl,
          seller: sellerEntity,
          itemOffered: {
            "@type": "Service",
            name: `${product.title} - ${v.title}`,
          },
        }))
      : {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          priceValidUntil,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: cleanUrl,
          seller: sellerEntity,
        };

  // Google Search individual reviews
  const reviewsSchema = INITIAL_WP_ROCKET_REVIEWS.slice(0, 5).map((rev) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: rev.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Person",
      name: rev.authorName,
    },
    name: rev.title,
    reviewBody: rev.content,
  }));

  const productSchema = {
    "@context": "https://schema.org",
    "@type":
      product.category === "wordpress" || product.category === "software-licenses"
        ? "SoftwareApplication"
        : "Product",
    "@id": `${cleanUrl}#product`,
    name: product.title,
    description: product.description || product.shortDescription,
    image: product.images && product.images.length ? product.images : [`${siteUrl}/og-image.png`],
    url: cleanUrl,
    sku: product.variants?.[0]?.sku || `SKU-${product.id}`,
    mpn: `MPN-${product.slug.toUpperCase()}`,
    applicationCategory:
      product.category === "wordpress" ? "BusinessApplication" : "UtilityApplication",
    operatingSystem: "WordPress / Linux / Windows / macOS",
    brand: {
      "@type": "Brand",
      name: product.title.split("-")[0].trim() || SITE_CONFIG.name,
    },
    offers: Array.isArray(offers)
      ? {
          "@type": "AggregateOffer",
          lowPrice: Math.min(...product.variants.map((v) => v.price)),
          highPrice: Math.max(...product.variants.map((v) => v.price)),
          priceCurrency: "USD",
          priceValidUntil,
          offerCount: product.variants.length,
          offers: offers,
        }
      : offers,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewsCount || 48,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviewsSchema,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category ? product.category.replace(/-/g, " ").toUpperCase() : "Products",
        item: `${siteUrl}/category/${product.category || "wordpress"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: cleanUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
