/**
 * Ink Widget Renderer
 *
 * Routes to appropriate Ink widget components based on widget type.
 * Mirrors React WidgetRenderer architecture for consistency.
 * All widgets directly imported for CLI (no lazy loading).
 */

import React, { type JSX } from "react";
import type { Path } from "react-hook-form";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { InkWidgetRendererProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { CodeOutputWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/code-output/cli";
import { ContainerWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/container/cli";
import { PaginationWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/cli";
import { AlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/cli";
import AvatarWidgetInk from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/avatar/cli";
import { BadgeWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/cli";
import { ChartWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/chart/cli";
import { CodeQualityFilesWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-files/cli";
import { CodeQualityListWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-list/cli";
import { CodeQualitySummaryWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/code-quality-summary/cli";
import { DescriptionWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/description/cli";
import { EmptyStateWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/empty-state/cli";
import { IconWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/cli";
import { KeyValueWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/key-value/cli";
import { LinkWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/cli";
import { LoadingWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/loading/cli";
import { MarkdownWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/cli";
import { MetadataWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/metadata/cli";
import { SeparatorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/cli";
import { StatWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/stat/cli";
import { StatusIndicatorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/status-indicator/cli";
import { TextWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/cli";
import { TitleWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/title/cli";
import { BooleanFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/cli";
import { ColorFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/color-field/cli";
import { CountrySelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/country-select-field/cli";
import { CurrencySelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/currency-select-field/cli";
import { DateFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-field/cli";
import { DateRangeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-range-field/cli";
import { DateTimeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/datetime-field/cli";
import { EmailFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/cli";
import { FileFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/file-field/cli";
import { FilterPillsFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/filter-pills-field/cli";
import { IconFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/cli";
import { IntFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/int-field/cli";
import { JsonFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/json-field/cli";
import { LanguageSelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/language-select-field/cli";
import { MarkdownEditorWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/markdown-editor/cli";
import { MultiSelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/cli";
import { NumberFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/cli";
import { PasswordFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/cli";
import { PhoneFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/phone-field/cli";
import { RangeSliderFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/range-slider-field/cli";
import { SelectFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/cli";
import { SliderFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/slider-field/cli";
import { TagsFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/tags-field/cli";
import { TextArrayFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-array-field/cli";
import { TextFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/cli";
import { TextareaFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/cli";
import { TimeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/time-field/cli";
import { TimeRangeFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/time-range-field/cli";
import { TimezoneFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/timezone-field/cli";
import { UrlFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/cli";
import { UuidFieldWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/uuid-field/cli";
import { ButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/button/cli";
import { FormAlertWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/cli";
import { NavigateButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/cli";
import { SubmitButtonWidgetInk } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/cli";

// Dispatch-boundary cast type: switch discriminant guarantees type safety.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInkWidget = React.ComponentType<any>;

type DispatchableField = DispatchField<
  string,
  z.ZodTypeAny,
  FieldUsageConfig,
  AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
>;

/**
 * Ink Widget Renderer Component - Routes to widgets with full type inference.
 * Receives DispatchField (UnifiedField + value) and switches on field.type.
 */
export function InkWidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
}: InkWidgetRendererProps): JSX.Element {
  return renderWidget({
    fieldName: fieldName as Path<TEndpoint["types"]["RequestOutput"]>,
    field,
  });
}

/**
 * Render helper - switches on field.type for discriminated union narrowing.
 * Each case casts the widget function to AnyInkWidget (dispatch boundary pattern,
 * matching React WidgetRenderer) — switch discriminant guarantees type safety.
 */
function renderWidget<TEndpoint extends CreateApiEndpointAny>(props: {
  fieldName: Path<TEndpoint["types"]["RequestOutput"]>;
  field: DispatchableField;
}): JSX.Element {
  const { fieldName, field } = props;

  // PaginationWidgetConfig has type: WidgetType.PAGINATION but is not yet in the
  // DispatchField union — handle it before the exhaustive switch to avoid a
  // "not comparable" error while still rendering the widget correctly at runtime.
  if ((field.type as WidgetType) === WidgetType.PAGINATION) {
    const W = PaginationWidgetInk as AnyInkWidget;
    return <W fieldName={fieldName} field={field} />;
  }

  switch (field.type) {
    // === CONTAINER WIDGETS ===
    case WidgetType.CONTAINER: {
      const W = ContainerWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.CUSTOM_WIDGET: {
      // If a widget.cli.ts override exists, the Bun plugin in vibe-runtime.ts
      // will have resolved `import ... from "./widget"` to the CLI version.
      // CLI widgets mark themselves with a static `.cliWidget = true` property
      // so we can distinguish them from web React components (which would crash in Ink).
      //
      // Use lazyCliWidget() in definition.ts to wrap React.lazy() — it stamps
      // .cliWidget = true on the lazy wrapper synchronously so we can check it here
      // without unwrapping the async promise.
      const customField = field as typeof field & {
        render?: React.ComponentType<{
          fieldName: string;
          field: typeof field;
        }> & { cliWidget?: boolean };
        children?: Record<string, { usage?: { request?: string | boolean } }>;
      };
      const isCliWidget = customField.render?.cliWidget === true;
      if (isCliWidget) {
        const CustomRender = customField.render!;
        // Full-takeover CLI widgets manage their own form state internally —
        // never render request field children alongside them.
        return <CustomRender fieldName={fieldName} field={field} />;
      }
      // No CLI override — fall back to ContainerWidgetInk which renders children.
      const W = ContainerWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.SEPARATOR: {
      const W = SeparatorWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.CODE_OUTPUT: {
      const W = CodeOutputWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.CODE_QUALITY_LIST: {
      const W = CodeQualityListWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.CODE_QUALITY_SUMMARY: {
      const W = CodeQualitySummaryWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.CODE_QUALITY_FILES: {
      const W = CodeQualityFilesWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.KEY_VALUE: {
      const W = KeyValueWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    // === DISPLAY-ONLY WIDGETS ===
    case WidgetType.TEXT: {
      const W = TextWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.TITLE: {
      const W = TitleWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.DESCRIPTION: {
      const W = DescriptionWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.METADATA: {
      const W = MetadataWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.BADGE: {
      const W = BadgeWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.ICON: {
      const W = IconWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.MARKDOWN: {
      const W = MarkdownWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.LINK: {
      const W = LinkWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.STAT: {
      const W = StatWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.CHART: {
      const W = ChartWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.STATUS_INDICATOR: {
      const W = StatusIndicatorWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.ALERT: {
      const W = AlertWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.BUTTON: {
      const W = ButtonWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.NAVIGATE_BUTTON: {
      const W = NavigateButtonWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.SUBMIT_BUTTON: {
      const W = SubmitButtonWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.FORM_ALERT: {
      const W = FormAlertWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.MARKDOWN_EDITOR: {
      const W = MarkdownEditorWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.LOADING: {
      const W = LoadingWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.EMPTY_STATE: {
      const W = EmptyStateWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    case WidgetType.AVATAR: {
      const W = AvatarWidgetInk as AnyInkWidget;
      return <W fieldName={fieldName} field={field} />;
    }

    // === FORM WIDGETS ===
    case WidgetType.FORM_FIELD: {
      switch (field.fieldType) {
        case FieldDataType.TEXT: {
          const W = TextFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.EMAIL: {
          const W = EmailFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TEL: {
          const W = PhoneFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.URL: {
          const W = UrlFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.PASSWORD: {
          const W = PasswordFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.UUID: {
          const W = UuidFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TEXTAREA: {
          const W = TextareaFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.NUMBER: {
          const W = NumberFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.INT: {
          const W = IntFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.BOOLEAN: {
          const W = BooleanFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.DATE: {
          const W = DateFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.DATETIME: {
          const W = DateTimeFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TIME: {
          const W = TimeFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.DATE_RANGE: {
          const W = DateRangeFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TIME_RANGE: {
          const W = TimeRangeFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TIMEZONE: {
          const W = TimezoneFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.SELECT: {
          const W = SelectFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.MULTISELECT: {
          const W = MultiSelectFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.CURRENCY_SELECT: {
          const W = CurrencySelectFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.LANGUAGE_SELECT: {
          const W = LanguageSelectFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.COUNTRY_SELECT: {
          const W = CountrySelectFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.FILE: {
          const W = FileFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.JSON: {
          const W = JsonFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.COLOR: {
          const W = ColorFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.ICON: {
          const W = IconFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TAGS: {
          const W = TagsFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TEXT_ARRAY: {
          const W = TextArrayFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.FILTER_PILLS: {
          const W = FilterPillsFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.SLIDER: {
          const W = SliderFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.RANGE_SLIDER: {
          const W = RangeSliderFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.TIME_SERIES: {
          const W = JsonFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        case FieldDataType.SIGNALS: {
          const W = JsonFieldWidgetInk as AnyInkWidget;
          return <W fieldName={fieldName} field={field} />;
        }
        default:
          const _exhaustiveCheck: never = field;
          return _exhaustiveCheck;
      }
    }

    case WidgetType.PAGINATION:
      // Handled by guard before switch — unreachable here.
      return <></>;
    default:
      // oxlint-disable-next-line no-unused-vars
      const _exhaustiveCheck: never = field;
      return <></>;
  }
}
