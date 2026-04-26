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

// ============================================================
// LEGACY SKILL ID ALIASES
// Maps old stored IDs (camelCase, apostrophes) → canonical slugs.
// The DB keeps whatever it stored — reads normalize transparently.
// Add entries here whenever a skill/variant ID is renamed.
// ============================================================

export const SKILL_ID_ALIASES: Record<string, string> = {
  // Skill IDs
  freeSpeechActivist: "free-speech-activist",
  "devil'sAdvocate": "devils-advocate",
  socraticQuestioner: "socratic-questioner",
  unbiasedHistorian: "unbiased-historian",
  // Variant IDs
  cheapSmart: "cheap-smart",
};

/**
 * Resolve a stored skill or variant ID to its canonical slug form.
 * Handles legacy camelCase / apostrophe IDs transparently.
 */
export function resolveIdAlias(id: string): string {
  return SKILL_ID_ALIASES[id] ?? id;
}

// ============================================================
// SKILL ID MERGED FORMAT: "skillSlug__variantId"
// Double-underscore separator — URL-safe, can't appear in a slug
// ============================================================

export const SKILL_VARIANT_SEPARATOR = "__";

/**
 * Check if a string is a merged skill+variant ID ("skillSlug__variantId").
 * Returns true if the double-underscore separator is present.
 */
export function isSkillVariantId(value: string): boolean {
  return value.includes(SKILL_VARIANT_SEPARATOR);
}

/**
 * Split a merged skill ID ("skillSlug__variantId") into its parts.
 * Resolves legacy aliases on both skillId and variantId.
 * If no separator is present, variantId is null (use default variant).
 *
 * Examples:
 *   "thea"                    → { skillId: "thea", variantId: null }
 *   "thea__brilliant"         → { skillId: "thea", variantId: "brilliant" }
 *   "freeSpeechActivist"      → { skillId: "free-speech-activist", variantId: null }
 *   "thea__cheapSmart"        → { skillId: "thea", variantId: "cheap-smart" }
 */
export function parseSkillId(raw: string): {
  skillId: string;
  variantId: string | null;
} {
  const idx = raw.indexOf(SKILL_VARIANT_SEPARATOR);
  if (idx === -1) {
    return { skillId: resolveIdAlias(raw), variantId: null };
  }
  const rawSkillId = raw.slice(0, idx);
  const rawVariantId = raw.slice(idx + SKILL_VARIANT_SEPARATOR.length) || null;
  return {
    skillId: resolveIdAlias(rawSkillId),
    variantId: rawVariantId ? resolveIdAlias(rawVariantId) : null,
  };
}

/**
 * Compose a merged skill ID from skill and variant parts.
 * Returns just skillId if no variantId.
 *
 * Examples:
 *   ("thea", null)        → "thea"
 *   ("thea", "brilliant") → "thea__brilliant"
 */
export function formatSkillId(
  skillId: string,
  variantId?: string | null,
): string {
  if (!variantId) {
    return skillId;
  }
  return `${skillId}${SKILL_VARIANT_SEPARATOR}${variantId}`;
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
