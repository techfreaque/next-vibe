/** Stable 402 reasons survive HTTP and stored chat messages. Translate them in the view locale. */
export type CreditPolicyReason =
  | "errorTypes.purchased_model_required"
  | "errorTypes.shared_allowance_reached";

export function creditPolicyReason(
  key: string | undefined,
): CreditPolicyReason | undefined {
  return key === "errorTypes.purchased_model_required" ||
    key === "errorTypes.shared_allowance_reached"
    ? key
    : undefined;
}
