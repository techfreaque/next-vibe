/**
 * Subscription Update Widget
 * Form to update an existing subscription
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.PUT)["fields"];
}

/**
 * Subscription Update Container Widget
 */
export function SubscriptionUpdateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.PUT>();
  const children = field.children;
  const value = useWidgetValue<typeof definition.PUT>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />

      {/* Form Fields */}
      <SelectFieldWidget fieldName="plan" field={children.plan} />
      <SelectFieldWidget
        fieldName="billingInterval"
        field={children.billingInterval}
      />

      {/* Submit Button */}
      <SubmitButtonWidget<typeof definition.PUT>
        field={{
          text: "put.submit.label",
          loadingText: "put.submit.loading",
          icon: "package-check",
          variant: "primary",
        }}
      />

      {/* Success Response */}
      {value && (
        <Card className="mt-4 border-success/30 bg-success/10">
          <CardContent className="pt-6">
            <Div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <Div>
                <P className="font-medium text-success-foreground">
                  {t("put.success.title")}
                </P>
                <P className="text-sm text-success-foreground/80">
                  {t("put.success.description")}
                </P>
              </Div>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
