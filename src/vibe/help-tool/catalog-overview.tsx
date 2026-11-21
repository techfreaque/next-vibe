"use client";

/**
 * Catalog overview: renders the report a category declares as
 * `catalogOverview` (src/<domain>/category.ts) at the top of the admin catalog
 * root. Fully dynamic: the alias comes from the generated category registry
 * and is resolved through the endpoint registry like any other tool.
 */

import { Div } from "next-vibe/ui/components/div";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import type { ComponentProps, JSX } from "react";
import { useEffect, useState } from "react";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { coreClientEnv } from "../core/env-client";
import { resolveEndpoint } from "../unified-ui/hooks/resolve-endpoint";
import { EndpointsPage } from "../unified-ui/renderers/web/EndpointsPage";

type OverviewPageProps = Pick<
  ComponentProps<typeof EndpointsPage>,
  "logger" | "locale" | "user" | "platform" | "navigationOverride" | "className"
>;

async function loadOverviewEndpoint(
  alias: string,
): Promise<CreateApiEndpointAny | null> {
  const endpoint = await resolveEndpoint(alias);
  if (endpoint || coreClientEnv.NODE_ENV === "production") {
    return endpoint;
  }
  const { getEndpoint } = await import("@/generated/endpoints/endpoint-dev");
  return getEndpoint(alias);
}

export function CatalogOverview({
  alias,
  pageProps,
}: {
  alias: string;
  pageProps: OverviewPageProps;
}): JSX.Element | null {
  const [resolved, setResolved] = useState<{
    alias: string;
    endpoint: CreateApiEndpointAny | null;
  } | null>(null);

  useEffect(() => {
    let active = true;
    void loadOverviewEndpoint(alias).then((endpoint) => {
      if (active) {
        setResolved({ alias, endpoint });
      }
      return undefined;
    });
    return (): void => {
      active = false;
    };
  }, [alias]);

  if (!resolved || resolved.alias !== alias) {
    return <LoadingBlock />;
  }
  if (!resolved.endpoint || resolved.endpoint.method !== "GET") {
    return null;
  }
  return (
    <Div className="flex min-w-0 flex-col">
      <EndpointsPage
        {...pageProps}
        endpoint={{ GET: resolved.endpoint }}
        className="flex min-w-0 flex-col"
      />
    </Div>
  );
}
