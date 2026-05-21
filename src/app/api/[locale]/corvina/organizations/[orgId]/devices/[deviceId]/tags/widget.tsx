"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaDeviceTagsResponseOutput } from "./definition";

type DeviceTag = CorvinaDeviceTagsResponseOutput["tags"][number];

function TagRow({ tag }: { tag: DeviceTag }): React.JSX.Element {
  return (
    <Div className="flex items-center justify-between px-4 py-2 border-b last:border-b-0">
      <Span className="text-sm font-medium font-mono">{tag.name}</Span>
      <Span className="text-xs text-muted-foreground font-mono">
        {tag.value ?? "—"}
      </Span>
    </Div>
  );
}

export function DeviceTagsContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const tags = data?.tags ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Tag className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(500px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : tags.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Tag className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noTagsFound")}</Span>
          </Div>
        ) : (
          tags.map((tag) => <TagRow key={tag.id} tag={tag} />)
        )}
      </Div>
    </Div>
  );
}
