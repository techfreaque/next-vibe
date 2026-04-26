"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Link } from "next-vibe-ui/ui/link";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import cortexListDefinitions from "@/app/api/[locale]/agent/cortex/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface CortexPageClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CortexPageClient({
  locale,
  user,
}: CortexPageClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="bg-background min-h-screen">
      <Div className="container max-w-3xl mx-auto py-8 px-4">
        <Link
          href={`/${locale}/threads/private/new`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("backToChat")}
        </Link>

        <Div className="flex items-center gap-3 mb-1">
          <Div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </Div>
          <H1 className="text-2xl font-bold">{t("title")}</H1>
        </Div>
        <P className="text-muted-foreground text-sm mb-8">{t("description")}</P>

        <Div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <EndpointsPage
            endpoint={cortexListDefinitions}
            locale={locale}
            user={user}
            endpointOptions={{
              read: {
                queryOptions: {
                  staleTime: 0,
                  refetchOnWindowFocus: true,
                },
              },
            }}
          />
        </Div>
      </Div>
    </Div>
  );
}
