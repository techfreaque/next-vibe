"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { useWidgetTranslation } from "next-vibe/unified-ui/_shared/use-widget-context";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definitions from "./definition";

type RemoveFileDefinition = (typeof definitions)["DELETE"];

interface RemoveFileWidgetProps {
  field: RemoveFileDefinition["fields"];
}

/** Remove knowledge file confirmation - one sentence, back + remove. */
export function FolderProjectRemoveFileContainer({
  field: { children },
}: RemoveFileWidgetProps): JSX.Element {
  const t = useWidgetTranslation<RemoveFileDefinition>();
  return (
    <Div className="flex flex-col gap-4 p-4 sm:p-6">
      <Span className="text-sm text-muted-foreground">
        {t("delete.container.description")}
      </Span>
      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<RemoveFileDefinition> field={children.submitButton} />
    </Div>
  );
}
