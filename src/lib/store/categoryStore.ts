"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, SubCategory, INITIAL_CATEGORIES } from "@/data/mockProducts";

interface CategoryStoreState {
  categories: Category[];
  addCategory: (category: Omit<Category, "id"> & { id?: string }) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, subcategory: Omit<SubCategory, "id"> & { id?: string }) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<SubCategory>) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  resetCategoriesToDefault: () => void;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryStoreState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,

      addCategory: (catData) => {
        const id =
          catData.id ||
          catData.slug ||
          catData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const newCategory: Category = {
          id,
          name: catData.name,
          slug: catData.slug || id,
          description: catData.description || "",
          badge: catData.badge,
          iconName: catData.iconName || "Boxes",
          subcategories: catData.subcategories || [],
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));

        return newCategory;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addSubcategory: (categoryId, subData) => {
        const id =
          subData.id ||
          subData.slug ||
          subData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const newSub: SubCategory = {
          id,
          name: subData.name,
          slug: subData.slug || id,
          description: subData.description || "",
        };

        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id !== categoryId) return c;
            return {
              ...c,
              subcategories: [...c.subcategories, newSub],
            };
          }),
        }));
      },

      updateSubcategory: (categoryId, subcategoryId, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id !== categoryId) return c;
            return {
              ...c,
              subcategories: c.subcategories.map((s) =>
                s.id === subcategoryId ? { ...s, ...updates } : s
              ),
            };
          }),
        }));
      },

      deleteSubcategory: (categoryId, subcategoryId) => {
        set((state) => ({
          categories: state.categories.map((c) => {
            if (c.id !== categoryId) return c;
            return {
              ...c,
              subcategories: c.subcategories.filter((s) => s.id !== subcategoryId),
            };
          }),
        }));
      },

      resetCategoriesToDefault: () => {
        set({ categories: INITIAL_CATEGORIES });
      },

      getCategoryBySlug: (slug) => {
        return get().categories.find((c) => c.slug === slug || c.id === slug);
      },
    }),
    {
      name: "nexus-admin-categories-storage",
      version: 1,
    }
  )
);
