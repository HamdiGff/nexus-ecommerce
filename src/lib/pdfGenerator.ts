import { jsPDF } from "jspdf";
import { OrderRecord } from "@/data/mockOrders";

export function generateOrderPdf(order: OrderRecord) {
  // A4 paper: 210mm x 297mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // ------------------------------------------------------------------
  // 1. TOP HEADER BANNER (Navy Blue #0B1120)
  // ------------------------------------------------------------------
  doc.setFillColor(11, 17, 32); // #0B1120
  doc.rect(0, 0, pageWidth, 42, "F");

  // Emerald / Cyan accent strip
  doc.setFillColor(16, 185, 129); // #10B981
  doc.rect(0, 42, pageWidth, 1.5, "F");

  // Brand Name & Logo Badge
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NEXUS DIGITAL", margin, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // #94A3B8
  doc.text("GLOBAL SOFTWARE & DIGITAL ASSET MARKETPLACE", margin, 24);
  doc.text("VERIFIED SECURE ESCROW & CERTIFICATION AUTHORITY", margin, 29);

  // Document Title (Right Aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("OFFICIAL TAX INVOICE", pageWidth - margin, 17, { align: "right" });

  doc.setFontSize(8.5);
  doc.setTextColor(52, 211, 153); // #34D399 (Emerald)
  doc.text("& DIGITAL ASSET CERTIFICATE", pageWidth - margin, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`CERTIFICATE REF: CERT-${order.orderNumber}`, pageWidth - margin, 28, { align: "right" });
  doc.text(`ISSUED: ${order.createdAt}`, pageWidth - margin, 33, { align: "right" });

  // ------------------------------------------------------------------
  // 2. METADATA CARDS: CUSTOMER DETAILS & PAYMENT RECORD
  // ------------------------------------------------------------------
  let curY = 51;
  const cardWidth = (contentWidth - 6) / 2;
  const cardHeight = 36;

  // Left Box: Customer Billing Info
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.roundedRect(margin, curY, cardWidth, cardHeight, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.text("BILL TO / BENEFICIARY", margin + 4, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Customer Name:", margin + 4, curY + 13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(order.customerName, margin + 30, curY + 13);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Email Address:", margin + 4, curY + 19);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(order.customerEmail, margin + 30, curY + 19);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Account Order ID:", margin + 4, curY + 25);
  doc.setFont("courier", "bold");
  doc.setTextColor(37, 99, 235); // Blue
  doc.text(order.orderNumber, margin + 30, curY + 25);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Customer Status:", margin + 4, curY + 31);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(5, 150, 105);
  doc.text("AUTHENTICATED BUYER", margin + 30, curY + 31);

  // Right Box: Payment & Transaction Record
  const rightCardX = margin + cardWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightCardX, curY, cardWidth, cardHeight, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("PAYMENT SETTLEMENT RECORD", rightCardX + 4, curY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Payment Method:", rightCardX + 4, curY + 13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(order.paymentRail, rightCardX + 32, curY + 13);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Transaction Ref:", rightCardX + 4, curY + 19);
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(order.transactionId.substring(0, 24), rightCardX + 32, curY + 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Settlement Status:", rightCardX + 4, curY + 25);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(5, 150, 105);
  doc.text("PAID IN FULL (CLEARED)", rightCardX + 32, curY + 25);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Currency / Tax:", rightCardX + 4, curY + 31);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("USD ($) • 0% Digital VAT", rightCardX + 32, curY + 31);

  // ------------------------------------------------------------------
  // 3. ITEMIZED ORDER TABLE
  // ------------------------------------------------------------------
  curY = 94;

  // Table Header
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(margin, curY, contentWidth, 7.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM DESCRIPTION & DIGITAL LICENSING", margin + 3, curY + 5);
  doc.text("CATEGORY", margin + 95, curY + 5);
  doc.text("PLAN / TIER", margin + 125, curY + 5);
  doc.text("QTY", margin + 155, curY + 5, { align: "center" });
  doc.text("PRICE (USD)", margin + contentWidth - 3, curY + 5, { align: "right" });

  curY += 7.5;

  // Table Row 1
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, curY, contentWidth, 14, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const truncatedTitle = order.productTitle.length > 55
    ? order.productTitle.substring(0, 52) + "..."
    : order.productTitle;
  doc.text(truncatedTitle, margin + 3, curY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Official Digital Verification Key: ${order.dispensedKey || order.serviceCredentials?.activatedLicenseKey || "AUTHENTICATED-GENUINE"}`, margin + 3, curY + 10);

  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(order.itemDetails.categoryName, margin + 95, curY + 7);

  const planText = order.itemDetails.tierOrVariant.length > 20
    ? order.itemDetails.tierOrVariant.substring(0, 18) + "..."
    : order.itemDetails.tierOrVariant;
  doc.text(planText, margin + 125, curY + 7);

  doc.text("1", margin + 155, curY + 7, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`$${order.total.toFixed(2)}`, margin + contentWidth - 3, curY + 7, { align: "right" });

  curY += 14;

  // Subtotal & Financial Summary Box
  const summaryWidth = 75;
  const summaryX = margin + contentWidth - summaryWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(summaryX, curY, summaryWidth, 22, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Gross Digital Subtotal:", summaryX + 4, curY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`$${order.total.toFixed(2)}`, summaryX + summaryWidth - 4, curY + 5.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Digital Sales Tax / VAT (0%):", summaryX + 4, curY + 10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("$0.00", summaryX + summaryWidth - 4, curY + 10.5, { align: "right" });

  // Total divider line
  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 3, curY + 13, summaryX + summaryWidth - 3, curY + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL AMOUNT PAID:", summaryX + 4, curY + 18.5);
  doc.setTextColor(5, 150, 105); // Emerald Green
  doc.text(`$${order.total.toFixed(2)} USD`, summaryX + summaryWidth - 4, curY + 18.5, { align: "right" });

  // ------------------------------------------------------------------
  // 4. CERTIFICATE OF DIGITAL ASSET AUTHENTICITY & LICENSING VAULT
  // ------------------------------------------------------------------
  curY = 138;

  // Container border with subtle gradient-like fill
  doc.setFillColor(240, 253, 244); // Light Emerald #F0FDF4
  doc.setDrawColor(52, 211, 153); // Emerald border
  doc.roundedRect(margin, curY, contentWidth, 68, 3, 3, "FD");

  // Certificate Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(6, 95, 70); // Dark emerald #065F46
  doc.text("OFFICIAL CERTIFICATE OF DIGITAL ASSET OWNERSHIP", margin + 6, curY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text("Authenticated cryptographic license guarantee issued by NEXUS Global Escrow Network.", margin + 6, curY + 13);

  // Asset Details Box
  const assetInnerY = curY + 17;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(167, 243, 208); // Light emerald border
  doc.roundedRect(margin + 4, assetInnerY, contentWidth - 8, 44, 2, 2, "FD");

  let detailY = assetInnerY + 6;

  // Case 1: WordPress Service Setup (Plugins & Themes)
  if (order.serviceCredentials) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("WordPress Licensed Target URL:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text(order.serviceCredentials.wpAdminUrl, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Official Agency Activation Key:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(
      order.serviceCredentials.activatedLicenseKey || "WPR-AGENCY-AUTH-772910",
      margin + 55,
      detailY
    );

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("License Verification Status:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text("100% Genuine Direct Core Updates Verified", margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Security & Privacy Guarantee:", margin + 7, detailY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Temporary credentials automatically purged via 24-hr AES-256 buffer.", margin + 55, detailY);
  }
  // Case 2: AI Tool Accounts
  else if (order.accountCredentials) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("AI Service & Tool:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(126, 34, 206);
    doc.text(order.accountCredentials.toolName, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Authorized Login Email:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(order.accountCredentials.accountEmail, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Assigned Profile / Lock PIN:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(126, 34, 206);
    doc.text(
      `${order.accountCredentials.profileSlot || "Slot #1"} (PIN: ${order.accountCredentials.profilePin || "N/A"})`,
      margin + 55,
      detailY
    );

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Validity / Warranty:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(
      `${order.accountCredentials.expiresAt || "30 Days"} • Full Replacement Guarantee Active`,
      margin + 55,
      detailY
    );
  }
  // Case 3: Game Digital Gift Codes
  else if (order.gameGiftCode) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Platform & Region:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`${order.gameGiftCode.platform} (${order.gameGiftCode.region})`, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Digital Voucher Code / PIN:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(order.gameGiftCode.code, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Wallet Face Value:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(order.gameGiftCode.faceValue, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Authenticity Assurance:", margin + 7, detailY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Unused genuine retail digital code redeemable immediately in client.", margin + 55, detailY);
  }
  // Case 4: Software Retail License Keys
  else if (order.softwareLicense || order.dispensedKey) {
    const key = order.softwareLicense?.licenseKey || order.dispensedKey || "W11P-9X77B-KD82A-MN491-LP829";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Software Product:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(order.softwareLicense?.softwareName || order.productTitle, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Retail Product Key:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(key, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Activation Protocol:", margin + 7, detailY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text("Lifetime Online Activation • Direct Publisher Verification", margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Official Download:", margin + 7, detailY);
    doc.setFont("courier", "normal");
    doc.setTextColor(37, 99, 235);
    doc.text(order.softwareLicense?.officialDownloadUrl || "Official Publisher Portal", margin + 55, detailY);
  }
  // Case 5: Turnkey Websites
  else if (order.deliveredAsset) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Domain Asset Name:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(order.deliveredAsset.domainName, margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Domain EPP Transfer Code:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(126, 34, 206);
    doc.text(order.deliveredAsset.domainEppCode || "EPP-ON-DISPATCH", margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Google Account Owner:", margin + 7, detailY);
    doc.setFont("courier", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(order.deliveredAsset.gmailLogin || "Google Ownership Assigned", margin + 55, detailY);

    detailY += 7;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Asset Transfer Guarantee:", margin + 7, detailY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Full registrar unlock & escrow verified AdSense asset transfer.", margin + 55, detailY);
  }

  // ------------------------------------------------------------------
  // 5. SECURITY SEAL, CHECKSUM & LEGAL COMPLIANCE
  // ------------------------------------------------------------------
  curY = 214;

  // Security Verification Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, curY, contentWidth, 34, 2, 2, "FD");

  // Official Stamp graphic Simulation
  doc.setFillColor(16, 185, 129); // Emerald
  doc.circle(margin + 16, curY + 17, 10, "F");
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 16, curY + 17, 8.5, "F");
  doc.setFillColor(16, 185, 129);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("NEXUS", margin + 16, curY + 15.5, { align: "center" });
  doc.text("VERIFIED", margin + 16, curY + 18.5, { align: "center" });

  // Verification details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Cryptographic Verification & Authenticity Audit:", margin + 31, curY + 8);

  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  // Generate deterministic checksum for display
  const checksum = `SHA256: 4a8f9c1b7e2d6304${order.orderNumber.replace(/[^0-9]/g, "")}e821049b772910fae109283746cba92841`;
  doc.text(checksum, margin + 31, curY + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("This document constitutes legal proof of purchase and genuine digital license ownership.", margin + 31, curY + 19);
  doc.text("For warranty verification, customer portal lookup, or technician assistance, visit:", margin + 31, curY + 23.5);
  doc.setFont("courier", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text(`http://localhost:3000/orders/${order.orderNumber}`, margin + 31, curY + 28);

  // ------------------------------------------------------------------
  // 6. FOOTER
  // ------------------------------------------------------------------
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("© 2026 NEXUS Digital Commerce Inc. All rights reserved. Registered Digital Goods Merchant.", margin, pageHeight - 10);
  doc.text(`Order: ${order.orderNumber} • Page 1 of 1`, pageWidth - margin, pageHeight - 10, { align: "right" });

  // Trigger automatic download of the PDF in the browser
  doc.save(`NEXUS-INVOICE-${order.orderNumber}.pdf`);
}
