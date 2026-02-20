/**
 * Gmail-style Compose Email Widget
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2, Send, X } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import React, { useCallback, useState } from "react";

import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { ComposeEmailResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ComposeEmailResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

const inputClass =
  "w-full bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none";

export function ComposeEmailContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const router = useRouter();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const [isSending, setIsSending] = useState(false);

  const sent = field.value?.sent;

  const toValue: string = (form?.watch(`${fieldName}.to`) as string) ?? "";
  const toNameValue: string =
    (form?.watch(`${fieldName}.toName`) as string) ?? "";
  const subjectValue: string =
    (form?.watch(`${fieldName}.subject`) as string) ?? "";
  const bodyValue: string = (form?.watch(`${fieldName}.body`) as string) ?? "";

  const handleSend = useCallback((): void => {
    if (isSending) {
      return;
    }
    setIsSending(true);
    if (onSubmit) {
      onSubmit();
    }
    setTimeout(() => setIsSending(false), 1500);
  }, [isSending, onSubmit]);

  const handleCancel = useCallback((): void => {
    router.push(`/${locale}/admin/emails/imap/messages`);
  }, [router, locale]);

  if (sent) {
    return (
      <Div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <Div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
        </Div>
        <Span className="font-semibold text-lg">
          {t("app.api.emails.imapClient.messages.compose.widget.sent")}
        </Span>
        <Button type="button" variant="outline" onClick={handleCancel}>
          {t("app.api.emails.imapClient.messages.compose.widget.cancel")}
        </Button>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col h-full">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Span className="font-semibold text-base flex-1">
          {t("app.api.emails.imapClient.messages.compose.widget.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          title={t("app.api.emails.imapClient.messages.compose.widget.cancel")}
        >
          <X className="h-4 w-4" />
        </Button>
      </Div>

      {/* Compose fields */}
      <Div className="flex flex-col flex-1 divide-y">
        {/* To */}
        <Div className="flex items-center gap-3 px-4 py-2.5">
          <Span className="text-sm font-medium text-muted-foreground w-32 flex-shrink-0">
            {t("app.api.emails.imapClient.messages.compose.post.to.label")}
          </Span>
          <Input
            type="email"
            className={inputClass}
            placeholder={t(
              "app.api.emails.imapClient.messages.compose.post.to.placeholder",
            )}
            value={toValue}
            onChangeText={(text) => form?.setValue(`${fieldName}.to`, text)}
          />
        </Div>

        {/* To Name */}
        <Div className="flex items-center gap-3 px-4 py-2.5">
          <Span className="text-sm font-medium text-muted-foreground w-32 flex-shrink-0">
            {t("app.api.emails.imapClient.messages.compose.post.toName.label")}
          </Span>
          <Input
            className={inputClass}
            placeholder={t(
              "app.api.emails.imapClient.messages.compose.post.toName.placeholder",
            )}
            value={toNameValue}
            onChangeText={(text) => form?.setValue(`${fieldName}.toName`, text)}
          />
        </Div>

        {/* Subject */}
        <Div className="flex items-center gap-3 px-4 py-2.5">
          <Span className="text-sm font-medium text-muted-foreground w-32 flex-shrink-0">
            {t("app.api.emails.imapClient.messages.compose.post.subject.label")}
          </Span>
          <Input
            className={`${inputClass} font-medium`}
            placeholder={t(
              "app.api.emails.imapClient.messages.compose.post.subject.placeholder",
            )}
            value={subjectValue}
            onChangeText={(text) =>
              form?.setValue(`${fieldName}.subject`, text)
            }
          />
        </Div>

        {/* Body */}
        <Div className="flex-1 px-4 py-3">
          <Textarea
            className={`${inputClass} min-h-[300px] resize-none block`}
            placeholder={t(
              "app.api.emails.imapClient.messages.compose.post.body.placeholder",
            )}
            value={bodyValue}
            onChangeText={(text) => form?.setValue(`${fieldName}.body`, text)}
          />
        </Div>
      </Div>

      {/* Footer */}
      <Div className="flex items-center gap-2 px-4 py-3 border-t">
        <Button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          className="gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("app.api.emails.imapClient.messages.compose.widget.sending")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t("app.api.emails.imapClient.messages.compose.widget.send")}
            </>
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          {t("app.api.emails.imapClient.messages.compose.widget.cancel")}
        </Button>
      </Div>
    </Div>
  );
}
