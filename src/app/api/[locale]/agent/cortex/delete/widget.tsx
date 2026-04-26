/**
 * Cortex Delete Widget (Web)
 * File/folder deletion with result display.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTranslation } from "@/i18n/core/client";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";

interface CustomWidgetProps {
  field: (typeof definition.DELETE)["fields"];
}

export function CortexDeleteWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.DELETE>();
  const children = field.children;
  const isDisabled = useWidgetDisabled();
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="flex flex-col gap-4">
      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
          <TextFieldWidget fieldName="path" field={children.path} />
          <BooleanFieldWidget
            fieldName="recursive"
            field={children.recursive}
          />
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.DELETE>
              field={{
                text: "delete.submitButton.label",
                loadingText: "delete.submitButton.loadingText",
                icon: "trash",
                variant: "destructive",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <Div className="flex items-center gap-3">
              <Div className="rounded-full bg-red-500/10 p-2">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Div>
              <Div className="flex-1">
                <Span className="font-mono text-sm font-medium block">
                  {value.responsePath}
                </Span>
              </Div>
              <Badge variant="destructive">
                {value.nodesDeleted} {t("delete.response.nodesDeleted.text")}
              </Badge>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
