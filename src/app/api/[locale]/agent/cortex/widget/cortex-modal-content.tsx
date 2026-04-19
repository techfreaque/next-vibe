"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Maximize } from "next-vibe-ui/ui/icons/Maximize";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import cortexListDefinitions from "@/app/api/[locale]/agent/cortex/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "@/app/[locale]/cortex/i18n";

interface CortexModalContentProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CortexModalContent({
  locale,
  user,
}: CortexModalContentProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <DialogContent className="sm:max-w-[750px] max-h-[90dvh] flex flex-col overflow-hidden p-0">
      <Link
        href={`/${locale}/cortex`}
        className="absolute right-12 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        title={t("openFullPage")}
      >
        <Maximize className="h-4 w-4" />
      </Link>

      <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
        <DialogTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t("modal.title")}
        </DialogTitle>
        <DialogDescription>{t("modal.description")}</DialogDescription>
      </DialogHeader>

      <EndpointsPage
        endpoint={cortexListDefinitions}
        locale={locale}
        user={user}
        endpointOptions={{
          read: {
            queryOptions: {
              staleTime: 0,
              refetchOnWindowFocus: false,
            },
          },
        }}
        className="flex-1 overflow-scroll max-h-[75dvh]"
      />
    </DialogContent>
  );
}
