import moment from "moment";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const hexToRgb = (hex) => {
  if (!hex) return [0, 51, 102];
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 51, 102];
};

const getTextColor = (hex) => {
  if (!hex) return [255, 255, 255];
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 255, 255];
};

export const generateReceiptPdf = async (
  order,
  { updated = false, isUpdateReceipt = false } = {},
) => {
  if (!order) return;

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let team = order?.selectedTeam || "NA";
  const items = Array.isArray(order?.orderedItems) ? order.orderedItems : [];
  for (let j = 0; j < items.length; j += 1) {
    if (
      items[j]?.status === "cancelled" ||
      items[j]?.status === "cancelled-and-refunded" ||
      items[j]?.status === "refunded"
    ) {
      continue;
    }
    const orderedCombination = items[j]?.orderedCombination || {};
    const key = Object.keys(orderedCombination).find((k) =>
      k?.includes("Team"),
    );
    if (key && orderedCombination[key]) {
      team = orderedCombination[key];
      break;
    }
  }

  const ship = order?.shippingProperty || {};
  const billTo = order?.shippingAddress || {};

  const orderSubtotalIncludingTax = updated
    ? items
        .filter(
          (item) =>
            item?.status !== "cancelled" &&
            item?.status !== "cancelled-and-refunded",
        )
        .reduce(
          (total, item) =>
            total +
            (Number(item?.orderedCombination?.subTotal) || 0) +
            (Number(item?.orderedCombination?.taxValue) || 0),
          0,
        )
    : Number(order?.paymentDetails?.subTotal) || 0;

  const shippingCost = Number(order?.paymentDetails?.shippingCost) || 0;
  const shippingTaxValue = Number(order?.paymentDetails?.shippingTaxValue) || 0;
  const shippingTaxPercentage =
    order?.paymentDetails?.shippingTaxValuePercentage || 0;

  const totalTaxPaid = updated
    ? items
        .filter(
          (item) =>
            item?.status !== "cancelled" &&
            item?.status !== "cancelled-and-refunded",
        )
        .reduce(
          (total, item) =>
            total + (Number(item?.orderedCombination?.taxValue) || 0),
          0,
        ) + shippingTaxValue
    : items.reduce(
        (total, item) =>
          total + (Number(item?.orderedCombination?.taxValue) || 0),
        0,
      ) + shippingTaxValue;

  const orderTotal = Number(order?.paymentDetails?.orderTotal) || 0;
  const creditLeft = Number(
    order?.creditLeft ??
      order?.paymentDetails?.creditLeft ??
      Math.max(
        0,
        orderTotal -
          Number(
            order?.creditAmount ??
              order?.paymentDetails?.creditAmount ??
              order?.credit ??
              order?.paymentDetails?.credit ??
              0,
          ),
      ),
  );
  const brandColor = hexToRgb(order?.buttonBgColor);
  const darkBlue = brandColor;
  const brandTextColor = getTextColor(order?.buttonTextColor);
  const lightBrandColor = [
    Math.round(brandColor[0] * 0.08 + 255 * 0.92),
    Math.round(brandColor[1] * 0.08 + 255 * 0.92),
    Math.round(brandColor[2] * 0.08 + 255 * 0.92),
  ];

  const headerY = 0;
  const headerHeight = 35;
  const headerPadding = 10;
  doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.rect(0, headerY, pageWidth, headerHeight, "F");

  const orderTitle = order?.shopName || "Order Receipt";
  doc.setTextColor(brandTextColor[0], brandTextColor[1], brandTextColor[2]);
  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text(orderTitle, headerPadding, headerY + 8);

  doc.setFontSize(12);
  doc.text(`ORDER #${order?.orderNumber || "-"}`, headerPadding, headerY + 16);
  const created = moment
    .unix(Number(order?.orderCreatedDate || order?.createdAt || 0))
    .format("MMM, DD YYYY");
  doc.text(`Created: ${created || "—"}`, headerPadding, headerY + 22);

  let currentY = headerY + headerHeight + 10;
  const boxWidth = (pageWidth - 30) / 2;
  const boxHeaderHeight = 8;
  const boxContentPadding = 3;

  const customerBoxX = 10;
  const customerBoxY = currentY;
  doc.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
  doc.rect(customerBoxX, customerBoxY, boxWidth, boxHeaderHeight, "F");
  doc.setTextColor(brandTextColor[0], brandTextColor[1], brandTextColor[2]);
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("Customer", customerBoxX + 3, customerBoxY + 5.5);

  doc.setFillColor(lightBrandColor[0], lightBrandColor[1], lightBrandColor[2]);
  const customerBoxHeight = 46;
  doc.rect(
    customerBoxX,
    customerBoxY + boxHeaderHeight,
    boxWidth,
    customerBoxHeight,
    "F",
  );

  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  let customerContentY = customerBoxY + boxHeaderHeight + 5;
  const customerName =
    (order?.customerName
      ? `${order?.customerName} ${order?.customerLastName || ""}`
      : "") ||
    order?.billingAddress?.name ||
    order?.activity?.[0]?.person?.name ||
    "—";
  doc.text(customerName, customerBoxX + boxContentPadding, customerContentY);
  customerContentY += 5;

  if (order?.customerEmail) {
    doc.text(
      order.customerEmail,
      customerBoxX + boxContentPadding,
      customerContentY,
    );
    customerContentY += 5;
  }
  if (order?.phone) {
    doc.text(
      String(order.phone),
      customerBoxX + boxContentPadding,
      customerContentY,
    );
    customerContentY += 5;
  }

  const orderType =
    ship?.name === "Pickup" || order?.shippingProperty?.name === "Pickup"
      ? "Pickup"
      : "Delivery";
  doc.text(
    `${ship?.name || "Delivery"}${ship?.value ? " (Pickup)" : ""}`,
    customerBoxX + boxContentPadding,
    customerContentY,
  );
  customerContentY += 5;

  if (ship?.address) {
    const addressLines = doc.splitTextToSize(ship.address, boxWidth - 6);
    doc.text(addressLines, customerBoxX + boxContentPadding, customerContentY);
  }

  const shipBillBoxX = customerBoxX + boxWidth + 10;
  const shipBillBoxY = currentY;
  doc.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
  doc.rect(shipBillBoxX, shipBillBoxY, boxWidth, boxHeaderHeight, "F");
  doc.setTextColor(brandTextColor[0], brandTextColor[1], brandTextColor[2]);
  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("Ship/Bill To", shipBillBoxX + 3, shipBillBoxY + 5.5);
  doc.setFillColor(lightBrandColor[0], lightBrandColor[1], lightBrandColor[2]);
  const billToBoxHeight = 46;
  doc.rect(
    shipBillBoxX,
    shipBillBoxY + boxHeaderHeight,
    boxWidth,
    billToBoxHeight,
    "F",
  );

  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  let shipBillContentY = shipBillBoxY + boxHeaderHeight + 5;
  doc.text(
    billTo?.name || "—",
    shipBillBoxX + boxContentPadding,
    shipBillContentY,
  );
  shipBillContentY += 5;
  if (billTo?.address) {
    const addressLines = doc.splitTextToSize(billTo.address, boxWidth - 6);
    doc.text(addressLines, shipBillBoxX + boxContentPadding, shipBillContentY);
    shipBillContentY += addressLines.length * 5;
  }

  currentY =
    Math.max(
      customerBoxY + boxHeaderHeight + customerBoxHeight,
      shipBillBoxY + boxHeaderHeight + billToBoxHeight,
    ) + 10;

  const minTableHeight = 15;
  const hasPendingPayment = order?.paymentStatus === "Pending";
  const hasCreditInfo = creditLeft > 0;
  const hasCustomPayment = Boolean(order?.customPayment?.value);
  const summaryBoxHeight = hasPendingPayment
    ? hasCreditInfo
      ? hasCustomPayment
        ? 72
        : 66
      : hasCustomPayment
        ? 61
        : 55
    : hasCreditInfo
      ? hasCustomPayment
        ? 58
        : 52
      : hasCustomPayment
        ? 51
        : 45;
  const estimatedContentHeight = minTableHeight + summaryBoxHeight + 20;
  if (currentY + estimatedContentHeight > pageHeight - 40) {
    doc.addPage();
    currentY = 10;
  }

  const tableData = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (
      updated &&
      (item?.status === "cancelled" ||
        item?.status === "cancelled-and-refunded")
    ) {
      continue;
    }

    const combo = item?.orderedCombination || {};
    const qty = Number(combo?.qty || 1);
    const unitPrice = Number(combo?.unitPrice ?? item?.price ?? 0);
    const taxValue = Number(combo?.taxValue ?? 0);
    const subTotalValue = Number(combo?.subTotal ?? 0);
    const itemSubTotal =
      subTotalValue > 0 || taxValue > 0
        ? subTotalValue + taxValue
        : qty * unitPrice;

    const customFieldsText =
      item?.customFields
        ?.map((c) =>
          c?.fieldName && c?.value ? `${c.fieldName}: ${c.value}` : "",
        )
        ?.filter(Boolean)
        ?.join("\n") || "";
    const itemNameWithCustomFields = customFieldsText
      ? `${item?.name || "-"}\n\n${customFieldsText}`
      : item?.name || "-";

    tableData.push([
      itemNameWithCustomFields,
      combo?.name || "",
      qty.toString(),
      `$${unitPrice.toFixed(2)}`,
      `$${taxValue.toFixed(2)}`,
      `$${itemSubTotal.toFixed(2)}`,
    ]);
  }

  autoTable(doc, {
    head: [["Item", "Variant", "Qty", "Unit", "Tax", "SubTotal"]],
    body: tableData,
    startY: currentY,
    theme: "grid",
    headStyles: {
      fillColor: darkBlue,
      textColor: brandTextColor,
      fontStyle: "bold",
      fontSize: 11,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: "auto", minCellHeight: 8, overflow: "linebreak" },
      1: { cellWidth: "auto", minCellHeight: 8, overflow: "linebreak" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
      5: { cellWidth: 30, halign: "right" },
    },
    margin: { left: 10, right: 10 },
  });

  const tableEndY = doc.lastAutoTable.finalY;
  const summaryBoxX = pageWidth - 90;
  const summaryBoxWidth = 80;
  let summaryBoxY = tableEndY + 5;
  if (pageHeight - summaryBoxY < summaryBoxHeight) {
    doc.addPage();
    summaryBoxY = 10;
  }

  doc.setFillColor(lightBrandColor[0], lightBrandColor[1], lightBrandColor[2]);
  doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight, "F");
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  doc.setTextColor(0, 0, 0);

  let summaryY = summaryBoxY + 6;
  doc.text("Subtotal (Incl. tax)", summaryBoxX + 3, summaryY);
  doc.setFont(undefined, "bold");
  doc.text(
    `$${orderSubtotalIncludingTax.toFixed(2)}`,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
    { align: "right" },
  );
  summaryY += 6;

  doc.setFont(undefined, "normal");
  doc.text(`Shipping (${orderType})`, summaryBoxX + 3, summaryY);
  doc.text(
    `$${shippingCost.toFixed(2)}`,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
    { align: "right" },
  );
  summaryY += 6;

  doc.text(
    `Shipping Tax (${shippingTaxPercentage}%)`,
    summaryBoxX + 3,
    summaryY,
  );
  doc.text(
    `$${shippingTaxValue.toFixed(2)}`,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
    { align: "right" },
  );
  summaryY += 8;

  doc.setDrawColor(200, 200, 200);
  doc.line(
    summaryBoxX + 3,
    summaryY,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
  );
  summaryY += 6;

  doc.setFont(undefined, "bold");
  doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
  doc.text("Order Total", summaryBoxX + 3, summaryY);
  doc.text(
    `$${orderSubtotalIncludingTax.toFixed(2)}`,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
    { align: "right" },
  );
  summaryY += 6;

  doc.setFont(undefined, "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Total Tax", summaryBoxX + 3, summaryY);
  doc.text(
    `$${totalTaxPaid.toFixed(2)}`,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
    { align: "right" },
  );
  summaryY += 6;

  const paidAmountValue = orderTotal < 0 ? 0 : orderTotal;
  doc.text("Paid Amount", summaryBoxX + 3, summaryY);
  doc.text(
    `$${paidAmountValue.toFixed(2)}`,
    summaryBoxX + summaryBoxWidth - 3,
    summaryY,
    { align: "right" },
  );
  summaryY += 6;

  if (hasCreditInfo) {
    doc.text("Credit Left", summaryBoxX + 3, summaryY);
    doc.text(
      `$${creditLeft.toFixed(2)}`,
      summaryBoxX + summaryBoxWidth - 3,
      summaryY,
      { align: "right" },
    );
    summaryY += 6;
  }

  if (order?.customPayment?.value) {
    doc.text("Remaining Amount", summaryBoxX + 3, summaryY);
    doc.text(
      isUpdateReceipt && order?.paymentStatus === "Paid"
        ? "$0.00"
        : updated
          ? `$${orderSubtotalIncludingTax.toFixed(2)}`
          : `$${orderTotal.toFixed(2)}`,
      summaryBoxX + summaryBoxWidth - 3,
      summaryY,
      { align: "right" },
    );
    summaryY += 6;
  }

  const notesY = pageHeight - 40;
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Notes", 10, notesY);
  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  const contactEmail = order?.serviceEmail || "info@shopallteam.com";
  const notesText = `Thank you for the order. Any questions? reach out to ${contactEmail}`;
  doc.text(notesText, 10, notesY + 6, { maxWidth: pageWidth - 10 });

  const logoUrl = order?.logoImg;
  if (logoUrl) {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          const width = 50;
          const height = width * aspectRatio;
          resolve({ width, height, src });
        };
        img.onerror = reject;
        img.src = src;
      });
    try {
      const { width, height, src } = await loadImage(logoUrl);
      const bottomMargin = 2;
      const logoY = pageHeight - height - bottomMargin;
      doc.addImage(src, "PNG", pageWidth - width - 2, logoY, width, height);
    } catch (error) {
      console.error("Error loading logo:", error);
    }
  }

  await doc.save(`Receipts_${order?.shopName || "Report"}.pdf`);
};
