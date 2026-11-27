"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useState } from "react";
import { z } from "zod";

import { AccountSubtype } from "@/chart-of-accounts/enum";

import { scopedTranslation } from "./i18n";

const accountSelection = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  name: z.string(),
  subtype: z.string(),
  code: z.string(),
  isActive: z.boolean(),
});

export function BankAccountPicker({
  companyId,
  accountId,
  accountName,
  onSelect,
}: {
  companyId?: string;
  accountId?: string;
  accountName?: string | null;
  onSelect(id: string): void;
}): JSX.Element {
  const { push } = useWidgetNavigation();
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  const [picked, setPicked] = useState<{ id: string; name: string }>();
  const [selectionRejected, setSelectionRejected] = useState(false);
  const label =
    (picked?.id === accountId ? picked?.name : accountName) ??
    t("fields.account");

  const open = (): void => {
    if (!companyId) {
      return;
    }
    void (async (): Promise<void> => {
      const { default: definition } =
        await import("@/chart-of-accounts/account/list/definition");
      push(definition.GET, {
        data: {
          companyId,
          postableOnly: true,
          subtypes: [AccountSubtype.BANK],
        },
        renderInModal: true,
        pickerLabelField: "name",
        pickerCallback: (candidate) => {
          const parsed = accountSelection.safeParse(candidate);
          if (
            !parsed.success ||
            parsed.data.companyId !== companyId ||
            parsed.data.subtype !== AccountSubtype.BANK ||
            !parsed.data.isActive
          ) {
            setSelectionRejected(true);
            return;
          }
          setSelectionRejected(false);
          setPicked({
            id: parsed.data.id,
            name: `${parsed.data.code} · ${parsed.data.name}`,
          });
          onSelect(parsed.data.id);
        },
      });
    })();
  };

  return (
    <Div className="flex min-w-0 flex-col gap-1.5">
      <Button
        type="button"
        variant="outline"
        disabled={!companyId}
        aria-label={t("fields.account")}
        onClick={open}
        className="w-fit max-w-full whitespace-normal"
      >
        {label}
      </Button>
      {selectionRejected && (
        <P className="text-sm text-destructive">
          {t("errors.validation.description")}
        </P>
      )}
    </Div>
  );
}
