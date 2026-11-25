"use client";

import { Button } from "next-vibe/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronDownIcon } from "next-vibe/ui/components/icons/ChevronDownIcon";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import type { WorkspaceCompany } from "@/companies/_shared/workspace-company";

import type { HelpT } from "./i18n";

export function ErpCompanySwitch({
  t,
  activeCompany,
  companies,
  onSelect,
  onBrowse,
}: {
  t: HelpT;
  activeCompany?: WorkspaceCompany;
  companies: readonly WorkspaceCompany[];
  onSelect?: (companyId: string) => void;
  onBrowse?: () => void;
}): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          disabled={!onSelect && !onBrowse}
          variant="outline"
          size="sm"
          className="max-w-[calc(100vw-8rem)] justify-start min-[930px]:max-w-80"
          aria-label={
            activeCompany
              ? t("erp.companySwitch.current", { name: activeCompany.name })
              : t("erp.companySwitch.select")
          }
        >
          <Building className="size-4 shrink-0" aria-hidden="true" />
          <Span className="min-w-0 truncate">
            {activeCompany?.name ?? t("erp.companySwitch.select")}
          </Span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-72 w-72 max-w-[calc(100vw-2rem)] overflow-y-auto"
      >
        {onSelect && (
          <>
            <DropdownMenuLabel>
              {t("erp.companySwitch.label")}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={activeCompany?.id ?? ""}
              onValueChange={onSelect}
            >
              {companies.map(({ id, name, currency }) => (
                <DropdownMenuRadioItem key={id} value={id} className="gap-2">
                  <Span className="min-w-0 flex-1 break-words">{name}</Span>
                  {currency && (
                    <Span className="shrink-0 text-xs text-muted-foreground">
                      {currency}
                    </Span>
                  )}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
        {onBrowse && (
          <>
            {onSelect && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={onBrowse}>
              {t("catalog.browse")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
