"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Wrench,
  Gamepad2,
  Key,
  Sparkles,
  Globe,
  Boxes,
  ArrowLeft,
  Search,
  Filter,
  Zap,
  ShieldCheck,
  ChevronRight,
  Package,
  Layers,
  Star,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { useProductStore } from "@/lib/store/productStore";
import { useAuthStore } from "@/lib/store/authStore";
import ProductCard from "@/components/product/ProductCard";
import { DeliveryType } from "@/data/mockProducts";

export default function CategoryClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const subQuery = searchParams.get("sub");

  const categories = useCategoryStore((state) => state.categories);
  const products = useProductStore((state) => state.products);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // Find active category
  const activeCategory = categories.find((c) => c.slug === slug || c.id === slug);

  // Active subcategory filter
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(subQuery || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState<"ALL" | DeliveryType>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  // Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Wrench":
        return <Wrench className="w-6 h-6 text-blue-400" />;
      case "Gamepad2":
        return <Gamepad2 className="w-6 h-6 text-emerald-400" />;
      case "Key":
        return <Key className="w-6 h-6 text-amber-400" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-cyan-400" />;
      default:
        return <Boxes className="w-6 h-6 text-blue-400" />;
    }
  };

  // Filtered Products for this Category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      const matchesCat = p.category === slug || p.category === activeCategory?.id;
      // Subcategory match
      const matchesSub =
        selectedSubcategory === "all" || p.subcategory === selectedSubcategory;
      // Delivery match
      const matchesDelivery =
        deliveryFilter === "ALL" || p.deliveryType === deliveryFilter;
      // Search match
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSub && matchesDelivery && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, slug, activeCategory, selectedSubcategory, deliveryFilter, searchQuery, sortBy]);

  // If category not found
  if (!activeCategory) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#090a0f] text-white">
        <Boxes className="w-12 h-12 text-neutral-600 mb-3" />
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <p className="text-sm text-neutral-400 mt-1 mb-6">
          The requested category <code className="text-blue-400">&quot;{slug}&quot;</code> does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-colors"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Other categories for footer cross-linking
  const otherCategories = categories.filter((c) => c.slug !== activeCategory.slug);

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-6 sm:py-10 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <Link href="/#catalog" className="hover:text-white transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-white font-semibold">{activeCategory.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-[#131624]/90 via-[#0e1019]/95 to-[#090b12]/98 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.05] border border-white/10 shrink-0">
                  {getCategoryIcon(activeCategory.iconName)}
                </div>
                {activeCategory.badge && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono tracking-wider">
                    {activeCategory.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeCategory.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {activeCategory.description}
              </p>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-around sm:justify-start gap-4 sm:gap-6 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  Products Available
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  {categoryProducts.length}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  Subcategories
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono">
                  {activeCategory.subcategories.length}
                </span>
              </div>
            </div>
          </div>

          {/* Subcategory Navigation Pills */}
          {activeCategory.subcategories.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedSubcategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubcategory === "all"
                    ? "bg-white text-neutral-950 font-bold shadow-md"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                All {activeCategory.name}
              </button>

              {activeCategory.subcategories.map((sub) => {
                const subCount = products.filter(
                  (p) =>
                    (p.category === slug || p.category === activeCategory.id) &&
                    p.subcategory === sub.id
                ).length;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedSubcategory === sub.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold border border-blue-400/30 shadow-md shadow-blue-600/20"
                        : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-[10px] font-mono px-1 rounded-full bg-white/[0.1] text-neutral-300">
                      {subCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search in ${activeCategory.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Delivery Method Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setDeliveryFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                deliveryFilter === "ALL"
                  ? "bg-white text-neutral-950 font-bold"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setDeliveryFilter("INSTANT_CODE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
                deliveryFilter === "INSTANT_CODE"
                  ? "bg-emerald-500 text-neutral-950"
                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              <Zap className="w-3 h-3" /> Instant Key
            </button>
            <button
              onClick={() => setDeliveryFilter("SERVICE_SETUP")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
                deliveryFilter === "SERVICE_SETUP"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              }`}
            >
              <Wrench className="w-3 h-3" /> WP Setup
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1.5 px-3 bg-neutral-900 border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="featured">Featured First</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Active Results Summary */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <div>
            Showing <span className="font-semibold text-white">{categoryProducts.length}</span>{" "}
            {categoryProducts.length === 1 ? "product" : "products"}
            {(selectedSubcategory !== "all" || deliveryFilter !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSubcategory("all");
                  setDeliveryFilter("ALL");
                  setSearchQuery("");
                }}
                className="ml-2 text-blue-400 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {categoryProducts.length === 0 ? (
          <div className="py-20 px-6 rounded-3xl bg-[#0f1118]/80 border border-white/[0.08] text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <Package className="w-7 h-7 text-neutral-500" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Catalog Ready for New Products
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto leading-relaxed">
                No products are currently published in this category. You can add new products anytime from the Admin Panel.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 text-xs font-semibold border border-white/10 transition-colors"
              >
                Return to Homepage
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:brightness-110 shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Products in Admin
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Explore Other Categories Section */}
        <div className="pt-12 border-t border-white/[0.08] space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 font-mono">
              Explore More
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Browse Other Digital Categories</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10">
                      {getCategoryIcon(c.iconName)}
                    </div>
                    {c.badge && (
                      <span className="text-[9px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full font-mono">
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                    {c.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 group-hover:text-white">
                  <span>Explore Catalog</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
