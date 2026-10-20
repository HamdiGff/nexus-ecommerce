"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Zap,
  Wrench,
  Globe,
  Key,
  MessageSquare,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  Sliders,
  Gamepad2,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useQuickAddStore } from "@/lib/store/quickAddStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const categories = useCategoryStore((state) => state.categories);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartBadgeBumping = useQuickAddStore((state) => state.cartBadgeBumping);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-xl shadow-black/40"
            : "bg-[#090a0f]/70 backdrop-blur-lg border-b border-white/[0.05]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-60 group-hover:opacity-100 blur-xs transition-opacity duration-300" />
                  <div className="relative w-9 h-9 rounded-xl bg-[#12141e] border border-white/20 flex items-center justify-center font-black text-white text-base">
                    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 via-indigo-200 to-white">
                      N
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                    NEXUS
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-400">
                    DIGITAL
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {/* Products Dropdown */}
                <div
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => setProductsDropdownOpen(true)}
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      productsDropdownOpen
                        ? "text-white bg-white/[0.08]"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>Products</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        productsDropdownOpen ? "rotate-180 text-blue-400" : "text-neutral-500"
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Popover */}
                  {productsDropdownOpen && (
                    <div className="absolute top-full left-0 w-88 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="rounded-2xl bg-[#0f1118]/95 backdrop-blur-2xl border border-white/10 p-3 shadow-2xl shadow-black/80 space-y-1 max-h-[75vh] overflow-y-auto">
                        {categories.map((cat) => (
                          <div
                            key={cat.id}
                            className="p-2 rounded-xl hover:bg-white/[0.04] transition-colors group"
                          >
                            <Link
                              href={`/category/${cat.slug}`}
                              onClick={() => setProductsDropdownOpen(false)}
                              className="flex items-start gap-3"
                            >
                              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5 shrink-0 group-hover:scale-105 group-hover:border-blue-500/40 transition-all">
                                {cat.slug === "wordpress" && <Wrench className="w-4 h-4 text-blue-400" />}
                                {cat.slug === "game-digital-codes" && <Gamepad2 className="w-4 h-4 text-emerald-400" />}
                                {cat.slug === "software-licenses" && <Key className="w-4 h-4 text-amber-400" />}
                                {cat.slug === "ai-tools" && <Sparkles className="w-4 h-4 text-purple-400" />}
                                {cat.slug === "adsense-websites" && <Globe className="w-4 h-4 text-cyan-400" />}
                                {!["wordpress", "game-digital-codes", "software-licenses", "ai-tools", "adsense-websites"].includes(cat.slug) && (
                                  <Sparkles className="w-4 h-4 text-neutral-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                                    {cat.name}
                                  </span>
                                  {cat.badge && (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/[0.06] text-neutral-300 border border-white/10 shrink-0">
                                      {cat.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug line-clamp-1">
                                  {cat.description}
                                </p>
                              </div>
                            </Link>

                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                                {cat.subcategories.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/category/${cat.slug}?sub=${sub.slug}`}
                                    onClick={() => setProductsDropdownOpen(false)}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-blue-600/20 hover:text-blue-300 text-neutral-400 border border-white/[0.04] transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="pt-2 mt-1 border-t border-white/[0.06] px-2.5 py-1 flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500">100% Genuine & Verified</span>
                          <Link
                            href="/#catalog"
                            onClick={() => setProductsDropdownOpen(false)}
                            className="text-blue-400 hover:underline font-semibold"
                          >
                            All Categories &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Links */}
                <Link
                  href="/orders"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Order</span>
                </Link>

                <Link
                  href="/support"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Support
                </Link>
              </nav>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Trigger */}
              <Link
                href="/#catalog"
                className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Search Catalog"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Cart Trigger Button */}
              <button
                id="navbar-cart-btn"
                onClick={toggleCart}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-white text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer ${
                  cartBadgeBumping
                    ? "scale-110 bg-blue-600/30 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.6)] ring-2 ring-blue-400/50"
                    : "bg-white/[0.06] hover:bg-white/[0.1] border-white/10"
                }`}
                aria-label="View shopping cart"
              >
                <ShoppingBag
                  className={`w-4 h-4 transition-transform duration-300 ${
                    cartBadgeBumping ? "scale-125 text-blue-300 -rotate-12" : "text-blue-400"
                  }`}
                />
                <span className="hidden sm:inline">Bag</span>
                {mounted && totalItems > 0 && (
                  <span
                    className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 ${
                      cartBadgeBumping ? "scale-125 bg-emerald-500 shadow-emerald-400/50" : ""
                    }`}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* USER / AUTH BUTTON */}
              {mounted && (
                <>
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  ) : (
                    <div className="relative" ref={userMenuRef}>
                      <button
                        type="button"
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px] shadow-xs">
                          {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="hidden sm:inline font-mono truncate max-w-[100px]">
                          {user?.name || "User"}
                        </span>
                        {isAdmin && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold uppercase border border-blue-500/30">
                            Admin
                          </span>
                        )}
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </button>

                      {/* User Popover Menu */}
                      {userDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0f1118] border border-white/10 p-2.5 shadow-2xl shadow-black/90 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-3 py-2 border-b border-white/[0.08]">
                            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono truncate">
                              {user?.email}
                            </p>
                          </div>

                          <Link
                            href="/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs font-semibold text-neutral-200 flex items-center gap-2 transition-colors"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span>My Purchased Keys & Vault</span>
                          </Link>

                          {/* ONLY SHOWN WHEN USER IS AN ADMIN */}
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-400 flex items-center gap-2 transition-colors border border-blue-500/20"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                              <span>Merchant Admin Console</span>
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-xs font-semibold text-rose-400 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADMIN SHORTCUT BUTTON: ONLY VISIBLE IF LOGGED IN AS ADMIN */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Admin Hub</span>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/[0.08] space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  Product Categories
                </div>
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-0.5">
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-white/[0.05] rounded-xl flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5">
                        {cat.slug === "wordpress" && <Wrench className="w-4 h-4 text-blue-400" />}
                        {cat.slug === "game-digital-codes" && <Gamepad2 className="w-4 h-4 text-emerald-400" />}
                        {cat.slug === "software-licenses" && <Key className="w-4 h-4 text-amber-400" />}
                        {cat.slug === "ai-tools" && <Sparkles className="w-4 h-4 text-purple-400" />}
                        {cat.slug === "adsense-websites" && <Globe className="w-4 h-4 text-cyan-400" />}
                        {!["wordpress", "game-digital-codes", "software-licenses", "ai-tools", "adsense-websites"].includes(cat.slug) && (
                          <Sparkles className="w-4 h-4 text-neutral-400" />
                        )}
                        <span>{cat.name}</span>
                      </span>
                      {cat.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.06] text-neutral-400">
                          {cat.badge}
                        </span>
                      )}
                    </Link>

                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="pl-10 pr-4 flex flex-wrap gap-1.5 pb-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${cat.slug}?sub=${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-neutral-400 hover:text-white"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-amber-300 hover:bg-white/[0.05] rounded-xl flex items-center gap-2.5"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  Track Order & Asset Vault
                </Link>

                <Link
                  href="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-white/[0.05] rounded-xl flex items-center gap-2.5"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Support Desk
                </Link>

                {/* Mobile Admin Portal - ONLY VISIBLE TO LOGGED IN ADMIN */}
                {mounted && isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Merchant Admin Portal
                  </Link>
                )}

                {/* Mobile Login / Sign out button */}
                {mounted && (
                  <div className="pt-2">
                    {!isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setAuthModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign In / Register</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white/[0.06] text-rose-400 flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out ({user?.email})</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal Container */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
