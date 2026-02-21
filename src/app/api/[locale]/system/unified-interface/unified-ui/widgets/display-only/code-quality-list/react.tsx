/**
 * Code Quality List Widget - React Implementation
 *
 * Displays code quality issues grouped by file with severity-based styling
 */

import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { ReactElement } from "react";
import { useMemo } from "react";
import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactRequestResponseWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetResponse,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { simpleT } from "@/i18n/core/shared";

import type {
  CodeQualityListSchema,
  CodeQualityListWidgetConfig,
} from "./types";

interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

/**
 * Code Quality List React Widget
 */
export default function CodeQualityListWidget<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends CodeQualityListSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
>({
  field,
  fieldName,
}: ReactRequestResponseWidgetProps<
  TEndpoint,
  TUsage,
  CodeQualityListWidgetConfig<TSchema, TUsage, TSchemaType>
>): ReactElement {
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const form = useWidgetForm();
  const { usage } = field;

  // Get value from form for request fields, otherwise from field.value
  // field.value is typed as the inferred schema output; cast to the concrete type
  // since TSchema is constrained to CodeQualityListSchema (a ZodArray)
  type CodeQualityListOutput = z.output<CodeQualityListSchema>;
  let value: CodeQualityListOutput | undefined;
  if (usage.request && fieldName && form) {
    value = form.watch(fieldName) as CodeQualityListOutput | undefined;
    if (!value) {
      value = field.value as CodeQualityListOutput | undefined;
    }
  } else {
    value = field.value as CodeQualityListOutput | undefined;
  }

  const { t } = simpleT(locale);

  // Get editor URI scheme from response data if field key is provided
  const editorUriScheme = useMemo(() => {
    if (
      field.editorUriSchemaFieldKey &&
      response?.success &&
      response?.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
    ) {
      const data = response.data;
      const scheme = data[field.editorUriSchemaFieldKey];
      if (typeof scheme === "string") {
        return scheme;
      }
    }
    // Default to vscode://file/ if not provided
    return "vscode://file/";
  }, [field.editorUriSchemaFieldKey, response]);

  // Group items by file
  const groupedItems = useMemo(() => {
    const groups = new Map<string, CodeQualityItem[]>();

    if (!value) {
      return groups;
    }

    for (const item of value) {
      const existing = groups.get(item.file) || [];
      existing.push(item);
      groups.set(item.file, existing);
    }

    return groups;
  }, [value]);

  if (!value || value.length === 0) {
    return (
      <Div className="text-green-600">
        {t("app.api.system.unifiedInterface.widgets.codeQualityList.noIssues")}
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      {[...groupedItems.entries()].map(([file, items]) => {
        return (
          <Div key={file} className="space-y-2">
            <Div className="font-bold">
              {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Visual marker character */}
              <Span className="text-blue-600 underline">● {file}</Span>
              <Span className="ml-2 text-gray-500">
                ({items.length} item{items.length !== 1 ? "s" : ""})
              </Span>
            </Div>
            <Div className="ml-4 space-y-1">
              {items.map((item, idx) => {
                const severityColor =
                  item.severity === "error"
                    ? "text-red-600"
                    : item.severity === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600";

                const icon =
                  item.severity === "error"
                    ? "❌"
                    : item.severity === "warning"
                      ? "⚠️"
                      : "ℹ️";

                // Create clickable editor link using configured URI scheme
                const absolutePath = item.file.startsWith("/")
                  ? item.file
                  : `${process.cwd()}/${item.file}`;
                const editorUrl = `${editorUriScheme}${absolutePath}:${item.line || 1}:${item.column || 1}`;

                return (
                  <Div key={idx} className="text-sm">
                    <Link
                      href={editorUrl}
                      className="text-blue-600 hover:underline"
                    >
                      {item.line || 1}:{item.column || 1}
                    </Link>
                    <Span className={`ml-2 ${severityColor}`}>
                      {icon} {item.severity}
                    </Span>
                    <Span className="ml-2">{item.message}</Span>
                    {item.rule && (
                      <Span className="ml-1 text-gray-500">[{item.rule}]</Span>
                    )}
                  </Div>
                );
              })}
            </Div>
          </Div>
        );
      })}
    </Div>
  );
}
