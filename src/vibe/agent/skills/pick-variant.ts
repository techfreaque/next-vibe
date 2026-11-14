/**
 * Pick the variant a favorite/selection points at: explicit id → default
 * variant → first variant. A stale id (variant renamed or removed after the
 * favorite was saved) falls back to the default variant, exactly like the
 * runtime resolver, so pickers never show "No model" for a variant the stream
 * would still serve.
 */
export function pickSkillVariant<
  TVariant extends { id: string; isDefault?: boolean | null },
>(
  variants: readonly TVariant[] | null | undefined,
  variantId: string | null | undefined,
): TVariant | null {
  if (!variants || variants.length === 0) {
    return null;
  }
  return (
    (variantId ? variants.find((v) => v.id === variantId) : undefined) ??
    variants.find((v) => v.isDefault) ??
    variants[0] ??
    null
  );
}
