/**
 * Category system types for the admin sidebar.
 *
 * Each module in src/app/api/[locale]/<module>/category.ts exports a
 * CategoryDefinition that describes how that module appears in the admin UI.
 *
 * vibe gen scans for category.ts files and generates
 * src/generated/category-registry.ts
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";

import type { pathToAliasMap } from "@/generated/endpoints/alias-map";

/** Top-level grouping in the admin sidebar */
export type AdminGroup =
  | "ai"
  | "analytics"
  | "business"
  | "system"
  | "comms"
  | "platform";

/** A named sub-section within a category */
export interface SubcategoryDefinition {
  icon: IconKey;
  /** Sort order within category (lower = first) */
  order: number;
  /** Display labels per locale */
  label: Partial<Record<CountryLanguage, string>>;
}

/**
 * Category definition exported from a module's category.ts.
 * Must be a plain const (no dynamic imports) - the generator reads this at build time.
 */
export interface CategoryDefinition {
  /** Must match the `category` key used in the module's definition.ts files. */
  key: string;
  /** Display labels per locale */
  label: Partial<Record<CountryLanguage, string>>;
  /** Which super-group this belongs to in the sidebar */
  group: AdminGroup;
  /** Icon shown for the category in the sidebar */
  icon: IconKey;
  /** Sort order within the group (lower = first) */
  order: number;
  /**
   * Alias of the primary endpoint to open when a user clicks the category header.
   * If omitted, clicking expands the category to show all tools.
   * Use the endpoint's first alias string (from its constants.ts).
   */
  defaultEntry: {
    [UserPermissionRole.ADMIN]: keyof typeof pathToAliasMap;
    [UserPermissionRole.CUSTOMER]: keyof typeof pathToAliasMap;
    [UserPermissionRole.PUBLIC]: keyof typeof pathToAliasMap;
  };

  /** Named sub-sections within this category */
  subcategories?: Record<string, SubcategoryDefinition>;
}

/**
 * Serialized form of CategoryDefinition (no live endpoint references)
 * — safe to include in generated files.
 */
export interface CategoryDefinitionSerialized {
  key: string;
  /** Default label (en-GLOBAL fallback) */
  label: string;
  /** Labels for all locales */
  labels: Record<string, string>;
  group: AdminGroup;
  icon: IconKey;
  order: number;
  /** alias or path-joined string of the defaultEntry endpoint */
  defaultEntryAlias?: string;
  /** URL path to navigate to instead of opening an endpoint */
  defaultEntryLink?: string;
  subcategories?: Record<
    string,
    {
      icon: IconKey;
      order: number;
      /** Default label (en-GLOBAL fallback) */
      label: string;
      /** Labels for all locales */
      labels: Record<string, string>;
      /** alias or path-joined string of the subcategory defaultEntry */
      defaultEntryAlias?: string;
      /** URL path to navigate to instead of opening an endpoint */
      defaultEntryLink?: string;
    }
  >;
}
