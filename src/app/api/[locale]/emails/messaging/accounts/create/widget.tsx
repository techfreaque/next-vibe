"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft, Plus } from "next-vibe-ui/ui/icons";
import React from "react";

import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type messagingAccountCreateEndpoints from "./definition";

export function MessagingAccountCreateContainer(): React.JSX.Element {
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof messagingAccountCreateEndpoints.POST>();

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
          {t("title")}
        </Button>
      </Div>
      <Div className="flex items-center gap-2">
        <Plus className="h-5 w-5" />
        <Div className="text-lg font-semibold">{t("title")}</Div>
      </Div>
    </Div>
  );
}
