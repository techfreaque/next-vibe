"use client";

import { Div } from "next-vibe/ui/web/ui/div";
import { IconFieldWidget } from "next-vibe/unified-ui/form-fields/icon-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definitions from "./definition";

type RenameDefinition = (typeof definitions)["PATCH"];

interface RenameWidgetProps {
  field: {
    value: RenameDefinition["types"]["ResponseOutput"] | null | undefined;
  } & RenameDefinition["fields"];
}

export function FolderRenameContainer({
  field: { children },
}: RenameWidgetProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4 p-4">
      <TextFieldWidget field={children.name} fieldName="name" />
      <IconFieldWidget field={children.icon} fieldName="icon" />
      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<RenameDefinition> field={children.submitButton} />
    </Div>
  );
}
