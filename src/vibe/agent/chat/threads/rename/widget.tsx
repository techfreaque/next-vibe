"use client";

import { Div } from "next-vibe/ui/components/div";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetForm,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";
import type { ThreadRenameResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.PATCH)["fields"] & {
    value?: ThreadRenameResponseOutput | null;
  };
}

export function ThreadRenameContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.PATCH>();
  useWidgetForm<typeof definition.PATCH>();
  const result = useWidgetValue<typeof definition.PATCH>();

  if (result?.updatedTitle) {
    return (
      <Div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
        <Div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-5 w-5 text-primary" />
        </Div>
        <Div className="flex flex-col gap-1">
          <Span className="text-base font-semibold">{result.updatedTitle}</Span>
          {result.updatedPreview && (
            <Span className="text-sm text-muted-foreground">
              {result.updatedPreview}
            </Span>
          )}
        </Div>
        <Span className="text-xs text-muted-foreground">
          {t("patch.success.description")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-1">
        <Pencil className="h-4 w-4 text-muted-foreground" />
        <Span className="text-sm font-medium text-muted-foreground">
          {t("patch.container.description")}
        </Span>
      </Div>

      <TextFieldWidget field={children.title} fieldName="title" />

      <TextareaFieldWidget
        field={children.description}
        fieldName="description"
      />

      <Div className="flex gap-2 pt-1">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definition.PATCH>
          field={children.submitButton}
        />
      </Div>
    </Div>
  );
}
