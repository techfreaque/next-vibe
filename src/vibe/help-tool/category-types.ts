/**
 * Category system types for the admin sidebar.
 *
 * Each module in src/<module>/category.ts exports a
 * CategoryDefinition that describes how that module appears in the admin UI.
 *
 * vibe gen scans for category.ts files and generates
 * src/generated/category-registry.ts
 */

import type { pathToAliasMap } from "@/generated/endpoints/alias-map-dev";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import type { ToolNavigationDefaults } from "../core/definition/endpoints-meta";
import type { CountryLanguage } from "../core/i18n/core/config";
import type { UserPermissionRole } from "../identity/roles/enum";
import type { IconKey } from "../unified-ui/widgets/form-fields/icon-field/icons";

/** Top-level grouping in the admin sidebar */
export type AdminGroup =
  | "ai"
  | "analytics"
  | "business"
  | "billing"
  | "people"
  | "content"
  | "system"
  | "comms"
  | "platform";

type CatalogAlias = keyof typeof pathToAliasMap;

export interface CategoryLanding<TAlias extends string = string> {
  /** Heading for the admin landing only. */
  heading?: Partial<Record<CountryLanguage, string>>;
  /** Plain-language descriptions for specifically declared admin shortcuts. */
  destinationDescriptions?: Partial<
    Record<TAlias, Partial<Record<CountryLanguage, string>>>
  >;
  /** Summary endpoint rendered using the shared category metrics presentation. */
  summary?: {
    alias: TAlias;
    scope: "company" | "platform";
    /** Static request values for the embedded read, such as a reporting section. */
    args?: Record<string, string>;
    home?: boolean;
    /** Request values used when this summary appears on the workspace home. */
    homeArgs?: Record<string, string>;
    progressive?: boolean;
  };
  /** Ordered list and report entry points. */
  destinations?: readonly TAlias[];
  /** A GET endpoint that can be shown without an entity identifier. */
  overview?: { alias: TAlias; scope: "company" | "platform" };
  /** Ordered create or contextual workflow actions. Read links become destinations. */
  actions?: readonly TAlias[];
  /** Select one declared action using the company overview response. */
  contextualActions?: boolean;
}

interface AdminPlacement {
  /** Slash-delimited endpoint paths, without child paths. */
  adminPaths?: readonly string[];
  /** Slash-delimited endpoint path prefixes, matched on complete segments. */
  adminPathPrefixes?: readonly string[];
}

/** A named sub-section within a category */
export interface SubcategoryDefinition extends AdminPlacement {
  icon: IconKey;
  /** Sort order within category (lower = first) */
  order: number;
  /** Display labels per locale */
  label: Partial<Record<CountryLanguage, string>>;
}

export interface RecordSearchDestination<
  TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny,
> {
  alias: keyof typeof pathToAliasMap;
  field: Extract<
    {
      [
        TKey in keyof TEndpoint["types"]["RequestInput"]
      ]: string extends TEndpoint["types"]["RequestInput"][TKey] ? TKey : never;
    }[keyof TEndpoint["types"]["RequestInput"]],
    string
  >;
}

/**
 * Category definition exported from a module's category.ts.
 * Must be a plain const (no dynamic imports) - the generator reads this at build time.
 */
export interface CategoryDefinition extends AdminPlacement {
  navigation?: ToolNavigationDefaults;
  description?: Partial<Record<CountryLanguage, string>>;
  createActions?: readonly CatalogAlias[];
  landing?: CategoryLanding<CatalogAlias>;
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
   * Preferred entry by role. On a category landing without explicit
   * destinations, the admin entry leads the list when it is a permitted
   * standalone GET tool. Use the endpoint's first alias.
   */
  defaultEntry: {
    [UserPermissionRole.ADMIN]: keyof typeof pathToAliasMap;
    [UserPermissionRole.CUSTOMER]: keyof typeof pathToAliasMap;
    [UserPermissionRole.PUBLIC]: keyof typeof pathToAliasMap;
  };

  /** Named sub-sections within this category */
  subcategories?: Record<string, SubcategoryDefinition>;
  /** Optional local admin lookup into an existing GET list's string filter. */
  recordSearch?: RecordSearchDestination;
  /**
   * Alias of a GET report rendered at the top of the admin catalog root (the
   * first thing an admin sees). The lowest-order category that declares one
   * and that the viewer may open wins.
   */
  catalogOverview?: keyof typeof pathToAliasMap;
}

/**
 * Serialized form of CategoryDefinition (no live endpoint references)
 * — safe to include in generated files.
 */
export interface CategoryDefinitionSerialized extends AdminPlacement {
  navigation?: ToolNavigationDefaults;
  descriptions?: Record<string, string>;
  createActions?: readonly string[];
  landing?: CategoryLanding;
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
  recordSearch?: { alias: string; field: string };
  /** Alias of the report shown at the catalog root (see CategoryDefinition). */
  catalogOverview?: string;
  subcategories?: Record<
    string,
    AdminPlacement & {
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
