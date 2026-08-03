"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  HelpGetRequestInput,
  HelpGetResponseOutput,
} from "next-vibe/help-tool/definition";
import helpDefinitions from "next-vibe/help-tool/definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { Platform } from "next-vibe/platforms/platforms";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { Div } from "next-vibe/ui/ui/div";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useRef } from "react";

function parseInitialState(
  searchParams: ReturnType<typeof useSearchParams>,
): Partial<HelpGetRequestInput> {
  const cat = searchParams.get("cat");

  // Admin two-pane layout: sidebar loads tools by category (when cat= is in URL)
  // or shows the full webPinned list (no category filter). The selected tool is
  // resolved from the URL path by the widget's mount effect — never sent as toolName,
  // because that would cause a single-tool response and an empty sidebar on refresh.
  const state: Partial<HelpGetRequestInput> = cat
    ? { category: cat }
    : { statsFilter: "webPinned" };

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

export function ToolDetailPageClient({
  locale,
  user,
  platform,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  toolAlias: string;
  initialHelpData?: HelpGetResponseOutput | null;
}): JSX.Element {
  const searchParams = useSearchParams();
  const logger = useLogger();

  interface EndpointOptions {
    read: {
      initialState: Partial<HelpGetRequestInput>;
      initialData: HelpGetResponseOutput | undefined;
      queryOptions: { staleTime: number; refetchOnWindowFocus: boolean };
    };
  }
  const endpointOptionsRef = useRef<EndpointOptions | null>(null);
  if (endpointOptionsRef.current === null) {
    const initialState = parseInitialState(searchParams);
    // SSR initialData was always fetched by toolName (single-tool response) —
    // wrong shape for the sidebar which needs all tools in the category or webPinned
    // set. Never seed it; let the client fetch the correct list.
    endpointOptionsRef.current = {
      read: {
        initialState,
        initialData: undefined,
        queryOptions: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    };
  }
  const endpointOptions = endpointOptionsRef.current;

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
        platform={platform}
        endpointInstance={endpointInstance}
        endpointOptions={endpointOptions}
        className="flex flex-col flex-1 min-h-0 w-full"
      />
    </Div>
  );
}
