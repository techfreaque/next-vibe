/**
 * Contact Form Widget
 * Rich UI for submitting a contact form with success state and post-send actions.
 */

"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div, type DivMouseEvent } from "next-vibe/ui/ui/div";
import { AlertTriangle } from "next-vibe/ui/ui/icons/AlertTriangle";
import { CheckCircle } from "next-vibe/ui/ui/icons/CheckCircle";
import { Mail } from "next-vibe/ui/ui/icons/Mail";
import { Send } from "next-vibe/ui/ui/icons/Send";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback, useRef, useState } from "react";

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
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const [showNoEmailWarning, setShowNoEmailWarning] = useState(false);
  const emailFieldRef = useRef<HTMLDivElement>(null);

  const email = form?.watch("email");
  const hasEmail = Boolean(email && String(email).trim().length > 0);

  const handleSubmitClick = useCallback(
    (e: DivMouseEvent) => {
      if (!hasEmail && !showNoEmailWarning) {
        e.preventDefault();
        e.stopPropagation();
        setShowNoEmailWarning(true);
      }
    },
    [hasEmail, showNoEmailWarning],
  );

  const handleAddEmail = useCallback(() => {
    setShowNoEmailWarning(false);
    emailFieldRef.current?.querySelector("input")?.focus();
  }, []);

  const handleSendAnyway = useCallback(() => {
    setShowNoEmailWarning(false);
    onSubmit?.();
  }, [onSubmit]);

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
      <Div ref={emailFieldRef}>
        <EmailFieldWidget fieldName="email" field={children.email} />
      </Div>
      <SelectFieldWidget fieldName="subject" field={children.subject} />
      <SelectFieldWidget fieldName="priority" field={children.priority} />
      <TextareaFieldWidget fieldName="message" field={children.message} />

      {showNoEmailWarning ? (
        <Div className="rounded-lg border border-warning/40 bg-warning/10 p-4 flex flex-col gap-3">
          <Div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <Div className="flex flex-col gap-1">
              <Span className="font-semibold text-sm">
                {t("noEmail.warning.title")}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("noEmail.warning.description")}
              </Span>
            </Div>
          </Div>
          <Div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleAddEmail}>
              {t("noEmail.warning.addEmail")}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSendAnyway}
              className="gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              {t("noEmail.warning.sendAnyway")}
            </Button>
          </Div>
        </Div>
      ) : (
        <Div onClick={handleSubmitClick}>
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "form.submitButton.label",
              loadingText: "form.submitButton.loadingText",
              icon: "send",
              variant: "primary",
            }}
          />
        </Div>
      )}
    </Div>
  );
}
