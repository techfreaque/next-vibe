/**
 * Email Template Registry Types
 */

import type { ReactElement } from "react";
import type { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";
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
export interface PreviewFieldConfig {
  type: PreviewFieldType;
  label: string; // Translation key
  description?: string; // Translation key
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
export interface TemplateCachedMetadata {
  id: string;
  version: string; // Semver (e.g., "1.2.3")
  name: TranslationKey; // Translation key
  description: TranslationKey; // Translation key
  category: string;
  path: string; // File path for reference
  exampleProps: Record<string, string | number | boolean>; // Example props for preview (serializable, required)
}

/**
 * Full template metadata (includes functions, from loaded template)
 */
export interface TemplateMetadata {
  id: string;
  version: string;
  name: TranslationKey;
  description: TranslationKey;
  category: string;
  path: string;
  defaultSubject: string | ((t: TFunction) => string);
  changelog?: string; // Translation key
  previewFields?: Record<string, PreviewFieldConfig>;
}

/**
 * Full template definition (lazy-loaded)
 */
export interface EmailTemplateDefinition<TProps = never> {
  meta: TemplateMetadata;
  schema: z.ZodType<TProps>;
  component: (params: {
    props: TProps;
    t: TFunction;
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
