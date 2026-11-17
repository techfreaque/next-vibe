/**
 * Forum Post Widget
 * Draft ID + target (thread, or title + category) + submit. After posting:
 * the thread link and the hourly budget left.
 */

"use client";

import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { UuidFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/uuid-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ForumPostContainer({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      {data?.messageId && (
        <Div
          data-testid="forum-post-success"
          className="rounded-lg border border-success/30 bg-success/10 p-4 flex flex-col gap-2"
        >
          <Div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success shrink-0" />
            <Span className="text-sm font-medium">
              {t("post.success.description")}
            </Span>
          </Div>
          <ExternalLink
            href={data.threadUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline break-all"
          >
            {t("post.button.openThread")}
          </ExternalLink>
          <Span className="text-xs text-muted-foreground">
            {`${t("post.response.postsLeftThisHour")}: ${data.postsLeftThisHour}`}
          </Span>
        </Div>
      )}

      <Span className="text-sm text-muted-foreground">
        {t("post.form.description")}
      </Span>

      <UuidFieldWidget
        fieldName="draftMessageId"
        field={children.draftMessageId}
      />
      <UuidFieldWidget
        fieldName="draftThreadId"
        field={children.draftThreadId}
      />
      <Div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
        <UuidFieldWidget fieldName="threadId" field={children.threadId} />
        <UuidFieldWidget fieldName="parentId" field={children.parentId} />
        <TextFieldWidget fieldName="title" field={children.title} />
        <TextFieldWidget fieldName="category" field={children.category} />
      </Div>
      <BooleanFieldWidget
        fieldName="requireUncensored"
        field={children.requireUncensored}
      />

      <Div className="flex flex-row">
        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />
      </Div>
    </Div>
  );
}
