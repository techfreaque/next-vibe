/**
 * User Note Delete Widget
 * Confirmation and result for note deletion.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function UserNoteDeleteContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const listDef =
        await import("@/app/api/[locale]/user/notes/list/definition");
      navigation.push(listDef.default.GET, {});
    })();
  };

  if (!data) {
    return (
      <Div className="space-y-3">
        <Div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3">
          <Span className="text-sm text-destructive font-medium">
            {t("post.widget.warning")}
          </Span>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      <Div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {t("post.widget.deleted")}
      </Div>
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("post.widget.backToNotes")}
      </Button>
    </Div>
  );
}
