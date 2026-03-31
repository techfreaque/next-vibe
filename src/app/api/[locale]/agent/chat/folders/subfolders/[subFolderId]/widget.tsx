"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { FolderDeleteResponseOutput } from "./definition";

interface DeleteFolderWidgetProps {
  field: {
    value: FolderDeleteResponseOutput | null | undefined;
  } & (typeof definition.DELETE)["fields"];
}

export function DeleteFolderContainer({
  field,
}: DeleteFolderWidgetProps): JSX.Element {
  const children = field.children;
  return (
    <Div className="flex flex-col gap-4 p-4">
      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<typeof definition.DELETE>
        field={children.submitButton}
      />
    </Div>
  );
}
