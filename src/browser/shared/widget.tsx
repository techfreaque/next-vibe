"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValueNonStrict } from "next-vibe/unified-ui/_shared/field-helpers";
import { hasChildren } from "next-vibe/unified-ui/_shared/type-guards";
import {
  useWidgetDisabled,
  useWidgetEndpoint,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { ChildrenDataRenderer } from "next-vibe/unified-ui/renderers/web/ChildrenDataRenderer";
import { WidgetRenderer } from "next-vibe/unified-ui/renderers/web/WidgetRenderer";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

interface ContentBlock {
  type: string;
  text?: string;
  data?: string;
  mimeType?: string;
}

interface BrowserResponse {
  success?: boolean;
  result?: ContentBlock[];
  error?: string;
  executionId?: string;
}

/**
 * Formats MCPContentBlock[] as readable text
 */
function formatContentBlocks(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "text" && block.text) {
        return block.text;
      }
      if (block.type === "image") {
        return `[image: ${block.mimeType ?? "unknown"}]`;
      }
      return `[${block.type}]`;
    })
    .join("\n");
}

function BrowserToolRequestFields(): JSX.Element {
  const endpoint = useWidgetEndpoint();
  const platform = useWidgetPlatform();
  const user = useWidgetUser();
  const form = useWidgetForm();
  const t = useWidgetTranslation<typeof endpoint>();
  const values = useWatch({ control: form.control });

  const requestFields = hasChildren(endpoint.fields)
    ? ChildrenDataRenderer.sortChildren(
        ChildrenDataRenderer.extractChildren(endpoint.fields.children, values, {
          requestOnly: true,
          userRoles: user.roles,
        }).filter(
          ({ field }) =>
            !("hiddenForPlatforms" in field) ||
            !Array.isArray(field.hiddenForPlatforms) ||
            !field.hiddenForPlatforms.includes(platform),
        ),
      )
    : [];

  return (
    <Div className="grid gap-3 @md:grid-cols-2">
      {requestFields.map(({ name, field, columns, data }) => {
        const isArray =
          "schemaType" in field &&
          (field.schemaType === "array" ||
            field.schemaType === "array-optional");
        const items = isArray && Array.isArray(data) ? data : [];
        return (
          <Div
            key={name}
            className={
              !columns || columns >= 12 ? "@md:col-span-2 min-w-0" : "min-w-0"
            }
          >
            <WidgetRenderer
              fieldName={name}
              field={withValueNonStrict(field, data, values)}
            />
            {isArray && (
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    form.setValue(name, [...items, {}], { shouldDirty: true })
                  }
                >
                  {t("shared.addItem")}
                </Button>
                {items.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      form.setValue(name, items.slice(0, -1), {
                        shouldDirty: true,
                      })
                    }
                  >
                    {t("shared.removeItem")}
                  </Button>
                )}
              </Div>
            )}
          </Div>
        );
      })}
    </Div>
  );
}

export function BrowserToolWidget(): JSX.Element {
  const value: BrowserResponse | undefined = useWidgetValue();
  const endpoint = useWidgetEndpoint();
  const platform = useWidgetPlatform();
  const disabled = useWidgetDisabled();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const onSubmit = useWidgetOnSubmit();
  const t = useWidgetTranslation<typeof endpoint>();

  const isMcp = platform === Platform.MCP;
  const showForm =
    isInteractive && !responseOnly && !disabled && !isMcp && !!onSubmit;
  const { success, result, error, executionId } = value ?? {};

  // MCP: compact single-line format for AI consumption
  if (isMcp) {
    if (!value) {
      return <></>;
    }
    const lines: string[] = [];
    if (success === false) {
      lines.push(`error: ${error ?? "unknown"}`);
    }
    if (result && result.length > 0) {
      lines.push(formatContentBlocks(result));
    }
    if (executionId) {
      lines.push(`id:${executionId}`);
    }
    return <Span>{lines.join(" | ")}</Span>;
  }

  // CLI and web: structured display with content blocks
  const resultView = value ? (
    <Div className="flex-col">
      {success === false && error && (
        <Span className="text-red-500">{`Error: ${error}`}</Span>
      )}
      {result && result.length > 0 && (
        <Span>{formatContentBlocks(result)}</Span>
      )}
      {executionId && (
        <Span className="opacity-50">{`id: ${executionId}`}</Span>
      )}
    </Div>
  ) : null;

  if (!showForm) {
    return resultView ?? <></>;
  }

  return (
    <WidgetShell scroll={false}>
      <WidgetHeader
        title={t(endpoint.title)}
        backButton={
          <NavigateButtonWidget
            field={{
              label: "shared.back",
              icon: "chevron-left",
              variant: "ghost",
            }}
          />
        }
      />
      <BrowserToolRequestFields />
      <FormAlertWidget field={{}} />
      <Div className="flex">
        <SubmitButtonWidget field={{}} />
      </Div>
      {resultView}
    </WidgetShell>
  );
}

BrowserToolWidget.displayName = "BrowserToolWidget";

export default BrowserToolWidget;
