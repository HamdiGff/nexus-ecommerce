import { Suspense } from "react";
import type { Metadata } from "next";
import { INITIAL_CATEGORIES } from "@/data/mockProducts";
import CategoryClient from "./CategoryClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
      title: "Category | NEXUS Digital",
    };
  }

  return {
    title: `${category.name} | NEXUS Digital`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090a0f] text-neutral-400 flex items-center justify-center text-xs font-mono">
          Loading category...
        </div>
      }
    >
      <CategoryClient slug={slug} />
    </Suspense>
  );
}
