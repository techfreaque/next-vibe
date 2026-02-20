"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Server } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { ConnectionDetailResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: ConnectionDetailResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

export function ConnectionDetailContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const value = field.value;

  return (
    <Div className="flex flex-col gap-0 min-h-[200px]">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Server className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm">
          {value?.label ?? t("app.api.ssh.connections.id.widget.title")}
        </Span>
      </Div>
      {value && (
        <Div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <Span className="text-muted-foreground">
            {t("app.api.ssh.connections.id.widget.host")}
          </Span>
          <Span className="font-mono">{`${value.host}:${value.port}`}</Span>
          <Span className="text-muted-foreground">
            {t("app.api.ssh.connections.id.widget.user")}
          </Span>
          <Span className="font-mono">{value.username}</Span>
          <Span className="text-muted-foreground">
            {t("app.api.ssh.connections.id.widget.auth")}
          </Span>
          <Span>{value.authType}</Span>
          {value.notes && (
            <>
              <Span className="text-muted-foreground">
                {t("app.api.ssh.connections.id.widget.notes")}
              </Span>
              <Span>{value.notes}</Span>
            </>
          )}
        </Div>
      )}
    </Div>
  );
}
