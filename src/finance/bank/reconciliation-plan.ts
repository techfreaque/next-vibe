import type { bankAccountReconciliationSettings } from "./db";

export interface BankDocumentBasis {
  currency: string;
  amount: string;
}

export type BankMatchPlan =
  | { kind: "exact"; fee: bigint; fx: bigint }
  | { kind: "fee" | "fx"; fee: bigint; fx: bigint };

export function bankUnits(value: string): bigint | null {
  const [, sign, whole, fraction = ""] =
    /^(-?)(\d{1,10})(?:\.(\d{1,4}))?$/u.exec(value) ?? [];
  if (!whole) {
    return null;
  }
  const result =
    BigInt(whole) * BigInt(10_000) + BigInt(fraction.padEnd(4, "0"));
  return sign === "-" ? -result : result;
}

function magnitude(value: bigint): bigint {
  return value < BigInt(0) ? -value : value;
}

export function planBankMatch(input: {
  booked: string;
  carrying: string;
  currency: string;
  bookedDate: string;
  carryingDate: Date;
  nativeAmount?: string | null;
  nativeCurrency?: string | null;
  feeAmount?: string | null;
  feeCurrency?: string | null;
  document?: BankDocumentBasis;
  settings?: Pick<
    typeof bankAccountReconciliationSettings.$inferSelect,
    | "bookedCurrency"
    | "foreignCurrency"
    | "maxFxDifference"
    | "maxFxBps"
    | "maxDateDistanceDays"
    | "gainAccountId"
    | "lossAccountId"
    | "feeAccountId"
  >;
}): BankMatchPlan | null {
  const actual = bankUnits(input.booked);
  const carrying = bankUnits(input.carrying);
  const zero = BigInt(0);
  if (!actual || !carrying || actual > zero !== carrying > zero) {
    return null;
  }
  const difference = actual - carrying;
  if (difference === zero) {
    return { kind: "exact", fee: zero, fx: zero };
  }
  const { settings, document: paymentBasis } = input;
  if (
    !settings ||
    input.currency !== settings.bookedCurrency ||
    !paymentBasis
  ) {
    return null;
  }
  const postedDate = new Date(input.carryingDate);
  postedDate.setUTCHours(0, 0, 0, 0);
  const distance =
    Math.abs(new Date(input.bookedDate).getTime() - postedDate.getTime()) /
    86_400_000;
  if (!Number.isFinite(distance) || distance > settings.maxDateDistanceDays) {
    return null;
  }

  const fee = input.feeAmount ? bankUnits(input.feeAmount) : zero;
  if (
    fee === null ||
    fee > zero ||
    (fee < zero &&
      (!settings.feeAccountId || input.feeCurrency !== input.currency))
  ) {
    return null;
  }
  if (paymentBasis.currency === input.currency) {
    return fee < zero && difference === fee
      ? { kind: "fee", fee, fx: zero }
      : null;
  }
  if (paymentBasis.currency !== settings.foreignCurrency) {
    return null;
  }
  if (input.nativeAmount || input.nativeCurrency) {
    const native = bankUnits(input.nativeAmount ?? "");
    const documentAmount = bankUnits(paymentBasis.amount);
    if (
      !native ||
      !documentAmount ||
      input.nativeCurrency !== paymentBasis.currency ||
      magnitude(native) !== magnitude(documentAmount) ||
      native > zero !== actual > zero
    ) {
      return null;
    }
  }
  const fx = difference - fee;
  if (fx === zero) {
    return fee < zero ? { kind: "fee", fee, fx } : null;
  }
  const allowed = bankUnits(settings.maxFxDifference ?? "");
  if (
    !allowed ||
    !settings.maxFxBps ||
    magnitude(fx) > allowed ||
    magnitude(fx) * BigInt(10_000) >
      magnitude(carrying) * BigInt(settings.maxFxBps) ||
    (fx > zero ? !settings.gainAccountId : !settings.lossAccountId)
  ) {
    return null;
  }
  return { kind: "fx", fee, fx };
}
