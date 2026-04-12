/**
 * Code Quality Summary Widget - React Implementation
 *
 * Displays summary statistics for code quality checks
 */

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { H3 } from "next-vibe-ui/ui/typography";
import type { ReactElement } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactRequestResponseWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetLocale,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type {
  CodeQualitySummarySchema,
  CodeQualitySummaryWidgetConfig,
} from "./types";

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
