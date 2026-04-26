/**
 * Cortex Mkdir Widget (Web)
 * Directory creation form and result.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { CortexNav } from "../_shared/cortex-nav";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function CortexMkdirWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const children = field.children;
  const isDisabled = useWidgetDisabled();

  return (
    <Div className="flex flex-col gap-4">
      {/* Top nav */}
      <CortexNav
        path={value?.responsePath}
        actions={value ? ["list", "write"] : ["list"]}
        actionData={
          value
            ? {
                list: { path: value.responsePath },
                write: { path: `${value.responsePath}/` },
              }
            : {}
        }
      />

      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card mx-4">
          <TextFieldWidget fieldName="path" field={children.path} />
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
                icon: "folder-plus",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Div className="px-4 pb-4">
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="p-4">
              <Div className="flex items-center gap-3">
                <Div className="rounded-full bg-cyan-500/10 p-2">
                  <FolderPlus className="h-4 w-4 text-cyan-500" />
                </Div>
                <Div className="flex-1 min-w-0">
                  <Span className="font-mono text-sm font-medium block truncate">
                    {value.responsePath}
                  </Span>
                </Div>
                <Badge
                  variant={value.created ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {value.created
                    ? t("post.response.created.text")
                    : t("post.response.alreadyExists.text")}
                </Badge>
              </Div>
            </CardContent>
          </Card>
        </Div>
      )}
    </Div>
  );
}
