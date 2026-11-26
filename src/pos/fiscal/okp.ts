/**
 * eKasa OKP and QR helpers (pure).
 *
 * PKP (podpisový kód pokladnice): signature by the entrepreneur's private key
 * over pkpSigningInput(), Base64 encoded. Computed by the certified ORP.
 * OKP (overovací kód pokladnice): SHA-1 of the PKP signature bytes, printed as
 * 40 lowercase hex chars in 5 groups of 8 separated by "-".
 *
 * Formats per eKasa integration spec v2.7 (FS, 3.11.2022), as summarized in
 * scratchpad/erp/SLOVAK-COMPLIANCE.md section 6. TO VERIFY against the spec
 * text and any reissue for zákon 384/2025: SHA-1 over the decoded PKP bytes,
 * hex case, QR formats below.
 */

import { createHash } from "node:crypto";

export function okpFromPkp(pkpBase64: string): string {
  const hex = createHash("sha1")
    .update(Buffer.from(pkpBase64.trim(), "base64"))
    .digest("hex");
  return (hex.match(/.{8}/g) ?? []).join("-");
}

/** Online receipt: the QR code holds the eKasa receipt UID as returned. */
export function qrDataFromUid(uid: string): string {
  return uid.trim();
}

/** yyMMddHHmmss in Slovak local time. */
function compactDateTime(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bratislava",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((entry) => entry.type === type)?.value ?? "00";
  return `${part("year")}${part("month")}${part("day")}${part("hour")}${part("minute")}${part("second")}`;
}

/**
 * Offline receipt QR: OKP:kód pokladnice:yyMMddHHmmss:poradové číslo:suma
 * (TO VERIFY: separator, date pattern and amount format in the spec).
 */
export function qrDataFromOkp(input: {
  okp: string;
  cashRegisterCode: string;
  issuedAt: string;
  receiptNumber: number;
  total: number;
}): string {
  return [
    input.okp,
    input.cashRegisterCode,
    compactDateTime(input.issuedAt),
    String(input.receiptNumber),
    input.total.toFixed(2),
  ].join(":");
}
