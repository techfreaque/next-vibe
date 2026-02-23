/**
 * Email Template Registry Types
 */

import type { ReactElement } from "react";
import type { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

import type { TrackingContext } from "../smtp-client/components/tracking_context.email";

/**
 * Preview field types
 */
export type PreviewFieldType =
  | "text"
  | "email"
  | "url"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "date";

/**
 * Select option with translation key
 */
export interface PreviewSelectOption {
  value: string;
  label: string; // Translation key
}

/**
 * Preview field configuration
 */
export interface PreviewFieldConfig<TKey extends string> {
  type: PreviewFieldType;
  label: TKey; // Translation key
  description?: TKey; // Translation key
  defaultValue?: string | number | boolean;
  required?: boolean;
  options?: PreviewSelectOption[]; // For select fields
  min?: number; // For number fields
  max?: number; // For number fields
  rows?: number; // For textarea fields
}

/**
 * Template metadata cache (serializable, in generated registry)
 */
export interface TemplateCachedMetadata<TKey extends string> {
  id: string;
  version: string; // Semver (e.g., "1.2.3")
  name: TKey; // Translation key
  description: TKey; // Translation key
  category: TKey;
  path: string; // File path for reference
  exampleProps: Record<string, string | number | boolean>; // Example props for preview (serializable, required)
}

/**
 * Full template metadata (includes functions, from loaded template)
 */
export interface TemplateMetadata<TKey extends string> {
  id: string;
  version: string;
  name: TKey;
  description: TKey;
  category: TKey;
  path: string;
  defaultSubject: TKey;
  changelog?: TKey;
  previewFields?: Record<string, PreviewFieldConfig<TKey>>;
}

/**
 * Full template definition (lazy-loaded)
 * TProps: the props type for the email component
 * TScopedTranslation: the createScopedTranslation result for this template's module
 */
export interface EmailTemplateDefinition<
  TProps = never,
  // TScopedTranslation must have scopedT that returns an object with t.
  // We use { t: (...args: never[]) => string } to avoid contravariance issues
  // with specific key unions — the actual type flows through ReturnType inference.
  TScopedTranslation extends {
    scopedT: (locale: CountryLanguage) => { t: (...args: never[]) => string };
  } = {
    scopedT: (locale: CountryLanguage) => {
      t: (key: string, params?: Record<string, string | number>) => string;
    };
  },
> {
  scopedTranslation: TScopedTranslation;
  meta: TemplateMetadata<
    Parameters<ReturnType<TScopedTranslation["scopedT"]>["t"]>[0]
  >;
  schema: z.ZodType<TProps>;
  component: (params: {
    props: TProps;
    t: ReturnType<TScopedTranslation["scopedT"]>["t"];
    locale: CountryLanguage;
    recipientEmail: string;
    tracking: TrackingContext;
  }) => ReactElement;
  exampleProps: TProps;
}

/**
 * Template default export structure
 */
export interface TemplateExport<TProps = never> {
  default: EmailTemplateDefinition<TProps>;
}
