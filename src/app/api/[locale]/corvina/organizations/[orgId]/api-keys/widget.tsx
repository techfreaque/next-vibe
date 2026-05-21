"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Key } from "next-vibe-ui/ui/icons/Key";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import {
  useWidgetContext,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { ApiKeysListResponseOutput } from "./definition";

type ApiKey = ApiKeysListResponseOutput["keys"][number];

function maskKey(key: string): string {
  if (key.length <= 4) {
    return key;
  }
  return `••••${key.slice(-4)}`;
}

function ApiKeyRow({ apiKey }: { apiKey: ApiKey }): React.JSX.Element {
  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Key className="h-4 w-4 text-primary" />
      </Div>
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-mono text-sm text-muted-foreground">
            {maskKey(apiKey.key)}
          </Span>
        </Div>
        <Div className="text-xs text-muted-foreground mt-0.5">
          <Span>{`user: ${apiKey.userId}`}</Span>
        </Div>
      </Div>
      <Span className="text-xs font-mono text-muted-foreground/60">
        #{apiKey.id}
      </Span>
    </Div>
  );
}

export function ApiKeysListContainer(): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const keys = data?.keys ?? [];
  const isLoading = data === undefined;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Key className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {keys.length > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({keys.length})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title="Refresh"
        >
          <Key className="h-4 w-4" />
        </Button>
      </Div>
      <Div className="overflow-y-auto max-h-[min(500px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            {t("get.widget.loading")}
          </Div>
        ) : keys.length === 0 ? (
          <Div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            {t("get.widget.noKeysFound")}
          </Div>
        ) : (
          keys.map((k) => <ApiKeyRow key={k.id} apiKey={k} />)
        )}
      </Div>
    </Div>
  );
}
