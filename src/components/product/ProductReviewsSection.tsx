"use client";

import { useState } from "react";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Lock,
  ArrowRight,
  Filter,
  Sparkles,
  UserCheck,
  Check,
  AlertCircle,
  Clock,
  User,
  ChevronDown,
} from "lucide-react";
import { useReviewStore } from "@/lib/store/reviewStore";
import { ProductReview } from "@/data/mockReviews";

interface ProductReviewsSectionProps {
  productId: string;
  productTitle: string;
  rating: number;
  reviewsCount: number;
}

export default function ProductReviewsSection({
  productId,
  productTitle,
  rating,
  reviewsCount,
}: ProductReviewsSectionProps) {
  const { reviews, addReview, voteHelpful, userHasPurchased } = useReviewStore();

  const productReviews = reviews.filter((r) => r.productId === productId);
  const totalCount = Math.max(reviewsCount, productReviews.length);

  // Pagination & Filter state: show 4 by default
  const [visibleCount, setVisibleCount] = useState(4);
  const [activeRatingFilter, setActiveRatingFilter] = useState<number | "ALL">("ALL");
  const [activeExperienceFilter, setActiveExperienceFilter] = useState<string | "ALL">("ALL");
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  // Review submission state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);

  // Form Fields
  const [reviewRating, setReviewRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [setupExperience, setSetupExperience] = useState<
    "Instant Activation" | "Took a little time but perfect" | "Smooth & Fast" | "Support Handled It"
  >("Smooth & Fast");
  const [tierPurchased, setTierPurchased] = useState("1 Website — 1 Year Activation");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filtered reviews
  const filteredReviews = productReviews.filter((r) => {
    if (activeRatingFilter !== "ALL" && r.rating !== activeRatingFilter) return false;
    if (activeExperienceFilter !== "ALL" && r.setupExperience !== activeExperienceFilter) return false;
    return true;
  });

  // Open modal with seamless auto-verification if user recently bought the product
  const handleOpenReviewModal = () => {
    setVerificationError(null);

    // Auto-check if current customer already completed an order for this product
    const check = userHasPurchased(productId);
    if (check.hasPurchased && check.order) {
      setIsVerified(true);
      const autoOrderId = check.order.orderId || "NEX-PURCHASED";
      setOrderNumberInput(autoOrderId);
      if (check.order.customer?.name) {
        setAuthorName(check.order.customer.name);
      }

      // Check if user already reviewed this order to allow editing/updating
      const existing = productReviews.find(
        (r) => r.orderNumber?.toUpperCase() === autoOrderId.toUpperCase()
      );
      if (existing) {
        setExistingReviewId(existing.id);
        setReviewRating(existing.rating);
        setAuthorName(existing.authorName);
        setUserRole(existing.userRole || "");
        setReviewTitle(existing.title);
        setReviewContent(existing.content);
        if (existing.setupExperience) setSetupExperience(existing.setupExperience);
        if (existing.tierPurchased) setTierPurchased(existing.tierPurchased);
      }
    } else {
      setIsVerified(false);
    }

    setIsModalOpen(true);
  };

  // Verify purchase button handler with strict validation against genuine orders
  const handleVerifyPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    const check = userHasPurchased(productId, orderNumberInput);
    if (!check.hasPurchased) {
      setVerificationError(
        "Invalid order number. You can only review products you have officially purchased. Please enter your genuine Order ID (e.g. NEX-948210 from your receipt) or complete checkout first."
      );
      return;
    }

    setIsVerified(true);
    if (check.order?.customer?.name && !authorName) {
      setAuthorName(check.order.customer.name);
    }

    // Check if review already exists for this order to enable edit mode
    const cleanId = orderNumberInput.trim().toUpperCase();
    const existing = productReviews.find(
      (r) => r.orderNumber?.toUpperCase() === cleanId
    );
    if (existing) {
      setExistingReviewId(existing.id);
      setReviewRating(existing.rating);
      setAuthorName(existing.authorName);
      setUserRole(existing.userRole || "");
      setReviewTitle(existing.title);
      setReviewContent(existing.content);
      if (existing.setupExperience) setSetupExperience(existing.setupExperience);
      if (existing.tierPurchased) setTierPurchased(existing.tierPurchased);
    }
  };

  const handleVote = (reviewId: string) => {
    if (votedMap[reviewId]) return;
    voteHelpful(reviewId);
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewTitle.trim() || !reviewContent.trim()) {
      alert("Please fill in your name, review headline, and detailed feedback.");
      return;
    }

    addReview({
      productId,
      authorName: authorName.trim(),
      authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`,
      rating: reviewRating,
      title: reviewTitle.trim(),
      content: reviewContent.trim(),
      isVerifiedBuyer: true,
      orderNumber: orderNumberInput.trim().toUpperCase() || "NEX-VERIFIED",
      setupExperience,
      tierPurchased,
      userRole: userRole.trim() || "Verified WordPress Owner",
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      setIsVerified(false);
      setExistingReviewId(null);
      setAuthorName("");
      setUserRole("");
      setReviewTitle("");
      setReviewContent("");
      setOrderNumberInput("");
    }, 2000);
  };

  return (
    <section id="reviews" className="space-y-10 pt-8">
      {/* 1. Header & Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-wide border border-amber-500/20 mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>100% VERIFIED CUSTOMER REVIEWS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Feedback & Performance Audits
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Real experiences from agencies, WooCommerce shops, and bloggers who upgraded with official activation.
          </p>
        </div>

        {/* Action Button: Only verified buyers */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenReviewModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Write a Verified Review</span>
          </button>
        </div>
      </div>

      {/* 2. Rating Breakdown & Sentiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Overall Rating Box */}
        <div className="md:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#10121a]/90 border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Aggregate Score
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
                {rating}
              </span>
              <span className="text-neutral-500 text-sm font-semibold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-neutral-400 pt-1">
              Based on <strong className="text-white">{totalCount} verified buyer</strong> audits and orders
            </p>
          </div>

          {/* Core Star Bars */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="w-12 text-[11px] text-neutral-400">5 Star</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[94%]" />
              </div>
              <span className="w-8 text-right font-mono text-neutral-400">94%</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="w-12 text-[11px] text-neutral-400">4 Star</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-amber-400/80 rounded-full w-[6%]" />
              </div>
              <span className="w-8 text-right font-mono text-neutral-400">6%</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="w-12 text-[11px]">3 Star</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-amber-400/40 rounded-full w-[0%]" />
              </div>
              <span className="w-8 text-right font-mono">0%</span>
            </div>
          </div>
        </div>

        {/* Right: Setup Speed & Real Sentiment Badges */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#10121a]/90 border border-white/[0.08] flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Real Customer Sentiment Breakdown
            </span>
            <h4 className="text-lg font-bold text-white mt-1">
              What Verified Buyers Highlight Most
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>99% LCP Pass</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Remove Unused CSS drastically cut page weight.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>~35 Min Setup</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Quick technician queue activation during work hours.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>1-Click Update</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Native WP admin updates without nulled risk.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Delay JS (INP)</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Fixed heavy tracking scripts and tag managers.
              </p>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2 flex-wrap text-xs">
            <span className="text-neutral-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>
            <button
              onClick={() => setActiveExperienceFilter("ALL")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeExperienceFilter === "ALL"
                  ? "bg-white text-black shadow-sm"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white"
              }`}
            >
              All Feedback
            </button>
            <button
              onClick={() => setActiveExperienceFilter("Instant Activation")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeExperienceFilter === "Instant Activation"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white"
              }`}
            >
              ⚡ Instant Setup
            </button>
            <button
              onClick={() => setActiveExperienceFilter("Took a little time but perfect")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeExperienceFilter === "Took a little time but perfect"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white"
              }`}
            >
              ⏳ Took a little time but got it
            </button>
            <button
              onClick={() => setActiveExperienceFilter("Support Handled It")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeExperienceFilter === "Support Handled It"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white"
              }`}
            >
              🛠️ Support Configured
            </button>
          </div>
        </div>
      </div>

      {/* 3. Customer Reviews Grid (Initial 4 Reviews + Load More) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.slice(0, visibleCount).map((rev, rIdx) => {
          // Dynamic color palette for user icon badge
          const colorVariants = [
            "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
            "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30",
            "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
            "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
          ];
          const badgeColor = colorVariants[rIdx % colorVariants.length];

          // Initials (e.g., MV for Marcus Vance)
          const initials = rev.authorName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-[#0f111a] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Reviewer Header: User Icon / Initials Badge, Name, Verified Badge, Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${badgeColor} border flex items-center justify-center font-bold font-mono text-xs shadow-inner shrink-0`}
                    >
                      {initials || <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{rev.authorName}</span>
                        {rev.isVerifiedBuyer && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                        <span>{rev.userRole || "WordPress Site Owner"}</span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex text-amber-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Experience Tag & Tier Badge */}
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                  {rev.setupExperience && (
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        rev.setupExperience.includes("Instant")
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          : rev.setupExperience.includes("time")
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                      }`}
                    >
                      Setup: {rev.setupExperience}
                    </span>
                  )}
                  {rev.tierPurchased && (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-neutral-400 border border-white/[0.06]">
                      {rev.tierPurchased}
                    </span>
                  )}
                </div>

                {/* Review Title & Body */}
                <div>
                  <h5 className="font-bold text-sm text-white leading-snug">
                    "{rev.title}"
                  </h5>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2 whitespace-pre-line">
                    {rev.content}
                  </p>
                </div>
              </div>

              {/* Review Footer: Helpful counter */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-500">
                  Was this review helpful to you?
                </span>
                <button
                  onClick={() => handleVote(rev.id)}
                  disabled={votedMap[rev.id]}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all ${
                    votedMap[rev.id]
                      ? "bg-emerald-500/15 text-emerald-400 cursor-default"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{rev.helpfulCount}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Reviews Button */}
      {visibleCount < filteredReviews.length && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 4, filteredReviews.length))}
            className="px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Load More Verified Reviews</span>
            <span className="text-[11px] text-neutral-400 font-mono">
              ({visibleCount} of {filteredReviews.length} shown)
            </span>
            <ChevronDown className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      )}

      {/* 4. MODAL: Verified Buyer Review Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#121420] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Write a Verified Review</h4>
                  <p className="text-xs text-neutral-400">
                    Restricted to authenticated purchasers of {productTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsVerified(false);
                  setVerificationError(null);
                }}
                className="text-neutral-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-lg text-white">Thank You for Your Feedback!</h5>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Your verified review has been posted and will help other WordPress owners make informed choices.
                </p>
              </div>
            ) : !isVerified ? (
              /* Step 1: Verification gate */
              <form onSubmit={handleVerifyPurchase} className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Fraud Prevention & Verified Buyer Guarantee
                  </p>
                  <p className="text-neutral-400 leading-relaxed">
                    To maintain 100% authentic rankings on Google and protect community trust, only customers who purchased can leave reviews.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-200">
                    Order Number or Customer Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NEX-948210 or your checkout email"
                    value={orderNumberInput}
                    onChange={(e) => setOrderNumberInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-neutral-500">
                    💡 <em>Tip: You can find this on your checkout receipt or confirmation email. Any order made on this browser will also auto-verify.</em>
                  </p>
                </div>

                {verificationError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{verificationError}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-neutral-300 text-xs hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>Verify Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: The Review Form */
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {existingReviewId
                        ? "Verified Purchase Located! You can update or edit your review below."
                        : `Order ${orderNumberInput || "Verified"} authenticated! You are reviewing as a verified owner.`}
                    </span>
                  </div>
                  {existingReviewId && (
                    <span className="text-[10px] uppercase font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                      Edit Mode
                    </span>
                  )}
                </div>

                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Your Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">
                      {reviewRating} out of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Two inputs: Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex M."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">Your Role / Site Type</label>
                    <input
                      type="text"
                      placeholder="e.g. WooCommerce Store Owner"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Setup experience */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Activation Experience</label>
                  <select
                    value={setupExperience}
                    onChange={(e: any) => setSetupExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Smooth & Fast">Smooth & Fast (Activated promptly)</option>
                    <option value="Instant Activation">Instant Activation (Worked immediately)</option>
                    <option value="Took a little time but perfect">Took a little time in queue but got it</option>
                    <option value="Support Handled It">Support Desk Configured My Site</option>
                  </select>
                </div>

                {/* Review Headline */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PageSpeed jumped from 45 to 98 on mobile"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Review Body */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Detailed Feedback</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your natural experience with the plugin, setup speed, caching, or Core Web Vitals..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-neutral-300 text-xs hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
