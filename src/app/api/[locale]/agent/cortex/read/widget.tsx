/**
 * Cortex Read Widget (Web)
 * File viewer with path header, metadata badges, markdown content block.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { CortexNav } from "../_shared/cortex-nav";
import { DomainEnrichment } from "../_shared/domain-enrichment";
import { formatBytes } from "../_shared/format-bytes";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function CortexReadWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const isDisabled = useWidgetDisabled();
  const navigation = useWidgetNavigation();
  const isPushed = navigation.canGoBack;

  const handleCopy = (): void => {
    if (value?.content) {
      void navigator.clipboard.writeText(value.content);
    }
  };

  return (
    <Div className="flex flex-col gap-4">
      {/* Top nav — always shown, back + context actions when we have a path */}
      <CortexNav
        path={value?.responsePath}
        actions={value ? ["list", "edit", "write", "move", "delete"] : ["list"]}
        actionData={
          value
            ? {
                list: { path: value.responsePath },
                edit: { path: value.responsePath },
                write: { path: value.responsePath, content: value.content },
                move: { from: value.responsePath },
                delete: { path: value.responsePath },
              }
            : {}
        }
      />

      {/* Form — only show when not opened via navigation push */}
      {!isDisabled && !isPushed && (
        <Div className="flex flex-col gap-3 px-4">
          <TextFieldWidget fieldName="path" field={children.path} />
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-6">
              <NumberFieldWidget
                fieldName="maxLines"
                field={children.maxLines}
              />
            </Div>
          </Div>
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.GET>
              field={{
                text: "get.submitButton.label",
                loadingText: "get.submitButton.loadingText",
                icon: "file-text",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Div className="flex flex-col gap-3 px-4 pb-4">
          {/* Header */}
          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <Span className="font-mono text-sm font-medium truncate">
                {value.responsePath}
              </Span>
            </Div>
            <Div className="flex items-center gap-2 shrink-0 ml-2">
              {value.readonly && (
                <Badge variant="secondary">
                  {t("get.response.readonly.text")}
                </Badge>
              )}
              {value.truncated && (
                <Badge variant="destructive">
                  {t("get.response.truncated.text")}
                </Badge>
              )}
              <Badge variant="outline">{formatBytes(value.size)}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </Div>
          </Div>

          {/* Content — rendered as Markdown */}
          <Div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-muted/20 p-4 overflow-auto max-h-[600px]">
            <Markdown content={value.content} />
          </Div>

          {/* Footer */}
          <Div className="flex justify-end">
            <Span className="text-xs text-muted-foreground">
              {new Date(value.updatedAt).toLocaleString()}
            </Span>
          </Div>

          {/* Domain enrichment */}
          <DomainEnrichment responsePath={value.responsePath} />
        </Div>
      )}
    </Div>
  );
}
