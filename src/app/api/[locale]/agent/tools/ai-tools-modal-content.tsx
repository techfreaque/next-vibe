"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Zap } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AIToolsModalContentProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * AI Tools Modal Content
 * Renders the help endpoint widget (HelpToolsWidget) inside a dialog.
 * All tool toggle/search/navigation logic lives in the widget.
 */
export function AIToolsModalContent({
  locale,
  user,
}: AIToolsModalContentProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <DialogContent className="sm:max-w-[750px] max-h-[90dvh] flex flex-col overflow-hidden p-0">
      <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
        <DialogTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {t("app.chat.aiTools.modal.title")}
        </DialogTitle>
        <DialogDescription>
          {t("app.chat.aiTools.modal.description")}
        </DialogDescription>
      </DialogHeader>

      <EndpointsPage
        endpoint={helpDefinitions}
        locale={locale}
        user={user}
        endpointOptions={{
          read: {
            queryOptions: {
              staleTime: 60 * 1000,
              refetchOnWindowFocus: false,
            },
          },
        }}
        className="flex-1 overflow-hidden"
      />
    </DialogContent>
  );
}
