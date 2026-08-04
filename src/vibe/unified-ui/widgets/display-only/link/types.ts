/**
 * Link Widget Types
 * Renders clickable hyperlinks with external link indicators
 */

import type { z } from "zod";

import type { WidgetType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";
import type { SpacingSize } from "../title/types";

/**
 * Link object schema - for links with custom text and behavior
 */
export type LinkObjectSchema =
  | z.ZodObject<{
      url: z.ZodString;
      text: z.ZodOptional<z.ZodString>;
      openInNewTab: z.ZodOptional<z.ZodBoolean>;
    }>
  | z.ZodOptional<
      z.ZodObject<{
        url: z.ZodString;
        text: z.ZodOptional<z.ZodString>;
        openInNewTab: z.ZodOptional<z.ZodBoolean>;
      }>
    >
  | z.ZodNullable<
      z.ZodObject<{
        url: z.ZodString;
        text: z.ZodOptional<z.ZodString>;
        openInNewTab: z.ZodOptional<z.ZodBoolean>;
      }>
    >;

/**
 * Link schema constraint - accepts:
 * - string (simple URL)
 * - object with { url, text?, openInNewTab? } (rich link data)
 */
export type LinkWidgetSchema = StringWidgetSchema | LinkObjectSchema;

/**
 * Link Widget Configuration
 *
 * Display modes:
 * - Simple URL from value (string)
 * - Rich link from value (object with url, text, openInNewTab)
 * - Static link from href config property
 *
 * Features:
 * - External link detection with visual indicator
 * - Configurable target (_blank for new tab)
 * - Security: noopener noreferrer for external links
 * - Keyboard accessible with focus ring
 * - Truncated text for long URLs
 */
export interface LinkWidgetConfig<
  out TKey extends string,
  TSchema extends LinkWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.LINK;

  /**
   * Static URL path or route - used when no dynamic value.
   *
   * Deliberately plain `string` rather than next's typed-routes `Route`. Route
   * is a string subtype, so `Route | string` already collapsed to `string` and
   * the brand bought nothing — while the import made this the only module in
   * unified-ui that reached for `next`. The widget layer stays framework-free.
   */
  href?: string;

  /** Static link text translation key */
  text?: NoInfer<TKey>;

  /** Accessible label (aria-label) - use if text is not descriptive */
  label?: NoInfer<TKey>;

  /** Opens in new tab if true */
  external?: boolean;

  /** Text alignment */
  textAlign?: "left" | "center" | "right";

  /** Text size */
  size?: "xs" | "sm" | "base" | "lg";

  /** Gap between text and icon */
  gap?: SpacingSize;

  /** External link icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";

  /** Schema constraint for the field value */
  schema: TSchema;
}
