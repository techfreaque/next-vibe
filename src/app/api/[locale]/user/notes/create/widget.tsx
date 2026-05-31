/**
 * User Notes Create Widget
 * Shows result after a note is created.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function UserNotesCreateContainer(): JSX.Element {
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
    return <Div />;
  }

  return (
    <Div className="space-y-4">
      <Div className="flex items-center gap-2 flex-wrap">
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          {t("post.widget.created")}
        </Badge>
      </Div>
      <Div className="text-sm text-muted-foreground">
        {t("post.widget.noteId")}: {data.id}
      </Div>
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("post.widget.backToNotes")}
      </Button>
    </Div>
  );
}
