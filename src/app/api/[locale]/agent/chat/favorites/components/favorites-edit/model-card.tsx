"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { ModelOption } from "@/app/api/[locale]/agent/models/models";
import { modelProviders } from "@/app/api/[locale]/agent/models/models";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ModelCardProps {
  model: ModelOption;
  isBest: boolean;
  selected: boolean;
  onClick: () => void;
  locale: CountryLanguage;
  dimmed?: boolean;
}

export function ModelCard({
  model,
  isBest,
  selected,
  onClick,
  locale,
  dimmed = false,
}: ModelCardProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all",
        "hover:bg-muted/50 hover:border-primary/30",
        selected && "bg-primary/10 border-primary/40 shadow-sm",
        dimmed && !selected && "opacity-40 hover:opacity-70",
      )}
    >
      <Div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <Icon icon={model.icon} className="h-4 w-4" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-1.5">
          <Span
            className={cn(
              "text-sm font-medium truncate",
              selected && "text-primary",
            )}
          >
            {model.name}
          </Span>
          {isBest && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.best")}
            </Badge>
          )}
        </Div>
        <Span className="text-[11px] text-muted-foreground">
          {modelProviders[model.provider]?.name ?? model.provider}
        </Span>
      </Div>

      <Div className="flex items-center gap-1.5 shrink-0">
        <Badge
          variant={selected ? "outline" : "secondary"}
          className="text-[10px] h-5"
        >
          {model.creditCost === 0
            ? t("app.chat.selector.free")
            : model.creditCost === 1
              ? t("app.chat.selector.creditsSingle")
              : t("app.chat.selector.creditsExact", { cost: model.creditCost })}
        </Badge>
        {selected && <Check className="h-4 w-4 text-primary" />}
      </Div>
    </Div>
  );
}
