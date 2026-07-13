/**
 * Custom Widget for Create Folder
 * Renders the create-folder form - used as modal content via EndpointsPage
 */

"use client";

import { Div } from "next-vibe/ui/ui/div";
import { useWidgetForm } from "next-vibe/unified-ui/_shared/use-widget-context";
import { IconFieldWidget } from "next-vibe/unified-ui/form-fields/icon-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";
import type { FolderCreateResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: FolderCreateResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function FolderCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  useWidgetForm<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <TextFieldWidget field={children.name} fieldName="name" />

      <IconFieldWidget field={children.icon} fieldName="icon" />

      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<typeof definition.POST>
        field={children.submitButton}
      />
    </Div>
  );
}
