"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  Trash2,
  FolderTree,
  Boxes,
  Wrench,
  Gamepad2,
  Key,
  Sparkles,
  Globe,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { useProductStore } from "@/lib/store/productStore";
import { Category, SubCategory } from "@/data/mockProducts";

export default function AdminCategoryManager() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    resetCategoriesToDefault,
  } = useCategoryStore();

  const products = useProductStore((state) => state.products);

  // Modal States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catFormData, setCatFormData] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    badge: "",
    iconName: "Boxes",
  });

  // Subcategory Modal State
  const [subModalTargetCat, setSubModalTargetCat] = useState<Category | null>(null);
  const [subNameInput, setSubNameInput] = useState("");
  const [subSlugInput, setSubSlugInput] = useState("");
  const [subDescInput, setSubDescInput] = useState("");

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatFormData({ ...cat });
    setIsCatModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setEditingCat(null);
    setCatFormData({
      name: "",
      slug: "",
      description: "",
      badge: "",
      iconName: "Boxes",
    });
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.name) return;

    const calculatedSlug =
      catFormData.slug ||
      catFormData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    if (editingCat) {
      updateCategory(editingCat.id, {
        ...catFormData,
        slug: calculatedSlug,
      });
    } else {
      addCategory({
        name: catFormData.name,
        slug: calculatedSlug,
        description: catFormData.description || "",
        badge: catFormData.badge,
        iconName: catFormData.iconName as any,
        subcategories: [],
      });
    }

    setIsCatModalOpen(false);
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subModalTargetCat || !subNameInput.trim()) return;

    const calculatedSlug =
      subSlugInput.trim() ||
      subNameInput
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    addSubcategory(subModalTargetCat.id, {
      name: subNameInput.trim(),
      slug: calculatedSlug,
      description: subDescInput.trim(),
    });

    setSubModalTargetCat(null);
    setSubNameInput("");
    setSubSlugInput("");
    setSubDescInput("");
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Wrench":
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case "Gamepad2":
        return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      case "Key":
        return <Key className="w-4 h-4 text-amber-400" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-cyan-400" />;
      default:
        return <Boxes className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Manager Card */}
      <div className="bg-[#0f1118] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xs">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Categories &amp; Subcategories Manager</h3>
              <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {categories.length} Categories
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage multi-page marketplace routes, subcategories (e.g. plugins &amp; themes, shared &amp; private AI accounts).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (confirm("Reset categories back to initial defaults?")) {
                  resetCategoriesToDefault();
                }
              }}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
              title="Reset Categories to Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="divide-y divide-white/[0.06]">
          {categories.map((cat) => {
            const catProductCount = products.filter(
              (p) => p.category === cat.slug || p.category === cat.id
            ).length;

            return (
              <div key={cat.id} className="p-6 space-y-4 hover:bg-white/[0.01] transition-colors">
                {/* Category Main Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 shrink-0 mt-0.5 sm:mt-0">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                        {cat.badge && (
                          <span className="text-[9.5px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
                            {cat.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-500 font-mono">
                          ({catProductCount} products)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{cat.description}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Page</span>
                    </Link>

                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}" and all its subcategories?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories Area */}
                <div className="pl-12 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5 text-neutral-500" />
                      Subcategories ({cat.subcategories.length})
                    </span>

                    <button
                      onClick={() => {
                        setSubModalTargetCat(cat);
                        setSubNameInput("");
                        setSubSlugInput("");
                        setSubDescInput("");
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Subcategory
                    </button>
                  </div>

                  {cat.subcategories.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-neutral-500">
                      No subcategories added yet. Click &quot;+ Add Subcategory&quot; to organize products.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {cat.subcategories.map((sub) => {
                        const subProdCount = products.filter(
                          (p) =>
                            (p.category === cat.slug || p.category === cat.id) &&
                            p.subcategory === sub.id
                        ).length;

                        return (
                          <div
                            key={sub.id}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-2 group/sub"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white truncate">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  ({subProdCount})
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono block">
                                slug: {sub.slug}
                              </span>
                            </div>

                            <button
                              onClick={() => deleteSubcategory(cat.id, sub.id)}
                              className="p-1 text-neutral-500 hover:text-rose-400 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                              title="Delete Subcategory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* EDIT / CREATE CATEGORY MODAL */}
      {/* ============================================================== */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#10131e] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-bold text-base text-white">
                {editingCat ? `Edit Category: ${editingCat.name}` : "Add New Category"}
              </h4>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Tools & Accounts"
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  URL Slug (e.g. /category/your-slug)
                </label>
                <input
                  type="text"
                  placeholder="auto-generated if empty"
                  value={catFormData.slug}
                  onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Icon Style</label>
                <select
                  value={catFormData.iconName}
                  onChange={(e) => setCatFormData({ ...catFormData, iconName: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Wrench">Wrench (WordPress / Development)</option>
                  <option value="Gamepad2">Gamepad2 (Gaming & Codes)</option>
                  <option value="Key">Key (Software Licenses)</option>
                  <option value="Sparkles">Sparkles (AI Tools & Accounts)</option>
                  <option value="Globe">Globe (Turnkey Websites)</option>
                  <option value="Boxes">Boxes (General)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. SHARED & PRIVATE or AGENCY ACTIVATIONS"
                  value={catFormData.badge || ""}
                  onChange={(e) => setCatFormData({ ...catFormData, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description shown in category hero and navigation..."
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD SUBCATEGORY MODAL */}
      {/* ============================================================== */}
      {subModalTargetCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#10131e] rounded-3xl border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="font-bold text-sm text-white">Add Subcategory</h4>
                <p className="text-xs text-neutral-400">
                  Inside category: <span className="text-blue-400">{subModalTargetCat.name}</span>
                </p>
              </div>
              <button
                onClick={() => setSubModalTargetCat(null)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubcategory} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shared Accounts or WordPress Plugins"
                  value={subNameInput}
                  onChange={(e) => setSubNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Subcategory Slug</label>
                <input
                  type="text"
                  placeholder="e.g. plugins (auto-generated if empty)"
                  value={subSlugInput}
                  onChange={(e) => setSubSlugInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief note about this subcategory..."
                  value={subDescInput}
                  onChange={(e) => setSubDescInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSubModalTargetCat(null)}
                  className="px-3 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
