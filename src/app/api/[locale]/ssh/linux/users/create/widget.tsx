/**
 * Linux User Create Widget
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { UserPlus } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import {
  useWidgetContext,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

export function LinuxUserCreateContainer(): React.JSX.Element {
  const t = useWidgetTranslation();
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const handleCreate = useCallback((): void => {
    onSubmit?.();
  }, [onSubmit]);

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[200px]">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <UserPlus className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("app.api.ssh.linux.users.create.widget.title")}
        </Span>
        <Button
          type="button"
          size="sm"
          onClick={handleCreate}
          disabled={isLoading}
        >
          {isLoading
            ? t("app.api.ssh.linux.users.create.widget.creating")
            : t("app.api.ssh.linux.users.create.widget.createButton")}
        </Button>
      </Div>
    </Div>
  );
}
