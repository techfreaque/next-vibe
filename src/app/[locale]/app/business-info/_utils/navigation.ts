/**
 * Business Info Navigation Utilities
 * Handles form flow and redirects between business-info sections
 */

/**
 * Business info form navigation order
 * Defines the sequence of forms for optimal user flow
 */
export const BUSINESS_INFO_FLOW = [
  "profile", // Personal information first
  "business", // Business details
  // "goals", // Business objectives
  "social", // Social media platforms
  // "brand", // Brand identity
  // "audience", // Target audience
  // "challenges", // Business challenges
  // "competitors", // Competitive analysis
] as const;

export type BusinessInfoSection = (typeof BUSINESS_INFO_FLOW)[number];

/**
 * Get the next form in the business info flow
 */
export function getNextBusinessInfoSection(
  currentSection: BusinessInfoSection,
): BusinessInfoSection | null {
  const currentIndex = BUSINESS_INFO_FLOW.indexOf(currentSection);

  if (currentIndex === -1 || currentIndex === BUSINESS_INFO_FLOW.length - 1) {
    return null; // Invalid section or last section
  }

  return BUSINESS_INFO_FLOW[currentIndex + 1];
}

/**
 * Get the previous form in the business info flow
 */
export function getPreviousBusinessInfoSection(
  currentSection: BusinessInfoSection,
): BusinessInfoSection | null {
  const currentIndex = BUSINESS_INFO_FLOW.indexOf(currentSection);

  if (currentIndex === -1 || currentIndex === 0) {
    return null; // Invalid section or first section
  }

  return BUSINESS_INFO_FLOW[currentIndex - 1];
}

/**
 * Get the URL path for a business info section
 */
export function getBusinessInfoSectionPath(
  section: BusinessInfoSection,
): `/app/business-info/${BusinessInfoSection}` {
  return `/app/business-info/${section}`;
}

/**
 * Get the next form URL for redirect after successful submission
 */
export function getNextFormUrl(
  currentSection: BusinessInfoSection,
): `/app/business-info/${BusinessInfoSection}` | "/app/business-info" | null {
  const nextSection = getNextBusinessInfoSection(currentSection);

  if (!nextSection) {
    // If no next section, redirect to overview
    return "/app/business-info";
  }

  return getBusinessInfoSectionPath(nextSection);
}

/**
 * Get completion progress for a section
 */
export function getSectionProgress(currentSection: BusinessInfoSection): {
  current: number;
  total: number;
  percentage: number;
} {
  const currentIndex = BUSINESS_INFO_FLOW.indexOf(currentSection);
  const current = currentIndex + 1;
  const total = BUSINESS_INFO_FLOW.length;
  const percentage = Math.round((current / total) * 100);

  return {
    current,
    total,
    percentage,
  };
}

/**
 * Check if a section is the last in the flow
 */
export function isLastSection(section: BusinessInfoSection): boolean {
  return section === BUSINESS_INFO_FLOW[BUSINESS_INFO_FLOW.length - 1];
}

/**
 * Check if a section is the first in the flow
 */
export function isFirstSection(section: BusinessInfoSection): boolean {
  return section === BUSINESS_INFO_FLOW[0];
}
