"use client";

import { useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";

import type {
  HelpGetRequestInput,
  HelpGetResponseOutput,
} from "@/app/api/[locale]/system/help/definition";
import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { useLogger } from "@/hooks/use-logger";
import type { CountryLanguage } from "@/i18n/core/config";

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

  const endpointOptions = useMemo(
    () => {
      const initialState = parseInitialState(searchParams);
      const useInitialData =
        !initialState.category &&
        (!initialState.statsFilter || initialState.statsFilter === "webPinned");
      return {
        read: {
          initialState,
          initialData: useInitialData
            ? (initialHelpData ?? undefined)
            : undefined,
          queryOptions: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
