"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

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
      <SubmitButtonWidget<RenameDefinition>
        field={{
          icon: "folder-pen",
          variant: "primary",
          className: "w-full",
        }}
      />
    </Div>
  );
}
