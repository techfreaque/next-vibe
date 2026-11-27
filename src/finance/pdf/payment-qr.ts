import { encode } from "uqr";

export interface PaymentQrInput {
  beneficiaryName: string;
  iban: string;
  bic?: string | null;
  amount: number;
  currency: string;
  reference?: string | null;
  remittanceText?: string | null;
  dueDate?: string | null; // YYYY-MM-DD
  variableSymbol?: string | null;
  beneficiaryAddressLine1?: string | null;
  beneficiaryAddressLine2?: string | null;
}

export type PaymentQrKind = "EPC" | "PAY_BY_SQUARE";

export interface PaymentQrResult {
  kind: PaymentQrKind;
  payload: string;
  svg: string;
}

function cleanIban(iban: string): string | null {
  const normalized = iban.replaceAll(/\s+/gu, "").toUpperCase();
  return /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/u.test(normalized) ? normalized : null;
}

function cleanBic(bic: string | null | undefined): string {
  if (!bic) {
    return "";
  }
  const normalized = bic.replaceAll(/\s+/gu, "").toUpperCase();
  return /^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/u.test(normalized)
    ? normalized
    : "";
}

function sanitizeLine(value: string, maxLength: number): string {
  return value
    .replaceAll(/[\r\n\t]+/gu, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * EPC069-12 v3.1 (SEPA Credit Transfer / GiroCode) QR payload.
 * Valid for EUR amounts between 0.01 and 999,999,999.99.
 */
export function buildEpcQrPayload(input: PaymentQrInput): string | null {
  const iban = cleanIban(input.iban);
  if (
    !iban ||
    input.currency.toUpperCase() !== "EUR" ||
    !Number.isFinite(input.amount) ||
    input.amount < 0.01 ||
    input.amount > 999_999_999.99
  ) {
    return null;
  }
  const name = sanitizeLine(input.beneficiaryName, 70);
  if (!name) {
    return null;
  }
  const bic = cleanBic(input.bic);
  const amountText = `EUR${input.amount.toFixed(2)}`;
  const structuredRef = sanitizeLine(input.reference ?? "", 35);
  const unstructured = structuredRef
    ? ""
    : sanitizeLine(input.remittanceText ?? "", 140);

  return [
    "BCD",
    "002",
    "1",
    "SCT",
    bic,
    name,
    iban,
    amountText,
    "",
    structuredRef,
    unstructured,
    "",
  ].join("\n");
}

// ---- PAY by square v1.2.0 (Slovak Banking Association) ----

const CRC32_TABLE = ((): Uint32Array => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb8_8320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffff_ffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffff_ffff) >>> 0;
}

/**
 * Pure TypeScript LZMA1 encoder (lc=3, lp=0, pb=2) emitting valid literal-coded
 * LZMA1 range-coded stream per PAY by square v1.2.0 specification (raw LZMA1
 * without 13-byte header, prefixed with the 4-byte PAY by square header).
 */
function encodeLzma1Raw(input: Uint8Array): Uint8Array {
  const LC = 3;
  const PB = 2;
  const POS_MASK = (1 << PB) - 1;
  const IS_MATCH = new Uint16Array(12 << PB);
  IS_MATCH.fill(1024);
  const LIT_PROBS = new Uint16Array(0x300 << LC);
  LIT_PROBS.fill(1024);

  let range = 0xffff_ffff;
  let low = BigInt(0);
  let cache = 0;
  let cacheSize = 1;
  const out: number[] = [];

  const shiftLow = (): void => {
    const lowHi = Number(low >> BigInt(32));
    if (lowHi !== 0 || low < BigInt(0xff00_0000)) {
      let temp = cache;
      do {
        out.push((temp + lowHi) & 0xff);
        temp = 0xff;
        cacheSize -= 1;
      } while (cacheSize > 0);
      cache = Number((low >> BigInt(24)) & BigInt(0xff));
    }
    cacheSize += 1;
    low = (low & BigInt(0x00ff_ffff)) << BigInt(8);
  };

  const encodeBit = (probs: Uint16Array, idx: number, bit: number): void => {
    const prob = probs[idx];
    const bound = (range >>> 11) * prob;
    if (bit === 0) {
      range = bound;
      probs[idx] = prob + ((2048 - prob) >>> 5);
    } else {
      low += BigInt(bound);
      range -= bound;
      probs[idx] = prob - (prob >>> 5);
    }
    if ((range & 0xff00_0000) === 0) {
      range = (range << 8) >>> 0;
      shiftLow();
    }
  };

  let state = 0;
  let prevByte = 0;
  for (let pos = 0; pos < input.length; pos++) {
    const posState = pos & POS_MASK;
    encodeBit(IS_MATCH, (state << PB) + posState, 0);
    const byte = input[pos];
    const litSub = (prevByte >>> (8 - LC)) * 0x300;
    let symbol = 1;
    for (let i = 7; i >= 0; i--) {
      const bit = (byte >>> i) & 1;
      encodeBit(LIT_PROBS, litSub + symbol, bit);
      symbol = (symbol << 1) | bit;
    }
    prevByte = byte;
    if (state < 4) {
      state = 0;
    } else if (state < 10) {
      state -= 3;
    } else {
      state -= 6;
    }
  }

  for (let i = 0; i < 5; i++) {
    shiftLow();
  }
  return new Uint8Array(out);
}

const BASE32HEX_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUV";

function encodeBase32Hex(bytes: Uint8Array): string {
  let result = "";
  let buffer = 0;
  let bitsLeft = 0;
  for (let i = 0; i < bytes.length; i++) {
    buffer = (buffer << 8) | bytes[i];
    bitsLeft += 8;
    while (bitsLeft >= 5) {
      bitsLeft -= 5;
      result += BASE32HEX_ALPHABET[(buffer >>> bitsLeft) & 31];
    }
  }
  if (bitsLeft > 0) {
    result += BASE32HEX_ALPHABET[(buffer << (5 - bitsLeft)) & 31];
  }
  return result;
}

/**
 * Builds a PAY by square v1.2.0 QR string (Slovak Banking Association).
 * Format: Base32Hex( 2-byte bySquare header [0x00, 0x00] + 2-byte LE uncompressed length + raw LZMA1(4-byte LE CRC32 + UTF-8 tab payload) ).
 */
export function buildPayBySquarePayload(input: PaymentQrInput): string | null {
  const iban = cleanIban(input.iban);
  if (!iban || !Number.isFinite(input.amount) || input.amount <= 0) {
    return null;
  }
  const dueDigits = input.dueDate
    ? input.dueDate.replaceAll("-", "").slice(0, 8)
    : "";
  const vs = (input.variableSymbol ?? input.reference ?? "")
    .replaceAll(/\D+/gu, "")
    .slice(0, 10);
  const bic = cleanBic(input.bic);
  const note = sanitizeLine(input.remittanceText ?? input.reference ?? "", 140);
  const beneficiary = sanitizeLine(input.beneficiaryName, 70);
  const addr1 = sanitizeLine(input.beneficiaryAddressLine1 ?? "", 70);
  const addr2 = sanitizeLine(input.beneficiaryAddressLine2 ?? "", 70);

  // SBA PAY by square v1.2.0 tabular document
  const fields = [
    "", // InvoiceID
    "1", // Payments count
    "1", // PaymentOptions (1 = paymentorder)
    input.amount.toFixed(2), // Amount
    input.currency.toUpperCase(), // CurrencyCode
    dueDigits, // PaymentDueDate YYYYMMDD
    vs, // VariableSymbol
    "", // ConstantSymbol
    "", // SpecificSymbol
    "", // OriginatorsReferenceInformation
    note, // PaymentNote
    "1", // BankAccounts count
    iban, // IBAN
    bic, // BIC
    "0", // StandingOrderExt
    "0", // DirectDebitExt
    beneficiary, // BeneficiaryName
    addr1, // BeneficiaryAddressLine1
    addr2, // BeneficiaryAddressLine2
  ];
  const bodyBytes = new TextEncoder().encode(fields.join("\t"));
  const checksum = crc32(bodyBytes);

  const payloadWithCrc = new Uint8Array(4 + bodyBytes.length);
  payloadWithCrc[0] = checksum & 0xff;
  payloadWithCrc[1] = (checksum >>> 8) & 0xff;
  payloadWithCrc[2] = (checksum >>> 16) & 0xff;
  payloadWithCrc[3] = (checksum >>> 24) & 0xff;
  payloadWithCrc.set(bodyBytes, 4);

  const compressed = encodeLzma1Raw(payloadWithCrc);
  const header = new Uint8Array(4);
  header[0] = 0x00; // bySquareType=0, version=0
  header[1] = 0x00; // documentType=0, reserved=0
  header[2] = payloadWithCrc.length & 0xff;
  header[3] = (payloadWithCrc.length >>> 8) & 0xff;

  const combined = new Uint8Array(header.length + compressed.length);
  combined.set(header, 0);
  combined.set(compressed, header.length);
  return encodeBase32Hex(combined);
}

export function getQrMatrix(payload: string): boolean[][] {
  return encode(payload, { ecc: "M" }).data;
}

export function renderQrSvg(payload: string, sizePx = 160): string {
  const matrix = getQrMatrix(payload);
  const count = matrix.length;
  const quiet = 2;
  const total = count + quiet * 2;
  const rects: string[] = [];
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (matrix[y][x]) {
        rects.push(
          `<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1"/>`,
        );
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${sizePx}" height="${sizePx}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="#ffffff"/><g fill="#000000">${rects.join("")}</g></svg>`;
}

/**
 * Selects the appropriate payment QR for the issuer country:
 * - SK -> PAY by square v1.2.0
 * - EUR issuers (DE, AT, etc.) -> EPC / GiroCode v3.1
 */
export function buildInvoicePaymentQr(
  countryCode: string | null | undefined,
  input: PaymentQrInput,
): PaymentQrResult | null {
  const country = countryCode?.trim().toUpperCase();
  if (country === "SK") {
    const payload = buildPayBySquarePayload(input);
    return payload
      ? { kind: "PAY_BY_SQUARE", payload, svg: renderQrSvg(payload) }
      : null;
  }
  const epc = buildEpcQrPayload(input);
  return epc ? { kind: "EPC", payload: epc, svg: renderQrSvg(epc) } : null;
}
