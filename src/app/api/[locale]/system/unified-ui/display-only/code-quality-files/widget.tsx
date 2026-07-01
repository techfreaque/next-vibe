/**
 * Code Quality Files Widget - React Implementation
 *
 * Displays list of files with error/warning counts
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "next-vibe/platforms/react/i18n";
import { Div } from "next-vibe/ui/web/ui/div";
import { Span } from "next-vibe/ui/web/ui/span";
import { H3 } from "next-vibe/ui/web/ui/typography";
import type { ReactRequestResponseWidgetProps } from "next-vibe/unified-ui/_shared/react-types";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import {
  useWidgetForm,
  useWidgetLocale,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type {
  CodeQualityFilesSchema,
  CodeQualityFilesWidgetConfig,
} from "./types";
import type { ReactElement } from "react";
import type { z } from "zod";

/**
 * Code Quality Files React Widget
 */
export default function CodeQualityFilesWidget<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends
    | CodeQualityFilesSchema
    | z.ZodOptional<CodeQualityFilesSchema>,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
  fieldName,
}: ReactRequestResponseWidgetProps<
  TEndpoint,
  TUsage,
  CodeQualityFilesWidgetConfig<TSchema, TUsage, TSchemaType>
>): ReactElement {
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const { usage } = field;

  // Get value from form for request fields, otherwise from field.value
  let value: typeof field.value | undefined;
  if (usage.request && fieldName && form) {
    value = form.watch(fieldName);
    if (!value) {
      value = field.value;
    }
  } else {
    value = field.value;
  }

  const { t } = unifiedInterfaceScopedTranslation.scopedT(locale);

  if (!Array.isArray(value) || value.length === 0) {
    return <></>;
  }

  return (
    <Div className="mt-4 space-y-2">
      <H3 className="text-sm font-semibold">
        {t("widgets.codeQualityFiles.affectedFiles")}
      </H3>
      <Div className="space-y-1">
        {value.map((fileEntry, idx) => {
          const { file, errors, warnings, total } = fileEntry;
          return (
            <Div key={idx} className="flex items-center gap-2 text-sm">
              <Span className="font-mono text-primary underline">{file}</Span>
              {errors > 0 && (
                <Span className="text-destructive">
                  {errors} error{errors !== 1 ? "s" : ""}
                </Span>
              )}
              {warnings > 0 && (
                <Span className="text-yellow-600">
                  {warnings} warning{warnings !== 1 ? "s" : ""}
                </Span>
              )}
              {errors === 0 && warnings === 0 && total > 0 && (
                <Span className="text-gray-500">
                  {total} issue{total !== 1 ? "s" : ""}
                </Span>
              )}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}
