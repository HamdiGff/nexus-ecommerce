import { Category, DigitalProduct } from "@/data/mockProducts";
import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

interface CategoryJsonLdProps {
  category: Category;
  products: DigitalProduct[];
}

export default function CategoryJsonLd({ category, products }: CategoryJsonLdProps) {
  const siteUrl = getSiteUrl();
  const categoryUrl = `${siteUrl}/category/${category.slug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}#collection`,
    name: `${category.name} | ${SITE_CONFIG.shortName}`,
    description: category.description,
    url: categoryUrl,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Digital Products`,
      numberOfItems: products.length,
      itemListElement: products.map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: prod.title,
        url: `${siteUrl}/products/${prod.slug}`,
        image: prod.images?.[0] || `${siteUrl}/og-image.png`,
      })),
    },
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
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
