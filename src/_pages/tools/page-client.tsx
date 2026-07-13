"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  HelpGetRequestInput,
  HelpGetResponseOutput,
} from "next-vibe/help-tool/definition";
import helpDefinitions from "next-vibe/help-tool/definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { Div } from "next-vibe/ui/ui/div";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";

import { useLogger } from "@/_old/hooks/use-logger";

function parseInitialState(
  searchParams: ReturnType<typeof useSearchParams>,
): Partial<HelpGetRequestInput> {
  const state: Partial<HelpGetRequestInput> = { statsFilter: "webPinned" };

  const q = searchParams.get("q");
  if (q) {
    state.query = q;
  }

  const sf = searchParams.get("sf");
  if (
    sf === "pinned" ||
    sf === "allowed" ||
    sf === "all" ||
    sf === "webPinned" ||
    sf === "cliAllowed" ||
    sf === "mcpPinned" ||
    sf === "mcpAllowed"
  ) {
    state.statsFilter = sf;
  }

  if (searchParams.get("prod") === "1") {
    state.includeProdOnly = true;
  }

  const view = searchParams.get("view");
  if (
    view === UserPermissionRole.PUBLIC ||
    view === UserPermissionRole.CUSTOMER
  ) {
    state.viewAsRole = view;
  }

  const inst = searchParams.get("inst");
  if (inst) {
    state.instanceId = inst;
  }

  const cat = searchParams.get("cat");
  if (cat) {
    state.category = cat;
  }

  const p = searchParams.get("p");
  if (p) {
    const n = parseInt(p, 10);
    if (!isNaN(n) && n >= 1) {
      state.page = n;
    }
  }

  const ps = searchParams.get("ps");
  if (ps) {
    const n = parseInt(ps, 10);
    if (!isNaN(n) && n >= 1) {
      state.pageSize = n;
    }
  }

  return state;
}

export function ToolsPageClient({
  locale,
  user,
  initialHelpData,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialHelpData?: HelpGetResponseOutput | null;
}): JSX.Element {
  const searchParams = useSearchParams();
  const logger = useLogger();

  const initialState = parseInitialState(searchParams);
  const useInitialData =
    !initialState.category &&
    (!initialState.statsFilter || initialState.statsFilter === "webPinned");
  const endpointOptions = {
    read: {
      initialState,
      initialData: useInitialData ? (initialHelpData ?? undefined) : undefined,
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
        endpoint={helpDefinitions}
        locale={locale}
        user={user}
        endpointInstance={endpointInstance}
        endpointOptions={endpointOptions}
        className="flex flex-col flex-1 min-h-0 w-full"
      />
    </Div>
  );
}
