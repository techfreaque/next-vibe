"use client";

import { Div } from "next-vibe/ui/web/ui/div";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/form-fields/multiselect-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

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
