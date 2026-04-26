/**
 * Cortex Write Widget (Web)
 * File writer with path input, content textarea, and success display.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTranslation } from "@/i18n/core/client";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { CortexNav } from "../_shared/cortex-nav";
import { DomainEnrichment } from "../_shared/domain-enrichment";
import { formatBytes } from "../_shared/format-bytes";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function CortexWriteWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const children = field.children;
  const isDisabled = useWidgetDisabled();
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-4">
      {/* Top nav */}
      <CortexNav
        path={value?.responsePath}
        actions={
          value ? ["list", "read", "edit", "move", "delete"] : ["list", "read"]
        }
        actionData={
          value
            ? {
                list: { path: value.responsePath },
                read: { path: value.responsePath },
                edit: { path: value.responsePath },
                move: { from: value.responsePath },
                delete: { path: value.responsePath },
              }
            : {}
        }
      />

      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card mx-4">
          <TextFieldWidget fieldName="path" field={children.path} />
          <TextareaFieldWidget fieldName="content" field={children.content} />
          <BooleanFieldWidget
            fieldName="createParents"
            field={children.createParents}
          />
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.submitButton.label",
                loadingText: "post.submitButton.loadingText",
                icon: "save",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Div className="flex flex-col gap-3 px-4 pb-4">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4">
              <Div className="flex items-center gap-3">
                <Div className="rounded-full bg-green-500/10 p-2">
                  <Check className="h-4 w-4 text-green-500" />
                </Div>
                <Div className="flex-1 min-w-0">
                  <Span className="font-mono text-sm font-medium block truncate">
                    {value.responsePath}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {new Date(value.updatedAt).toLocaleString()}
                  </Span>
                </Div>
                <Div className="flex items-center gap-2 shrink-0">
                  <Badge variant={value.created ? "default" : "secondary"}>
                    {value.created
                      ? t("post.response.created.text")
                      : t("post.response.updated.text")}
                  </Badge>
                  <Badge variant="outline">{formatBytes(value.size)}</Badge>
                </Div>
              </Div>
            </CardContent>
          </Card>
          {/* Content — rendered as Markdown */}
          {value.responseContent && (
            <Div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-muted/20 p-4 overflow-auto max-h-[600px]">
              <Markdown content={value.responseContent} />
            </Div>
          )}

          <DomainEnrichment responsePath={value.responsePath} />
        </Div>
      )}
    </Div>
  );
}
