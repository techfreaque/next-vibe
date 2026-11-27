"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Input } from "next-vibe/ui/components/input";
import type { JSX } from "react";
import { useState } from "react";

import type { HelpT } from "./i18n";

export function RecordSearch({
  targets,
  onSearch,
  t,
}: {
  targets: readonly { label: string; alias: string; field: string }[];
  onSearch: (alias: string, field: string, value: string) => void;
  t: HelpT;
}): JSX.Element {
  const [draft, setDraft] = useState("");
  const value = draft.trim();

  return (
    <Div className="flex flex-wrap items-end gap-2">
      <Input
        type="text"
        value={draft}
        autoComplete="off"
        maxLength={200}
        onChange={(event) => setDraft(event.target.value)}
        aria-label={t("catalog.recordPlaceholder")}
        placeholder={t("catalog.recordPlaceholder")}
        className="min-w-0 basis-56 grow"
      />
      {targets.map((target) => (
        <Button
          key={`${target.alias}:${target.field}`}
          type="button"
          variant="outline"
          disabled={!value}
          onClick={() => onSearch(target.alias, target.field, value)}
        >
          {target.label}
          <ArrowRight className="size-4" />
        </Button>
      ))}
    </Div>
  );
}
