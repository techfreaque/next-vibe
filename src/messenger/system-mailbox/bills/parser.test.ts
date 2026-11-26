import { expect, test } from "bun:test";

import {
  decryptEvidence,
  encryptEvidence,
  readSupplierMail,
} from "./attachments";
import { extractSupplierDocument } from "./parser";

const supplierReceipt = [
  "Invoice number: OR-DEMO-42",
  "Receipt number: RC-DEMO-42",
  "Date issued: November 25, 2026",
  "Invoice total: USD 1,240.72",
  "Total tax: USD 40.72",
].join("\n");

test("extracts the issuer invoice number, date and exact tax in native currency", () => {
  expect(extractSupplierDocument([supplierReceipt])).toEqual({
    document: {
      reference: "OR-DEMO-42",
      date: "2026-11-25",
      currency: "USD",
      grossAmount: "1240.7200",
      taxAmount: "40.7200",
    },
    issue: null,
  });
});

test("requires explicit tax and refuses ambiguous currency, dates and conflicting attachments", () => {
  expect(
    extractSupplierDocument([
      supplierReceipt.replace("Total tax: USD 40.72", ""),
    ]).issue,
  ).toBe("missingFields");
  expect(
    extractSupplierDocument([supplierReceipt.replaceAll("USD ", "$")]).issue,
  ).toBe("missingFields");
  expect(
    extractSupplierDocument([
      supplierReceipt.replace("November 25, 2026", "February 29, 2026"),
    ]).issue,
  ).toBe("missingFields");
  expect(
    extractSupplierDocument([
      supplierReceipt,
      supplierReceipt.replace("OR-DEMO-42", "OR-DEMO-43"),
    ]).issue,
  ).toBe("conflictingDocuments");
});

test("recognizes a synthetic HTML attachment without loading its remote content", async () => {
  const html = [
    "<script>document.location = 'https://example.com/not-loaded'</script>",
    "<table>",
    ...supplierReceipt.split("\n").map((line) => `<tr><td>${line}</td></tr>`),
    "</table>",
  ].join("");
  const body = [
    "From: Receipts <receipts@example.com>",
    "To: accounts@example.com",
    "Subject: Synthetic receipt",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=synthetic",
    "",
    "--synthetic",
    "Content-Type: text/html; charset=utf-8",
    "Content-Disposition: attachment; filename=receipt.html",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html).toString("base64"),
    "--synthetic--",
  ].join("\r\n");
  const mail = await readSupplierMail(Buffer.from(body));
  expect(mail.sender).toBe("receipts@example.com");
  expect(mail.recipients).toEqual(["accounts@example.com"]);
  expect(mail.texts.join("")).not.toContain("not-loaded");
  expect(extractSupplierDocument(mail.texts).document?.reference).toBe(
    "OR-DEMO-42",
  );
  const sealed = encryptEvidence(
    mail.evidence,
    "namespace.validity.uid.company",
  );
  expect(sealed).not.toContain(mail.evidence[0]?.data ?? html);
  expect(decryptEvidence(sealed, "wrong.company")).toBeUndefined();
  expect(decryptEvidence(sealed, "namespace.validity.uid.company")).toEqual(
    mail.evidence,
  );
});

function syntheticPdf(lines: readonly string[]): Buffer {
  const body = [
    "BT /F1 12 Tf 50 750 Td 18 TL",
    ...lines.map((line) => `(${line}) Tj T*`),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(body)} >>\nstream\n${body}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((value, index) => {
    const offset = Buffer.byteLength(pdf);
    pdf += `${index + 1} 0 obj\n${value}\nendobj\n`;
    return offset;
  });
  const start = Buffer.byteLength(pdf);
  pdf += [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(start),
    "%%EOF",
    "",
  ].join("\n");
  return Buffer.from(pdf);
}

test("reads native amounts from a bounded synthetic PDF attachment", async () => {
  const pdf = syntheticPdf(supplierReceipt.split("\n"));
  const message = [
    "From: Receipts <receipts@example.com>",
    "To: accounts@example.com",
    "Subject: Synthetic PDF receipt",
    "MIME-Version: 1.0",
    "Content-Type: application/pdf",
    "Content-Disposition: attachment; filename=sample.pdf",
    "Content-Transfer-Encoding: base64",
    "",
    pdf.toString("base64"),
  ].join("\r\n");
  const mail = await readSupplierMail(Buffer.from(message));
  expect(mail.incomplete).toBe(false);
  expect(mail.evidence[0]?.kind).toBe("pdf");
  expect(extractSupplierDocument(mail.texts).document?.grossAmount).toBe(
    "1240.7200",
  );
});

const openRouterLayout = [
  "Receipt from supplier Receipt # SYN-884",
  "Amount paid",
  "$12.30",
  "Date paid",
  "Oct 17, 2026, 2:31:35 PM",
  "Payment method",
  "Synthetic card",
  "Usage credits: $12.30",
  "Subtotal: $12.30",
  "Amount paid: $12.30",
].join("\n");

