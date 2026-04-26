/**
 * SSH Connections List Widget
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";

export function ConnectionsListContainer(): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const navigation = useWidgetNavigation();

  const connectionsData = useWidgetValue<typeof endpoints.GET>();
  const connections = connectionsData?.connections ?? [];

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const createDef = await import("../create/definition");
      navigation.push(createDef.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigation]);

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[400px]">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Server className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("widget.title")}
        </Span>
        <Button type="button" size="sm" onClick={handleCreate}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t("widget.addButton")}
        </Button>
      </Div>

      {/* List */}
      {connections.length === 0 ? (
        <Div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 px-8 text-center">
          <Server className="h-8 w-8 text-muted-foreground/40" />
          <P className="text-sm text-muted-foreground">
            {t("widget.emptyState")}
          </P>
        </Div>
      ) : (
        <Div className="flex flex-col divide-y overflow-y-auto flex-1">
          {connections.map((conn) => (
            <Div
              key={conn.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer"
              onClick={(): void => {
                void (async (): Promise<void> => {
                  const connDef = await import("../[id]/definition");
                  navigation.push(connDef.PATCH, {
                    urlPathParams: { id: conn.id },
                    getEndpoint: connDef.GET,
                    prefillFromGet: true,
                    renderInModal: true,
                    popNavigationOnSuccess: 1,
                  });
                })();
              }}
            >
              <Server className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Div className="flex flex-col min-w-0 flex-1">
                <Div className="flex items-center gap-2">
                  <Span className="text-sm font-medium truncate">
                    {conn.label}
                  </Span>
                  {conn.isDefault && (
                    <Span className="text-[10px] px-1.5 py-0.5 rounded bg-info/10 text-info">
                      {t("widget.defaultBadge")}
                    </Span>
                  )}
                </Div>
                <Span className="text-xs text-muted-foreground font-mono">
                  {conn.username}@{conn.host}:{conn.port}
                </Span>
              </Div>
              <Span className="text-xs text-muted-foreground">
                {t(conn.authType)}
              </Span>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}
