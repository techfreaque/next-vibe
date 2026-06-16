/**
 * Contact Form Widget
 * Rich UI for submitting a contact form with success state and post-send actions.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe-ui/unified/form-fields/email-field/widget";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe-ui/unified/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

interface ContactFormWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ContactFormWidget({
  field,
}: ContactFormWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();

  // Success state
  if (data?.success) {
    return (
      <Div className="flex flex-col gap-4 p-4">
        <Div className="rounded-lg border border-success/30 bg-success/10 p-6 flex flex-col items-center gap-3 text-center">
          <CheckCircle className="h-10 w-10 text-success" />
          <Span className="font-semibold text-base">{t("success.title")}</Span>
          <Span className="text-sm text-muted-foreground max-w-sm">
            {t("success.description")}
          </Span>
        </Div>
      </Div>
    );
  }

  // Form state
  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <Div className="flex items-center gap-2 mr-auto">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">{t("title")}</Span>
        </Div>
      </Div>

      <Span className="text-sm text-muted-foreground">{t("description")}</Span>

      <FormAlertWidget field={{}} />

      <TextFieldWidget fieldName="name" field={children.name} />
      <EmailFieldWidget fieldName="email" field={children.email} />
      <SelectFieldWidget fieldName="subject" field={children.subject} />
      <SelectFieldWidget fieldName="priority" field={children.priority} />
      <TextareaFieldWidget fieldName="message" field={children.message} />

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "form.submitButton.label",
          loadingText: "form.submitButton.loadingText",
          icon: "send",
          variant: "primary",
        }}
      />
    </Div>
  );
}
