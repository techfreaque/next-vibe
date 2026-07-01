/**
 * Code Quality Summary Widget - React Implementation
 *
 * Displays summary statistics for code quality checks
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
  CodeQualitySummarySchema,
  CodeQualitySummaryWidgetConfig,
} from "./types";
import type { ReactElement } from "react";

/**
 * Code Quality Summary React Widget
 */
export default function CodeQualitySummaryWidget<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends CodeQualitySummarySchema,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactRequestResponseWidgetProps<
  TEndpoint,
  TUsage,
  CodeQualitySummaryWidgetConfig<TSchema, TUsage, "primitive">
>): ReactElement {
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const { usage } = field;

  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);

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

  if (!value) {
    return <></>;
  }

  const {
    totalFiles,
    displayedFiles,
    totalIssues,
    displayedIssues,
    totalErrors,
  } = value;

  const filesDisplay =
    displayedFiles < totalFiles
      ? `${displayedFiles} ${widgetT("widgets.codeQualitySummary.of")} ${totalFiles}`
      : totalFiles;

  const issuesDisplay =
    displayedIssues < totalIssues
      ? `${displayedIssues} ${widgetT("widgets.codeQualitySummary.of")} ${totalIssues}`
      : totalIssues;

  return (
    <Div className="mt-4 space-y-2 rounded border p-4">
      <H3 className="text-sm font-semibold">
        {widgetT("widgets.codeQualitySummary.summary")}
      </H3>
      <Div className="border-t pt-2 text-sm">
        <Div className="space-y-1">
          <Div>
            <Span>{widgetT("widgets.codeQualitySummary.files")}: </Span>
            <Span className="font-semibold">{filesDisplay}</Span>
          </Div>
          <Div>
            <Span>{widgetT("widgets.codeQualitySummary.issues")}: </Span>
            <Span className="font-semibold">{issuesDisplay}</Span>
          </Div>
          {totalErrors > 0 && (
            <Div>
              <Span>{widgetT("widgets.codeQualitySummary.errors")}: </Span>
              <Span className="font-semibold text-destructive">
                {totalErrors}
              </Span>
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}
