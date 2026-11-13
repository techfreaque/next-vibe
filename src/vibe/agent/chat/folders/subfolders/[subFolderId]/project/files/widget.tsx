"use client";

import { Div } from "next-vibe/ui/components/div";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definitions from "./definition";

type AddFileDefinition = (typeof definitions)["POST"];

interface AddFileWidgetProps {
  field: AddFileDefinition["fields"];
}

/** Add knowledge file form - name + content, no folder id field. */
export function FolderProjectAddFileContainer({
  field: { children },
}: AddFileWidgetProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4 p-4 sm:p-6">
      <TextFieldWidget field={children.name} fieldName="name" />
      <TextareaFieldWidget field={children.content} fieldName="content" />
      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<AddFileDefinition> field={children.submitButton} />
    </Div>
  );
}
