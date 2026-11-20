"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  HelpGetRequestInput,
  HelpGetResponseOutput,
} from "next-vibe/help-tool/definition";
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
  serverState,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  initialHelpData?: HelpGetResponseOutput | null;
  serverState: Partial<HelpGetRequestInput>;
}): JSX.Element {
  const searchParams = useSearchParams();
  const logger = useLogger();

  const initialState = parseToolsInitialState(searchParams);
  const snapshotMatchesUrl =
    JSON.stringify(initialState) === JSON.stringify(serverState);
  const endpointOptions = {
    read: {
      initialState,
      initialData: snapshotMatchesUrl
        ? (initialHelpData ?? undefined)
        : undefined,
      formOptions: { persistForm: false, autoSubmit: false },
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
    <Div className="flex flex-col h-dvh w-full min-w-0">
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
