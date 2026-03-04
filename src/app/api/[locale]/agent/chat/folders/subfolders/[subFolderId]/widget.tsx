"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { FolderDeleteResponseOutput } from "./definition";

interface DeleteFolderWidgetProps {
  field: {
    value: FolderDeleteResponseOutput | null | undefined;
  } & (typeof definition.DELETE)["fields"];
  fieldName: string;
}

export function DeleteFolderContainer({
  field,
}: DeleteFolderWidgetProps): JSX.Element {
  void field;
  return (
    <Div className="flex flex-col gap-4 p-4">
      <SubmitButtonWidget<typeof definition.DELETE>
        field={{
          icon: "folder-x",
          variant: "destructive",
          className: "w-full",
        }}
      />
    </Div>
  );
}
