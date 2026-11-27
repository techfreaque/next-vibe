"use client";

import installerEndpoints from "next-vibe/env/installer/definition";
import { Div } from "next-vibe/ui/components/div";
import { Main } from "next-vibe/ui/components/main";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { Logo } from "@/_pages/_components/logo";

import type { InstallPageData } from "./page";

export function InstallPageClient({
  locale,
  user,
  platform,
  initialData,
}: InstallPageData): JSX.Element {
  const logger = useLogger();
  return (
    <Main className="flex min-h-screen flex-col bg-background">
      <Div className="flex flex-1 flex-col items-center px-4 pb-12 pt-8 sm:pt-14">
        <Div className="mb-8 flex justify-center">
          <Logo locale={locale} size="h-9" disabled />
        </Div>
        <Div className="w-full max-w-xl">
          <EndpointsPage
            logger={logger}
            endpoint={installerEndpoints}
            locale={locale}
            user={user}
            platform={platform}
            endpointOptions={{
              read: {
                initialData,
              },
            }}
          />
        </Div>
      </Div>
    </Main>
  );
}
