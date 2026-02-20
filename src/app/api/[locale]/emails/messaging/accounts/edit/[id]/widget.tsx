"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft, Edit } from "next-vibe-ui/ui/icons";
import React from "react";

import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

export function MessagingAccountEditContainer(): React.JSX.Element {
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/${locale}/admin/emails/messaging/accounts`)
          }
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("app.api.emails.messaging.accounts.list.title")}
        </Button>
      </Div>
      <Div className="flex items-center gap-2">
        <Edit className="h-5 w-5" />
        <Div className="text-lg font-semibold">
          {t("app.api.emails.messaging.accounts.edit.id.put.title")}
        </Div>
      </Div>
    </Div>
  );
}
