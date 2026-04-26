/**
 * Cortex Read Widget (Web)
 * File viewer with path header, metadata badges, monospace content block.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { DomainEnrichment } from "../_shared/domain-enrichment";
import { formatBytes } from "../_shared/format-bytes";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

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

  const handleCopy = (): void => {
    if (value?.content) {
      void navigator.clipboard.writeText(value.content);
    }
  };

  return (
    <Div className="flex flex-col gap-4">
      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
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
        <Div className="flex flex-col gap-3">
          {/* Header */}
          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Span className="font-mono text-sm font-medium">
                {value.responsePath}
              </Span>
            </Div>
            <Div className="flex items-center gap-2">
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
              <Badge variant="outline">{value.nodeType}</Badge>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </Div>
          </Div>

          {/* Content */}
          <Div className="relative rounded-lg border bg-muted/30 overflow-auto max-h-[600px]">
            <Pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
              {value.content}
            </Pre>
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
