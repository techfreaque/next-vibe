/**
 * Navigate Button Widget Type Definitions
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { SpacingSize, WidgetType } from "next-vibe/core/definition/enums";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";

/**
 * Endpoint reference: direct object or async resolver (for breaking circular deps)
 */
export type TargetEndpointOrResolver<
  T extends CreateApiEndpointAny | undefined,
> = T | (() => Promise<NonNullable<T>>);

/**
 * Navigate Button Widget Configuration
 */
export interface NavigateButtonWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
  TGetEndpoint extends CreateApiEndpointAny | undefined,
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.NAVIGATE_BUTTON;
  label?: NoInfer<TKey>;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  targetEndpoint?: TargetEndpointOrResolver<TTargetEndpoint>;
  extractParams?: TTargetEndpoint extends CreateApiEndpointAny
    ? (
        source: {
          // The parent item of an array (if any)
          itemData: WidgetData | undefined;
          requestData: WidgetData;
          urlPathParams: WidgetData;
          responseData: WidgetData;
        },
        context: {
          logger: EndpointLogger;
          user: JwtPayloadType;
          locale: CountryLanguage;
        },
      ) =>
        | {
            urlPathParams?: Partial<
              TTargetEndpoint["types"]["UrlVariablesOutput"]
            >;
            data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
          }
        | Promise<{
            urlPathParams?: Partial<
              TTargetEndpoint["types"]["UrlVariablesOutput"]
            >;
            data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
          }>
    : undefined;

  prefillFromGet?: boolean;
  getEndpoint?: TGetEndpoint;
  renderInModal?: boolean;
  popNavigationOnSuccess?: number;
  iconSize?: "xs" | "sm" | "base" | "lg";
  iconSpacing?: SpacingSize;
  loadingText?: NoInfer<TKey>;
}
