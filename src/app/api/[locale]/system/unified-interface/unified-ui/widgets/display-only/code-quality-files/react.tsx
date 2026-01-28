/**
 * Code Quality Files Widget - React Implementation
 *
 * Displays list of files with error/warning counts
 */

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { H3 } from "next-vibe-ui/ui/typography";
import type { ReactElement } from "react";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { simpleT } from "@/i18n/core/shared";

import type {
  CodeQualityFilesSchema,
  CodeQualityFilesWidgetConfig,
} from "./types";

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
  context,
  field,
}: ReactWidgetProps<
  TEndpoint,
  CodeQualityFilesWidgetConfig<TSchema, TUsage, TSchemaType>
>): ReactElement {
  const value = field.value;
  const { t } = simpleT(context.locale);

  if (!Array.isArray(value) || value.length === 0) {
    return <></>;
  }

  return (
    <Div className="mt-4 space-y-2">
      <H3 className="text-sm font-semibold">
        {t(
          "app.api.system.unifiedInterface.widgets.codeQualityFiles.affectedFiles",
        )}
      </H3>
      <Div className="space-y-1">
        {value.map((fileEntry, idx) => {
          const { file, errors, warnings, total } = fileEntry;
          return (
            <Div key={idx} className="flex items-center gap-2 text-sm">
              <Span className="font-mono text-blue-600 underline">{file}</Span>
              {errors > 0 && (
                <Span className="text-red-600">
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
