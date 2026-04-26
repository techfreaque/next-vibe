/**
 * Cortex Move Widget (Web)
 * Move/rename with source and destination path inputs.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { FolderInput } from "next-vibe-ui/ui/icons/FolderInput";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { CortexNav } from "../_shared/cortex-nav";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function CortexMoveWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const isDisabled = useWidgetDisabled();

  return (
    <Div className="flex flex-col gap-4">
      {/* Top nav */}
      <CortexNav
        path={value?.responseTo}
        actions={value ? ["list", "read", "edit", "delete"] : ["list", "read"]}
        actionData={
          value
            ? {
                list: { path: value.responseTo },
                read: { path: value.responseTo },
                edit: { path: value.responseTo },
                delete: { path: value.responseTo },
              }
            : {}
        }
      />

      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card mx-4">
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-6">
              <TextFieldWidget fieldName="from" field={children.from} />
            </Div>
            <Div className="col-span-6">
              <TextFieldWidget fieldName="to" field={children.to} />
            </Div>
          </Div>
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.submitButton.label",
                loadingText: "post.submitButton.loadingText",
                icon: "folder-input",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Div className="px-4 pb-4">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4">
              <Div className="flex items-center gap-3">
                <Div className="rounded-full bg-blue-500/10 p-2">
                  <FolderInput className="h-4 w-4 text-blue-500" />
                </Div>
                <Div className="flex-1 min-w-0">
                  <Div className="flex items-center gap-2 flex-wrap">
                    <Span className="font-mono text-sm text-muted-foreground truncate">
                      {value.responseFrom}
                    </Span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <Span className="font-mono text-sm font-medium truncate">
                      {value.responseTo}
                    </Span>
                  </Div>
                </Div>
                <Badge variant="outline" className="shrink-0">
                  {value.nodesAffected} {t("post.response.nodesAffected.text")}
                </Badge>
              </Div>
            </CardContent>
          </Card>
        </Div>
      )}
    </Div>
  );
}
