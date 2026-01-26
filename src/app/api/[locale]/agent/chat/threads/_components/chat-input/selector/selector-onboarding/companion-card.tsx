"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CharacterListItem } from "@/app/api/[locale]/agent/chat/characters/definition";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CompanionCardProps {
  character: CharacterListItem;
  onSelect: () => void;
  isSelected: boolean;
  locale: CountryLanguage;
}

export function CompanionCard({
  character,
  onSelect,
  isSelected,
  locale,
}: CompanionCardProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div
      className={cn(
        "flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer",
        "hover:shadow-lg active:scale-[0.98]",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
        "group",
      )}
      onClick={onSelect}
    >
      {/* Avatar with selection indicator */}
      <Div className="flex justify-center mb-3 relative">
        <Div
          className={cn(
            "w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10",
            "flex items-center justify-center ring-2 transition-all shadow-sm overflow-hidden",
            isSelected
              ? "ring-primary"
              : "ring-transparent group-hover:ring-primary/40",
          )}
        >
          <Icon icon={character.icon} className="h-8 w-8 text-primary" />
        </Div>
        {isSelected && (
          <Div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Check className="h-4 w-4 text-primary-foreground" />
          </Div>
        )}
      </Div>

      {/* Name */}
      <Span className="text-lg font-bold text-center mb-2">
        {t(character.content.name)}
      </Span>

      {/* Tagline */}
      <Span className="text-sm font-medium text-primary text-center mb-2">
        {t(character.content.tagline)}
      </Span>
      {/* Description */}
      <P className="text-xs text-muted-foreground text-center leading-relaxed">
        {t(character.content.description)}
      </P>
    </Div>
  );
}
