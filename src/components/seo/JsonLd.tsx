import { DigitalProduct } from "@/data/mockProducts";
import { INITIAL_WP_ROCKET_REVIEWS } from "@/data/mockReviews";

interface JsonLdProps {
  product: DigitalProduct;
  url: string;
}

export default function JsonLd({ product, url }: JsonLdProps) {
  const offers =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => ({
          "@type": "Offer",
          name: v.title,
          price: v.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: url,
          itemOffered: {
            "@type": "Service",
            name: `${product.title} - ${v.title}`,
          },
        }))
      : {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: url,
        };

  // Google Search individual reviews array for enhanced rich snippet stars
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

  const schema = {
    "@context": "https://schema.org",
    "@type":
      product.category === "wordpress" || product.category === "software-licenses"
        ? "SoftwareApplication"
        : "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    url: url,
    applicationCategory:
      product.category === "wordpress" ? "BusinessApplication" : "UtilityApplication",
    operatingSystem: "WordPress / Linux / Windows / macOS",
    brand: {
      "@type": "Brand",
      name: product.title.split("-")[0].trim(),
    },
    offers: Array.isArray(offers)
      ? {
          "@type": "AggregateOffer",
          lowPrice: Math.min(...product.variants.map((v) => v.price)),
          highPrice: Math.max(...product.variants.map((v) => v.price)),
          priceCurrency: "USD",
          offerCount: product.variants.length,
          offers: offers,
        }
      : offers,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviewsSchema,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
