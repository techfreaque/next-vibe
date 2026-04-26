/**
 * Cortex Edit Widget (Web)
 * File editor with find/replace and line-range editing support.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { CortexNav } from "../_shared/cortex-nav";
import { DomainEnrichment } from "../_shared/domain-enrichment";
import { formatBytes } from "../_shared/format-bytes";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.PATCH)["fields"];
}

export function CortexEditWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.PATCH>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const isDisabled = useWidgetDisabled();

  return (
    <Div className="flex flex-col gap-4">
      {/* Top nav */}
      <CortexNav
        path={value?.responsePath}
        actions={
          value ? ["list", "read", "write", "move", "delete"] : ["list", "read"]
        }
        actionData={
          value
            ? {
                list: { path: value.responsePath },
                read: { path: value.responsePath },
                write: { path: value.responsePath },
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
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-6">
              <TextFieldWidget fieldName="find" field={children.find} />
            </Div>
            <Div className="col-span-6">
              <TextFieldWidget fieldName="replace" field={children.replace} />
            </Div>
          </Div>
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-4">
              <NumberFieldWidget
                fieldName="startLine"
                field={children.startLine}
              />
            </Div>
            <Div className="col-span-4">
              <NumberFieldWidget fieldName="endLine" field={children.endLine} />
            </Div>
          </Div>
          <TextareaFieldWidget
            fieldName="newContent"
            field={children.newContent}
          />
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.PATCH>
              field={{
                text: "patch.submitButton.label",
                loadingText: "patch.submitButton.loadingText",
                icon: "edit-2",
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
                </Div>
                <Div className="flex items-center gap-2 shrink-0">
                  <Badge variant="default">
                    {value.replacements} {t("patch.response.replacements.text")}
                  </Badge>
                  <Badge variant="outline">{formatBytes(value.size)}</Badge>
                </Div>
              </Div>
            </CardContent>
          </Card>
          <DomainEnrichment responsePath={value.responsePath} />
        </Div>
      )}
    </Div>
  );
}
