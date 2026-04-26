/**
 * Custom Widget for Create Folder
 * Renders the create-folder form - used as modal content via EndpointsPage
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { type JSX } from "react";

import { useWidgetForm } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

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
