"use client";

/**
 * Renders the catalog's authorized overview through the endpoint registry.
 */

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { P } from "next-vibe/ui/components/typography";
import type { ComponentProps, JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { coreClientEnv } from "../core/env-client";
import { resolveEndpoint } from "../unified-ui/hooks/resolve-endpoint";
import { useEndpoint } from "../unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "../unified-ui/renderers/web/EndpointsPage";
import { type HelpT, scopedTranslation } from "./i18n";

type OverviewPageProps = Pick<
  ComponentProps<typeof EndpointsPage>,
  "logger" | "locale" | "user" | "platform" | "navigationOverride" | "className"
>;

async function loadOverviewEndpoint(
  alias: string,
): Promise<CreateApiEndpointAny | null> {
  const endpoint = await resolveEndpoint(alias).catch(() => null);
  if (endpoint || coreClientEnv.NODE_ENV === "production") {
    return endpoint;
  }
  const { getEndpoint } = await import("@/generated/endpoints/endpoint-dev");
  return getEndpoint(alias);
}

function OverviewLoading({ t }: { t: HelpT }): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4">
      <P className="text-sm text-muted-foreground">
        {t("erp.overview.loading")}
      </P>
      <Div className="grid grid-cols-2 gap-2 @4xl:grid-cols-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </Div>
    </Div>
  );
}

function OverviewError({
  t,
  onRetry,
}: {
  t: HelpT;
  onRetry: () => void;
}): JSX.Element {
  return (
    <EmptyBlock
      className="rounded-lg border bg-card py-5"
      title={t("erp.overview.loadError")}
      action={{ label: t("catalog.retry"), onClick: onRetry }}
    />
  );
}

function CompanyOverview({
  endpoint,
  pageProps,
  companyId,
  t,
}: {
  endpoint: CreateApiEndpointAny;
  pageProps: OverviewPageProps;
  companyId: string;
  t: HelpT;
}): JSX.Element {
  const definition = useMemo(() => ({ GET: endpoint }), [endpoint]);
  const options = useMemo(
    () => ({
      read: {
        initialState: { companyId },
        formOptions: { autoSubmit: true, persistForm: false },
      },
    }),
    [companyId],
  );
  const endpointInstance = useEndpoint(
    definition,
    options,
    pageProps.logger,
    pageProps.user,
  );
  const read = endpointInstance.read;
  if (read?.isFetching && read.response?.success !== true) {
    return <OverviewLoading t={t} />;
  }
  if (read?.response?.success === false || read?.error) {
    return <OverviewError t={t} onRetry={() => void read?.refetch()} />;
  }
  if (!read?.response?.success) {
    return <OverviewLoading t={t} />;
  }

  return (
    <EndpointsPage
      {...pageProps}
      endpoint={definition}
      endpointInstance={endpointInstance}
      endpointOptions={{
        read: {
          initialState: { companyId },
          queryOptions: { enabled: false },
          formOptions: { autoSubmit: false, persistForm: false },
        },
      }}
      responseOnly
      className="flex min-w-0 flex-col"
    />
  );
}

export function CatalogOverview({
  alias,
  pageProps,
  companyId,
}: {
  alias: string;
  pageProps: OverviewPageProps;
  companyId?: string;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(pageProps.locale);
  const [attempt, setAttempt] = useState(0);
  const [resolved, setResolved] = useState<{
    alias: string;
    attempt: number;
    endpoint: CreateApiEndpointAny | null;
  } | null>(null);

  useEffect(() => {
    let active = true;
    void loadOverviewEndpoint(alias)
      .catch(() => null)
      .then((endpoint) => {
        if (active) {
          setResolved({ alias, attempt, endpoint });
        }
        return undefined;
      });
    return (): void => {
      active = false;
    };
  }, [alias, attempt]);

  if (!resolved || resolved.alias !== alias || resolved.attempt !== attempt) {
    return companyId ? <OverviewLoading t={t} /> : <LoadingBlock />;
  }
  if (!resolved.endpoint || resolved.endpoint.method !== "GET") {
    return companyId ? (
      <OverviewError t={t} onRetry={() => setAttempt((value) => value + 1)} />
    ) : null;
  }
  if (companyId) {
    return (
      <CompanyOverview
        key={companyId}
        endpoint={resolved.endpoint}
        pageProps={pageProps}
        companyId={companyId}
        t={t}
      />
    );
  }
  return (
    <EndpointsPage
      {...pageProps}
      endpoint={{ GET: resolved.endpoint }}
      className="flex min-w-0 flex-col"
    />
  );
}
