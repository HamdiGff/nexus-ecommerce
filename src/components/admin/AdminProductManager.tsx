"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Zap,
  Wrench,
  Globe,
  Layers,
  Sparkles,
  DollarSign,
  Package,
  RotateCcw,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { DigitalProduct, DeliveryType, ProductVariant } from "@/data/mockProducts";
import { useProductStore } from "@/lib/store/productStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { formatPrice } from "@/lib/utils";

export default function AdminProductManager() {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    duplicateProduct,
    resetToDefaults,
  } = useProductStore();

  const categories = useCategoryStore((state) => state.categories);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState<"ALL" | DeliveryType>("ALL");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [modalTab, setModalTab] = useState<"basic" | "pricing" | "delivery">("basic");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quick Price Edit Modal State
  const [quickPriceProduct, setQuickPriceProduct] = useState<DigitalProduct | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState("");
  const [quickOriginalPriceValue, setQuickOriginalPriceValue] = useState("");

  // Quick Image Modal State
  const [quickImageProduct, setQuickImageProduct] = useState<DigitalProduct | null>(null);
  const [newImageUrlInput, setNewImageUrlInput] = useState("");

  // Form State for Create/Edit Modal
  const [formData, setFormData] = useState<Partial<DigitalProduct>>({
    title: "",
    slug: "",
    category: "wordpress",
    deliveryType: "SERVICE_SETUP",
    shortDescription: "",
    description: "",
    price: 19.99,
    originalPrice: 49.0,
    rating: 4.9,
    reviewsCount: 100,
    images: ["/products/rank-math-pro.svg"],
    features: ["100% Genuine Official License", "Automatic Updates in WordPress"],
    variants: [],
    seoKeywords: [],
    isFeatured: true,
    instantStockCount: 50,
  });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesDelivery = deliveryFilter === "ALL" || p.deliveryType === deliveryFilter;
      return matchesSearch && matchesCategory && matchesDelivery;
    });
  }, [products, searchQuery, categoryFilter, deliveryFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const instantKeys = products.filter((p) => p.deliveryType === "INSTANT_CODE").length;
    const wpServices = products.filter((p) => p.deliveryType === "SERVICE_SETUP").length;
    const turnkeyAssets = products.filter((p) => p.deliveryType === "MANUAL_HANDOFF").length;
    const totalStock = products.reduce((acc, p) => acc + (p.instantStockCount || 0), 0);
    return { total, instantKeys, wpServices, turnkeyAssets, totalStock };
  }, [products]);

  // Open Edit Modal
  const handleOpenEdit = (product: DigitalProduct) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      images: [...product.images],
      features: [...product.features],
      variants: product.variants.map((v) => ({ ...v, perks: [...(v.perks || [])] })),
      seoKeywords: [...product.seoKeywords],
    });
    setModalTab("basic");
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      slug: "",
      category: "wordpress",
      deliveryType: "INSTANT_CODE",
      shortDescription: "",
      description: "",
      price: 19.99,
      originalPrice: 49.0,
      rating: 5.0,
      reviewsCount: 1,
      images: ["/products/rank-math-pro.svg"],
      features: ["100% Genuine Digital License", "Instant Auto-Delivery Guarantee"],
      variants: [
        {
          id: `var-new-1`,
          sku: `NEW-TIER-1`,
          title: "Standard License",
          tierName: "Standard",
          price: 19.99,
          originalPrice: 49.0,
          stockQuantity: 99,
          licenseCount: 1,
          perks: ["1 Device / Domain Activation", "1 Year Official Updates"],
        },
      ],
      seoKeywords: ["buy digital license", "instant delivery"],
      isFeatured: true,
      instantStockCount: 50,
    });
    setModalTab("basic");
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      alert("Please provide at least a Product Title and Base Price.");
      return;
    }

    const calculatedSlug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const cleanedImages =
      formData.images && formData.images.length > 0
        ? formData.images.filter((img) => img.trim() !== "")
        : ["/products/rank-math-pro.svg"];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        slug: calculatedSlug,
        images: cleanedImages,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      });
    } else {
      addProduct({
        title: formData.title,
        slug: calculatedSlug,
        category: formData.category || "wordpress",
        subcategory: formData.subcategory,
        accountType: formData.accountType,
        deliveryType: formData.deliveryType || "INSTANT_CODE",
        isInstantDelivery: formData.deliveryType === "INSTANT_CODE",
        shortDescription: formData.shortDescription || "",
        description: formData.description || "",
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        rating: formData.rating || 5.0,
        reviewsCount: formData.reviewsCount || 1,
        images: cleanedImages,
        features: formData.features || ["100% Verified Digital License"],
        variants: formData.variants || [],
        seoKeywords: formData.seoKeywords || [],
        isFeatured: formData.isFeatured ?? true,
        instantStockCount: formData.instantStockCount,
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsModalOpen(false);
    }, 800);
  };

  // Quick Price Save
  const handleQuickPriceSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceProduct) return;
    const newPrice = parseFloat(quickPriceValue);
    const newOrig = quickOriginalPriceValue ? parseFloat(quickOriginalPriceValue) : undefined;
    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }
    updateProduct(quickPriceProduct.id, {
      price: newPrice,
      originalPrice: newOrig,
    });
    setQuickPriceProduct(null);
  };

  // Quick Image Add / Change
  const handleAddQuickImage = (url: string) => {
    if (!quickImageProduct || !url.trim()) return;
    const existing = quickImageProduct.images || [];
    if (!existing.includes(url)) {
      updateProduct(quickImageProduct.id, {
        images: [url, ...existing],
      });
    }
    setNewImageUrlInput("");
  };

  const handleSetPrimaryImage = (productId: string, imgUrl: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const reordered = [imgUrl, ...p.images.filter((img) => img !== imgUrl)];
    updateProduct(productId, { images: reordered });
  };

  const handleRemoveImage = (productId: string, imgUrl: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    if (p.images.length <= 1) {
      alert("A product must have at least one image.");
      return;
    }
    const filtered = p.images.filter((img) => img !== imgUrl);
    updateProduct(productId, { images: filtered });
  };

  // Preset Artwork Links
  const PRESET_ARTWORKS = [
    { label: "Rank Math Pro Official SVG", url: "/products/rank-math-pro.svg" },
    { label: "WP Rocket Official SVG", url: "/products/wp-rocket.svg" },
    { label: "Windows 11 Pro Workspace", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80" },
    { label: "Office 2024 Laptop Setup", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80" },
    { label: "Gaming Neon Steam", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80" },
    { label: "PlayStation Controller", url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80" },
    { label: "Turnkey AdSense Website", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Inventory Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0f1118] border border-white/[0.08] shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-400 block font-mono">Total Products</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-white font-mono">{metrics.total}</span>
            <span className="text-xs text-blue-400">Live in Catalog</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1118] border border-white/[0.08] shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-400 block font-mono">Instant Key Pools</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.instantKeys}</span>
            <span className="text-xs text-neutral-400">({metrics.totalStock} keys ready)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1118] border border-white/[0.08] shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-400 block font-mono">WP Setup Services</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-blue-400 font-mono">{metrics.wpServices}</span>
            <span className="text-xs text-neutral-400">Technician SLA</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1118] border border-white/[0.08] shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-400 block font-mono">Turnkey Web Assets</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-purple-400 font-mono">{metrics.turnkeyAssets}</span>
            <span className="text-xs text-neutral-400">AdSense Portals</span>
          </div>
        </div>
      </div>

      {/* Main Catalog Management Box */}
      <div className="bg-[#0f1118] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xs">
        {/* Header Controls & Actions */}
        <div className="p-6 border-b border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Digital Product Catalog & Image Manager</h3>
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Interactive Backend
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Edit product pictures, update live prices, configure license tiers, or add new digital software.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                if (confirm("Reset catalog back to initial default products? Any custom additions will be restored.")) {
                  resetToDefaults();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
              title="Reset Catalog to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white/[0.01] border-b border-white/[0.06] flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search product title, slug, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Delivery Method Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setDeliveryFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                deliveryFilter === "ALL"
                  ? "bg-white text-neutral-950 font-bold"
                  : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setDeliveryFilter("INSTANT_CODE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
                deliveryFilter === "INSTANT_CODE"
                  ? "bg-emerald-500 text-neutral-950 font-bold"
                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              <Zap className="w-3 h-3" /> Instant Key
            </button>
            <button
              onClick={() => setDeliveryFilter("SERVICE_SETUP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
                deliveryFilter === "SERVICE_SETUP"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              }`}
            >
              <Wrench className="w-3 h-3" /> WP Setup
            </button>
            <button
              onClick={() => setDeliveryFilter("MANUAL_HANDOFF")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
                deliveryFilter === "MANUAL_HANDOFF"
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              }`}
            >
              <Globe className="w-3 h-3" /> Turnkey
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="px-4 py-2.5 bg-neutral-900/40 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              categoryFilter === "all"
                ? "bg-white/[0.12] text-white font-semibold border border-white/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>All Products</span>
            <span className="text-[10px] font-mono px-1 rounded-full bg-white/[0.06] text-neutral-400">
              {products.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.category === cat.slug || p.category === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.slug)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  categoryFilter === cat.slug || categoryFilter === cat.id
                    ? "bg-white/[0.12] text-white font-semibold border border-white/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono px-1 rounded-full bg-white/[0.06] text-neutral-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Items Table / List */}
        <div className="divide-y divide-white/[0.06]">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm text-neutral-400">No products found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setDeliveryFilter("ALL");
                }}
                className="px-3.5 py-1.5 bg-white text-neutral-950 font-bold text-xs rounded-xl hover:bg-neutral-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const discountPercent =
                p.originalPrice && p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;

              return (
                <div
                  key={p.id}
                  className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    {/* Picture Thumbnail with Quick Picture Edit Action */}
                    <div className="relative group/img shrink-0">
                      <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl bg-neutral-950 overflow-hidden border border-white/10 shadow-sm">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/products/rank-math-pro.svg";
                          }}
                        />
                      </div>

                      {/* Quick Change Image Overlay Button */}
                      <button
                        onClick={() => {
                          setQuickImageProduct(p);
                          setNewImageUrlInput("");
                        }}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-bold"
                        title="Change Product Pictures"
                      >
                        <ImageIcon className="w-4 h-4 mb-0.5 text-blue-400" />
                        <span>Pictures</span>
                      </button>

                      {p.images.length > 1 && (
                        <span className="absolute -bottom-1 -right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded-sm border border-white/20">
                          {p.images.length} imgs
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white text-sm truncate hover:text-blue-400 transition-colors">
                          {p.title}
                        </h4>

                        {/* Delivery Type Badge */}
                        {p.deliveryType === "INSTANT_CODE" && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 fill-emerald-400" />
                            Instant Key ({p.instantStockCount || 0} in stock)
                          </span>
                        )}
                        {p.deliveryType === "SERVICE_SETUP" && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                            <Wrench className="w-2.5 h-2.5" />
                            WP Setup Service
                          </span>
                        )}
                        {p.deliveryType === "MANUAL_HANDOFF" && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" />
                            Turnkey Web Asset
                          </span>
                        )}

                        {discountPercent > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            -{discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Meta Sub-line */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 mt-1">
                        <span className="font-mono text-neutral-300">
                          slug: <code className="text-blue-400">/products/{p.slug}</code>
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span>
                          {p.variants.length} {p.variants.length === 1 ? "License Tier" : "License Tiers"}
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="text-white font-mono">{p.rating}</span>
                          <span className="text-neutral-500">({p.reviewsCount})</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Action Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                    {/* Price with Quick-Edit button */}
                    <button
                      onClick={() => {
                        setQuickPriceProduct(p);
                        setQuickPriceValue(p.price.toString());
                        setQuickOriginalPriceValue(p.originalPrice ? p.originalPrice.toString() : "");
                      }}
                      className="group/price text-left px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
                      title="Click to Quick Edit Price"
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-base font-extrabold text-white">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="font-mono text-xs text-neutral-500 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                        <Edit3 className="w-3 h-3 text-neutral-500 group-hover/price:text-blue-400 transition-colors ml-1" />
                      </div>
                      <span className="text-[9.5px] text-neutral-500 block font-sans">
                        Quick Edit Price
                      </span>
                    </button>

                    {/* Edit Full Product Details */}
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Duplicate Product */}
                    <button
                      onClick={() => duplicateProduct(p.id)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 transition-colors"
                      title="Duplicate / Clone Product"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* View Live Page */}
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 transition-colors"
                      title="View Live Store Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete Product */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COMPREHENSIVE FULL EDIT / CREATE PRODUCT MODAL */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-[#10131e] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="font-bold text-lg text-white">
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Digital Product"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Changes save directly and update the entire live storefront instantly.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/10 bg-neutral-900/40 px-6">
              <button
                onClick={() => setModalTab("basic")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  modalTab === "basic"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                1. General & Pictures
              </button>
              <button
                onClick={() => setModalTab("pricing")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  modalTab === "pricing"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                2. Pricing & License Tiers
              </button>
              <button
                onClick={() => setModalTab("delivery")}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  modalTab === "delivery"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                3. Delivery & SEO Features
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1: GENERAL & PICTURES */}
              {modalTab === "basic" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Rank Math Pro SEO Agency License"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. rank-math-pro-seo (auto-generated if empty)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const newCatSlug = e.target.value;
                          const foundCat = categories.find((c) => c.slug === newCatSlug || c.id === newCatSlug);
                          const firstSub = foundCat?.subcategories?.[0]?.slug;
                          setFormData({
                            ...formData,
                            category: newCatSlug,
                            subcategory: firstSub,
                            accountType: newCatSlug === "ai-tools" ? "SHARED" : undefined,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-300 block mb-1">
                        Delivery Method
                      </label>
                      <select
                        value={formData.deliveryType}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryType: e.target.value as DeliveryType })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="INSTANT_CODE">⚡ INSTANT_CODE (Instant Automated Key)</option>
                        <option value="SERVICE_SETUP">🔧 SERVICE_SETUP (WordPress Technician Setup)</option>
                        <option value="MANUAL_HANDOFF">🌐 MANUAL_HANDOFF (Turnkey Asset / Escrow)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Subcategory & AI Account Type Row */}
                  {(() => {
                    const currentCat = categories.find(
                      (c) => c.slug === formData.category || c.id === formData.category
                    );
                    const subList = currentCat?.subcategories || [];
                    const isAiCategory = formData.category === "ai-tools" || currentCat?.slug === "ai-tools";

                    if (subList.length === 0 && !isAiCategory) return null;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                        {subList.length > 0 && (
                          <div>
                            <label className="text-xs font-bold text-neutral-300 block mb-1">
                              Subcategory
                            </label>
                            <select
                              value={formData.subcategory || ""}
                              onChange={(e) => {
                                const newSub = e.target.value;
                                setFormData({
                                  ...formData,
                                  subcategory: newSub,
                                  accountType:
                                    newSub === "shared-accounts"
                                      ? "SHARED"
                                      : newSub === "private-accounts"
                                      ? "PRIVATE"
                                      : formData.accountType,
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">-- None / General --</option>
                              {subList.map((sub) => (
                                <option key={sub.id} value={sub.slug}>
                                  {sub.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {isAiCategory && (
                          <div>
                            <label className="text-xs font-bold text-neutral-300 block mb-1">
                              AI Tool Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    accountType: "SHARED",
                                    subcategory: "shared-accounts",
                                  })
                                }
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                                  formData.accountType === "SHARED"
                                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                    : "bg-neutral-900 border-white/10 text-neutral-400 hover:text-white"
                                }`}
                              >
                                👥 Shared Account
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    accountType: "PRIVATE",
                                    subcategory: "private-accounts",
                                  })
                                }
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                                  formData.accountType === "PRIVATE"
                                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                                    : "bg-neutral-900 border-white/10 text-neutral-400 hover:text-white"
                                }`}
                              >
                                👑 Private Account
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* PICTURE MANAGEMENT SECTION */}
                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Product Pictures & Artwork</span>
                        <span className="text-[11px] text-neutral-400">
                          First picture is used as the primary card image. Click preset or add image URLs.
                        </span>
                      </div>
                    </div>

                    {/* Current Images Thumbnails Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.images?.map((imgUrl, index) => (
                        <div
                          key={index}
                          className="relative group rounded-xl overflow-hidden border border-white/15 bg-neutral-950 aspect-video flex flex-col justify-between"
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/products/rank-math-pro.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const reordered = [imgUrl, ...formData.images!.filter((_, i) => i !== index)];
                                  setFormData({ ...formData, images: reordered });
                                }}
                                className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold"
                                title="Set as Primary Image"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (formData.images!.length <= 1) {
                                  alert("Product must have at least one picture.");
                                  return;
                                }
                                const filtered = formData.images!.filter((_, i) => i !== index);
                                setFormData({ ...formData, images: filtered });
                              }}
                              className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {index === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-sm shadow-sm">
                              Primary Card Image
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Artwork Preset Pills */}
                    <div>
                      <span className="text-[11px] font-semibold text-neutral-400 block mb-1.5 font-mono">
                        Quick Add Branded Artwork Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_ARTWORKS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!formData.images?.includes(preset.url)) {
                                setFormData({
                                  ...formData,
                                  images: [preset.url, ...(formData.images || [])],
                                });
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-blue-600/20 hover:border-blue-500/40 border border-white/10 text-[10.5px] text-neutral-300 hover:text-blue-300 transition-all"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add Custom Image URL Input */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL (SVG, PNG, JPG, or Unsplash link)..."
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newImageUrlInput.trim()) {
                            setFormData({
                              ...formData,
                              images: [newImageUrlInput.trim(), ...(formData.images || [])],
                            });
                            setNewImageUrlInput("");
                          }
                        }}
                        className="px-4 py-2 bg-white text-neutral-950 font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                      >
                        Add Picture
                      </button>
                    </div>
                  </div>

                  {/* Short Description & Description */}
                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Short Description (Card Teaser)
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="e.g. Official Rank Math Pro license activation on your WordPress website with Content AI."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Full Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed product overview, features, and capabilities..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & LICENSE TIERS */}
              {modalTab === "pricing" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/10">
                    <div>
                      <label className="text-xs font-bold text-white block mb-1">
                        Base Selling Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">
                        Compare-at / Original Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        placeholder="e.g. 59.00 (shows strike-through discount)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Multi-Tier Variants Builder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Configured License Tiers</span>
                        <span className="text-[11px] text-neutral-400">
                          Customers choose between these tiers on the product detail page.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newTierIndex = (formData.variants?.length || 0) + 1;
                          const newVariant: ProductVariant = {
                            id: `var-tier-${Date.now()}`,
                            sku: `TIER-${newTierIndex}`,
                            title: `${newTierIndex} Website Pack`,
                            tierName: `${newTierIndex} Sites`,
                            price: Number(formData.price) * (newTierIndex > 1 ? 1.8 : 1),
                            originalPrice: formData.originalPrice ? Number(formData.originalPrice) * 1.8 : undefined,
                            stockQuantity: 99,
                            licenseCount: newTierIndex,
                            perks: [`${newTierIndex} Domains / Devices`, "Full Genuine License"],
                          };
                          setFormData({
                            ...formData,
                            variants: [...(formData.variants || []), newVariant],
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Tier
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {formData.variants?.map((v, idx) => (
                        <div
                          key={v.id || idx}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                        >
                          <div className="sm:col-span-4">
                            <label className="text-[10px] text-neutral-400 font-mono block">Tier Name & Title</label>
                            <input
                              type="text"
                              value={v.title}
                              onChange={(e) => {
                                const updated = [...formData.variants!];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setFormData({ ...formData, variants: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] text-neutral-400 font-mono block">Tier Price ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={v.price}
                              onChange={(e) => {
                                const updated = [...formData.variants!];
                                updated[idx] = { ...updated[idx], price: parseFloat(e.target.value) || 0 };
                                setFormData({ ...formData, variants: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white font-mono"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] text-neutral-400 font-mono block">Badge (e.g. MOST POPULAR)</label>
                            <input
                              type="text"
                              value={v.badge || ""}
                              onChange={(e) => {
                                const updated = [...formData.variants!];
                                updated[idx] = { ...updated[idx], badge: e.target.value };
                                setFormData({ ...formData, variants: updated });
                              }}
                              placeholder="Optional Badge"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white"
                            />
                          </div>

                          <div className="sm:col-span-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (formData.variants!.length <= 1) {
                                  alert("Must have at least one license tier.");
                                  return;
                                }
                                const updated = formData.variants!.filter((_, i) => i !== idx);
                                setFormData({ ...formData, variants: updated });
                              }}
                              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Delete Tier"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DELIVERY & SEO FEATURES */}
              {modalTab === "delivery" && (
                <div className="space-y-5">
                  {formData.deliveryType === "INSTANT_CODE" && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">Instant Serial Key Pool</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        License keys will be auto-dispensed on checkout confirmation screen.
                      </p>
                      <div className="pt-2">
                        <label className="text-xs font-bold text-neutral-200 block mb-1">
                          Live Stock Count
                        </label>
                        <input
                          type="number"
                          value={formData.instantStockCount || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, instantStockCount: parseInt(e.target.value) || 0 })
                          }
                          className="w-36 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bullet Features */}
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">
                      Product Feature Bullet Points (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.features?.join("\n")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          features: e.target.value.split("\n").filter((f) => f.trim() !== ""),
                        })
                      }
                      placeholder="100% Genuine Official License&#10;Automatic Updates in WordPress&#10;Core Web Vitals Boost"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">
                      SEO Keywords (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.seoKeywords?.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seoKeywords: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      placeholder="rank math pro license, buy rank math cheap, wordpress seo"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Saved Successfully!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Save Product Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* QUICK PRICE EDIT MODAL */}
      {/* ============================================================== */}
      {quickPriceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#10131e] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="font-bold text-sm text-white">Quick Price Adjust</h4>
                <p className="text-xs text-neutral-400 truncate max-w-[260px]">
                  {quickPriceProduct.title}
                </p>
              </div>
              <button
                onClick={() => setQuickPriceProduct(null)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickPriceSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Active Selling Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={quickPriceValue}
                  onChange={(e) => setQuickPriceValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Compare-at / Strike-through Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={quickOriginalPriceValue}
                  onChange={(e) => setQuickOriginalPriceValue(e.target.value)}
                  placeholder="e.g. 59.00 (optional)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-sm text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickPriceProduct(null)}
                  className="px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  Update Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* QUICK PICTURE MANAGER MODAL */}
      {/* ============================================================== */}
      {quickImageProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#10131e] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="font-bold text-sm text-white">Product Picture Manager</h4>
                <p className="text-xs text-neutral-400 truncate max-w-[320px]">
                  {quickImageProduct.title}
                </p>
              </div>
              <button
                onClick={() => setQuickImageProduct(null)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Images */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-300 block">Current Pictures:</span>
              <div className="grid grid-cols-3 gap-2">
                {quickImageProduct.images.map((imgUrl, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-white/15 aspect-video bg-neutral-950">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(quickImageProduct.id, imgUrl)}
                          className="px-2 py-1 bg-blue-600 text-white text-[9px] font-bold rounded"
                        >
                          Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(quickImageProduct.id, imgUrl)}
                        className="p-1 bg-rose-600 text-white text-[9px] font-bold rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-xs">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[11px] font-bold text-neutral-400 block font-mono">
                Click to Add Preset Artwork:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ARTWORKS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddQuickImage(preset.url)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-blue-600/20 hover:border-blue-500/40 border border-white/10 text-[10px] text-neutral-300 hover:text-blue-300 transition-all"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Custom URL */}
            <div className="pt-2 border-t border-white/10">
              <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                Add Image URL (SVG, PNG, or Web link):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrlInput}
                  onChange={(e) => setNewImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddQuickImage(newImageUrlInput)}
                  className="px-4 py-2 bg-white text-neutral-950 font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setQuickImageProduct(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
