"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { MultiSelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { FolderUpdateResponseOutput } from "./definition";

interface UpdateFolderWidgetProps {
  field: {
    value: FolderUpdateResponseOutput | null | undefined;
  } & (typeof definition.PATCH)["fields"];
}

export function UpdateFolderContainer({
  field: { children },
}: UpdateFolderWidgetProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4 p-4">
      <TextFieldWidget field={children.name} fieldName="name" />
      <TextFieldWidget field={children.icon} fieldName="icon" />
      <TextFieldWidget field={children.color} fieldName="color" />
      <BooleanFieldWidget field={children.expanded} fieldName="expanded" />
      <MultiSelectFieldWidget
        field={children.rolesView}
        fieldName="rolesView"
      />
      <MultiSelectFieldWidget
        field={children.rolesManage}
        fieldName="rolesManage"
      />
      <MultiSelectFieldWidget
        field={children.rolesCreateThread}
        fieldName="rolesCreateThread"
      />
      <MultiSelectFieldWidget
        field={children.rolesPost}
        fieldName="rolesPost"
      />
      <MultiSelectFieldWidget
        field={children.rolesModerate}
        fieldName="rolesModerate"
      />
      <MultiSelectFieldWidget
        field={children.rolesAdmin}
        fieldName="rolesAdmin"
      />
      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={children.submitButton}
      />
    </Div>
  );
}