test("recognizes the redacted provider layout without inventing tax or currency", () => {
  expect(
    extractSupplierDocument([openRouterLayout], undefined, "openRouter"),
  ).toEqual({
    issue: "missingFields",
    document: null,
  });
  const result = extractSupplierDocument(
    [openRouterLayout],
    "USD",
    "openRouter",
  );
  expect(result).toEqual({
    issue: "missingFields",
    document: null,
    taxUndisclosed: true,
    receipt: {
      reference: "SYN-884",
      date: "2026-10-17",
      currency: "USD",
      grossAmount: "12.3000",
    },
  });
});

test("keeps malformed or conflicting tax disclosures out of gross-only drafting", () => {
  expect(
    extractSupplierDocument(
      [`${openRouterLayout}\nTax: illegible`],
      "USD",
      "openRouter",
    ),
  ).toMatchObject({ document: null, issue: "missingFields" });
  expect(
    extractSupplierDocument(
      [`${openRouterLayout}\nTax: illegible`],
      "USD",
      "openRouter",
    ),
  ).not.toHaveProperty("taxUndisclosed");
  expect(
    extractSupplierDocument(
      [`${openRouterLayout}\nTax: $0.00\nTax: $1.00`],
      "USD",
      "openRouter",
    ),
  ).toEqual({ document: null, issue: "conflictingDocuments" });
});

test("uses explicit tax and checks the gross against the displayed subtotal", () => {
  const domestic = openRouterLayout
    .replace("Oct 17, 2026, 2:31:35 PM", "October 17, 2026 at 2:31:35 PM UTC")
    .replace("Subtotal: $12.30", "Subtotal: $10.00\nTax: $2.30");
  expect(
    extractSupplierDocument([domestic], "USD", "openRouter").document
      ?.taxAmount,
  ).toBe("2.3000");
  expect(
    extractSupplierDocument(
      [domestic.replace("Tax: $2.30", "Tax: $2.00")],
      "USD",
      "openRouter",
    ).document,
  ).toBeNull();
});

test("keeps contradictory and credit documents out of automatic drafting", () => {
  const incompleteOtherInvoice = supplierReceipt
    .replace("OR-DEMO-42", "OR-DEMO-43")
    .replace("Total tax: USD 40.72", "");
  expect(
    extractSupplierDocument([supplierReceipt, incompleteOtherInvoice]).issue,
  ).toBe("conflictingDocuments");
  expect(
    extractSupplierDocument([`${supplierReceipt}\nTotal tax: USD 45.00`]).issue,
  ).toBe("conflictingDocuments");
  expect(
    extractSupplierDocument([`Credit note\n${supplierReceipt}`]).document,
  ).toBeNull();
  expect(
    extractSupplierDocument([`${supplierReceipt}\nSubtotal: USD 1,000.00`])
      .document,
  ).toBeNull();
});

test("uses the original provider layout and drops private inline forwarding notes", async () => {
  const mail = await readSupplierMail(
    Buffer.from(
      [
        "From: forwarder@example.test",
        "To: bills@example.test",
        "Subject: Fwd: Your OpenRouter receipt",
        "Content-Type: text/plain; charset=utf-8",
        "",
        "Private forwarder note.",
        "---------- Forwarded message ---------",
        "From: OpenRouter <receipts@openrouter.ai>",
        "Subject: Your OpenRouter receipt",
        "To: recipient@example.test",
        "",
        openRouterLayout.replace(
          "Subtotal: $12.30",
          "Subtotal: $10.00\nTax: $2.30",
        ),
      ].join("\r\n"),
    ),
  );
  expect(mail.forwarded).toEqual({
    sender: "receipts@openrouter.ai",
    subject: "Your OpenRouter receipt",
  });
  expect(mail.texts.join(" ")).not.toContain("Private forwarder note.");
  expect(
    Buffer.from(mail.evidence[0]?.data ?? "", "base64").toString(),
  ).not.toContain("recipient@example.test");
  expect(
    extractSupplierDocument(mail.texts, "USD", "openRouter").document,
  ).toBeDefined();
});

test("recognizes the original sender and subject in a forwarded RFC822 attachment", async () => {
  const original = [
    "From: billing@supplier.example.test",
    "To: recipient@example.test",
    "Subject: Supplier invoice",
    "Content-Type: text/plain; charset=utf-8",
    "",
    supplierReceipt,
  ].join("\r\n");
  const mail = await readSupplierMail(
    Buffer.from(
      [
        "From: forwarder@example.test",
        "To: bills@example.test",
        "Subject: Forwarded invoice",
        "MIME-Version: 1.0",
        'Content-Type: multipart/mixed; boundary="bill-forward"',
        "",
        "--bill-forward",
        "Content-Type: text/plain",
        "",
        "Private message.",
        "--bill-forward",
        "Content-Type: message/rfc822",
        "Content-Disposition: attachment",
        "",
        original,
        "--bill-forward--",
      ].join("\r\n"),
    ),
  );
  expect(mail.forwarded).toEqual({
    sender: "billing@supplier.example.test",
    subject: "Supplier invoice",
  });
  expect(mail.texts.join(" ")).not.toContain("Private message.");
  expect(extractSupplierDocument(mail.texts).document?.reference).toBe(
    "OR-DEMO-42",
  );
});
