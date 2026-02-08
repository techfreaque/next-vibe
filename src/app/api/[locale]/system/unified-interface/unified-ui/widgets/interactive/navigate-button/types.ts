/**
 * Navigate Button Widget Type Definitions
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Navigate Button Widget Configuration
 */
export interface NavigateButtonWidgetConfig<
  TKey extends string,
  out TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
  out TTargetEndpoint extends CreateApiEndpointAny | undefined,
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
  metadata?: {
    targetEndpoint: TTargetEndpoint;
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
    getEndpoint?: CreateApiEndpointAny;
    renderInModal?: boolean;
    popNavigationOnSuccess?: number;
  };
  iconSize?: "xs" | "sm" | "base" | "lg";
  iconSpacing?: SpacingSize;
}
