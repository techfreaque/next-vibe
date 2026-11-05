"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Div } from "next-vibe/ui/components/div";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { Span } from "next-vibe/ui/components/span";
import { H3 } from "next-vibe/ui/components/typography";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

interface DescribeImageContainerProps {
  field: (typeof definition.POST)["fields"];
}

export function DescribeImageContainer({
  field,
}: DescribeImageContainerProps): JSX.Element {
  const children = field.children;
  const result = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2">
        <Div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Eye className="h-3.5 w-3.5 text-primary" />
        </Div>
        <H3 className="text-sm font-semibold">{t("post.title")}</H3>
      </Div>

      <FormAlertWidget field={{}} />
      <TextFieldWidget fieldName="fileUrl" field={children.fileUrl} />
      <TextareaFieldWidget fieldName="context" field={children.context} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.label",
          loadingText: "post.submitButton.loadingText",
          icon: "eye",
          variant: "primary",
          className: "w-full",
        }}
      />

      {result?.text && (
        <Div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.response.text")}
          </Span>
          <Span className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {result.text}
          </Span>
          <Div className="flex items-center gap-2 flex-wrap">
            {result.model && (
              <Badge variant="secondary" className="text-[10px]">
                {result.model}
              </Badge>
            )}
            {result.creditCost !== undefined && (
              <Badge variant="outline" className="text-[10px]">
                {`${t("post.response.creditCost")}: ${String(result.creditCost)}`}
              </Badge>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}
