import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

export default function GlobalJsonLd() {
  const siteUrl = getSiteUrl();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_CONFIG.name,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.supportEmail,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-555-NEXUS",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
