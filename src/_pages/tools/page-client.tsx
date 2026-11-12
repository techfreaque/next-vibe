"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { HelpGetResponseOutput } from "next-vibe/help-tool/definition";
import helpDefinitions from "next-vibe/help-tool/definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { parseToolsInitialState } from "./initial-state";

export function ToolsPageClient({
  locale,
  user,
  platform,
  initialHelpData,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  initialHelpData?: HelpGetResponseOutput | null;
}): JSX.Element {
  const searchParams = useSearchParams();
  const logger = useLogger();

  const initialState = parseToolsInitialState(searchParams);
  // The SSR snapshot is the default view only (webPinned, page 1, no filters).
  // Any URL filter (?q, ?cat, ?p, ?ps, ?inst, ?prod, ?view) must fetch - seeding
  // the default snapshot would render the unfiltered list under a filtered URL.
  const isDefaultView = Object.entries(initialState).every(
    ([key, value]) => key === "statsFilter" && value === "webPinned",
  );
  const endpointOptions = {
    read: {
      initialState,
      initialData: isDefaultView ? (initialHelpData ?? undefined) : undefined,
      queryOptions: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  };

  const endpointInstance = useEndpoint(
    helpDefinitions,
    endpointOptions,
    logger,
    user,
  );

  return (
    <Div className="flex flex-col h-dvh w-full">
      <EndpointsPage
        logger={logger}
        endpoint={helpDefinitions}
        locale={locale}
        user={user}
        platform={platform}
        endpointInstance={endpointInstance}
        endpointOptions={endpointOptions}
        className="flex flex-col flex-1 min-h-0 w-full"
      />
    </Div>
  );
}
