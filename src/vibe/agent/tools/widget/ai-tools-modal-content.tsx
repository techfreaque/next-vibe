"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import helpDefinitions from "next-vibe/help-tool/definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/ui/dialog";
import { Maximize } from "next-vibe/ui/ui/icons/Maximize";
import { Zap } from "next-vibe/ui/ui/icons/Zap";
import { Link } from "next-vibe/ui/ui/link";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { scopedTranslation } from "@/_pages/tools/i18n";

interface AIToolsModalContentProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

/**
 * AI Tools Modal Content
 * Renders the help endpoint widget (HelpToolsWidget) inside a dialog.
 * All tool toggle/search/navigation logic lives in the widget.
 */
export function AIToolsModalContent({
  locale,
  user,
  platform,
}: AIToolsModalContentProps): JSX.Element {
  const { t: toolsT } = scopedTranslation.scopedT(locale);

  return (
    <DialogContent className="sm:max-w-[750px] max-h-[90dvh] flex flex-col overflow-hidden p-0">
      <Link
        href={`/${locale}/tools`}
        className="absolute right-12 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        title={toolsT("openFullPage")}
      >
        <Maximize className="h-4 w-4" />
      </Link>

      <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
        <DialogTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {toolsT("modal.title")}
        </DialogTitle>
        <DialogDescription>{toolsT("modal.description")}</DialogDescription>
      </DialogHeader>

      <EndpointsPage
        endpoint={helpDefinitions}
        locale={locale}
        user={user}
        platform={platform}
        endpointOptions={{
          read: {
            queryOptions: {
              staleTime: 60 * 1000,
              refetchOnWindowFocus: false,
            },
          },
        }}
        className="flex-1 overflow-scroll max-h-[75dvh]"
      />
    </DialogContent>
  );
}
