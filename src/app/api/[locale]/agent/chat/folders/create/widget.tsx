/**
 * Custom Widget for Create Folder
 * Renders the create-folder form — used as modal content via EndpointsPage
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { type JSX } from "react";

import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { FolderCreateResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: FolderCreateResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function FolderCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  useWidgetForm<typeof definition.POST>();
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <TextFieldWidget
        field={children.folder.children.name}
        fieldName="folder.name"
      />

      <IconFieldWidget
        field={children.folder.children.icon}
        fieldName="folder.icon"
      />

      <SubmitButtonWidget
        field={{
          text: t(
            "app.api.agent.chat.folders.post.sections.folder.name.label",
          ) as string,
          loadingText: t(
            "app.api.agent.chat.folders.post.sections.folder.name.label",
          ) as string,
          icon: "folder-plus",
          variant: "primary",
          className: "w-full",
        }}
      />
    </Div>
  );
}
