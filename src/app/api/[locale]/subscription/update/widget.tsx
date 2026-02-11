/**
 * Subscription Update Widget
 * Form to update an existing subscription
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { SubscriptionUpdatePutResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: SubscriptionUpdatePutResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

/**
 * Subscription Update Container Widget
 */
export function SubscriptionUpdateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation();
  const children = field.children;

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
      <SubmitButtonWidget
        field={{
          text: "app.api.subscription.put.submit.label",
          loadingText: "app.api.subscription.put.submit.loading",
          icon: "package-check",
          variant: "primary",
        }}
      />

      {/* Success Response */}
      {field.value && (
        <Card className="mt-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <Div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <Div>
                <P className="font-medium text-green-900 dark:text-green-100">
                  {t("app.api.subscription.put.success.title")}
                </P>
                <P className="text-sm text-green-700 dark:text-green-300">
                  {t("app.api.subscription.put.success.description")}
                </P>
              </Div>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
