/**
 * Slug generation utilities for friendly IDs
 * Used by favorites and skills to generate human-readable identifiers
 */

/**
 * Generate a URL-safe slug from a string
 * - Lowercases
 * - Replaces spaces and special chars with dashes
 * - Collapses multiple dashes
 * - Trims dashes from ends
 * - Max 80 chars
 */
export function generateSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      // Replace common special chars with dashes
      .replace(/[^a-z0-9-]/g, "-")
      // Collapse multiple dashes
      .replace(/-{2,}/g, "-")
      // Trim dashes from ends
      .replace(/^-+|-+$/g, "")
      // Limit length
      .slice(0, 80)
  );
}

/**
 * Ensure a slug is unique within a list of existing slugs
 * Appends -2, -3, etc. on collision
 */
export function ensureUniqueSlug(
  base: string,
  existingSlugs: string[],
): string {
  if (!existingSlugs.includes(base)) {
    return base;
  }

  let counter = 2;
  let candidate = `${base}-${counter}`;
  while (existingSlugs.includes(candidate)) {
    counter++;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}

/**
 * Check if a string looks like a UUID
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Generate a favorite slug from skill + variant info
 * Format: "{skillSlug}-{variantSlug}" or just "{customName}" slugified
 */
export function generateFavoriteSlug(params: {
  customVariantName?: string | null;
  skillSlug: string;
  variantId?: string | null;
}): string {
  if (params.customVariantName) {
    return generateSlug(params.customVariantName);
  }

  const base = params.skillSlug || "favorite";
  if (params.variantId) {
    const variantSlug = generateSlug(params.variantId);
    return variantSlug ? `${base}-${variantSlug}` : base;
  }
  return base;
}
