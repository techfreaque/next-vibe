/**
 * Subscription Cancel Widget
 * Form to cancel an existing subscription
 */

"use client";

import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle, CheckCircle } from "next-vibe-ui/ui/icons";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { SubscriptionCancelDeleteResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: SubscriptionCancelDeleteResponseOutput | null | undefined;
  } & (typeof definition.DELETE)["fields"];
  fieldName: string;
}

/**
 * Subscription Cancel Container Widget
 */
export function SubscriptionCancelContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation();
  const children = field.children;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Warning Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t("app.api.subscription.delete.warning")}
        </AlertDescription>
      </Alert>

      <FormAlertWidget field={{}} />

      {/* Form Fields */}
      <BooleanFieldWidget
        fieldName="cancelAtPeriodEnd"
        field={children.cancelAtPeriodEnd}
      />
      <TextFieldWidget fieldName="reason" field={children.reason} />

      {/* Submit Button */}
      <SubmitButtonWidget
        field={{
          text: "app.api.subscription.delete.submit.label",
          loadingText: "app.api.subscription.delete.submit.loading",
          icon: "package-x",
          variant: "destructive",
        }}
      />

      {/* Success Response */}
      {field.value?.success && (
        <Card className="mt-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <Div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <Div>
                <P className="font-medium text-green-900 dark:text-green-100">
                  {t("app.api.subscription.delete.success.title")}
                </P>
                <P className="text-sm text-green-700 dark:text-green-300">
                  {field.value.message}
                </P>
              </Div>
            </Div>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}
