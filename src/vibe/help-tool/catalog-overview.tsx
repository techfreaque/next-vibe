"use client";

/**
 * Renders the catalog's authorized overview through the endpoint registry.
 */

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { P } from "next-vibe/ui/components/typography";
import type { ComponentProps, JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { coreClientEnv } from "../core/env-client";
import { resolveEndpoint } from "../unified-ui/hooks/resolve-endpoint";
import { useEndpoint } from "../unified-ui/hooks/use-endpoint";
import { preloadEndpointWidget } from "../unified-ui/hooks/use-navigation-stack";
import { EndpointsPage } from "../unified-ui/renderers/web/EndpointsPage";
import { type HelpT, scopedTranslation } from "./i18n";

type OverviewPageProps = Pick<
  ComponentProps<typeof EndpointsPage>,
  "logger" | "locale" | "user" | "platform" | "navigationOverride" | "className"
>;

async function loadOverviewEndpoint(
  alias: string,
): Promise<CreateApiEndpointAny | null> {
  let endpoint = await resolveEndpoint(alias).catch(() => null);
  if (!endpoint && coreClientEnv.NODE_ENV !== "production") {
    const { getEndpoint } = await import("@/generated/endpoints/endpoint-dev");
    endpoint = await getEndpoint(alias);
  }
  if (endpoint) {
    await preloadEndpointWidget(endpoint);
  }
  return endpoint;
}

function OverviewLoading({
  t,
  company = true,
}: {
  t: HelpT;
  company?: boolean;
}): JSX.Element {
  return (
    <Div
      aria-busy={true}
      className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4"
    >
      <P className="text-sm text-muted-foreground">
        {t(company ? "erp.overview.loading" : "aiTools.modal.loading")}
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
  company = true,
}: {
  t: HelpT;
  onRetry: () => void;
  company?: boolean;
}): JSX.Element {
  return (
    <EmptyBlock
      className="rounded-lg border bg-card py-5"
      title={t(company ? "erp.overview.loadError" : "admin.overviewLoadError")}
      action={{ label: t("catalog.retry"), onClick: onRetry }}
    />
  );
}

type ReportActionHandler = (
  reportAlias: string,
  companyId: string,
  actionAlias: string | undefined,
) => void;

const companyActionResponse = z.object({
  selectedCompanyId: z.string(),
  primaryActionAlias: z.string().optional(),
});

function LoadedOverview({
  reportAlias,
  onReportAction,
  endpoint,
  pageProps,
  companyId,
  args,
  t,
}: {
  reportAlias: string;
  onReportAction?: ReportActionHandler;
  endpoint: CreateApiEndpointAny;
  pageProps: OverviewPageProps;
  companyId?: string;
  args?: Record<string, string>;
  t: HelpT;
}): JSX.Element {
  const definition = useMemo(() => ({ GET: endpoint }), [endpoint]);
  const options = useMemo(
    () => ({
      read: {
        initialState: { ...args, ...(companyId ? { companyId } : {}) },
        formOptions: { autoSubmit: true, persistForm: false },
      },
    }),
    [companyId, args],
  );
  const endpointInstance = useEndpoint(
    definition,
    options,
    pageProps.logger,
    pageProps.user,
  );
  const read = endpointInstance.read;
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const settled = read?.response !== undefined;
  const actionResponse =
    onReportAction && read?.response?.success
      ? companyActionResponse.safeParse(read.response.data)
      : undefined;
  const actionAlias =
    actionResponse?.success &&
    actionResponse.data.selectedCompanyId === companyId
      ? actionResponse.data.primaryActionAlias
      : undefined;
  useEffect(() => {
    if (companyId) {
      onReportAction?.(reportAlias, companyId, actionAlias);
    }
  }, [actionAlias, companyId, onReportAction, reportAlias]);
  useEffect(() => {
    if (settled) {
      return;
    }
    const timer = setTimeout(() => setElapsed(cycle), 12000);
    return (): void => clearTimeout(timer);
  }, [cycle, settled]);
  const retry = (): void => {
    setCycle((value) => value + 1);
    void read?.refetch();
  };
  if (!settled && elapsed === cycle) {
    return <OverviewError t={t} company={!!companyId} onRetry={retry} />;
  }
  if (read?.isFetching && read.response?.success !== true) {
    return <OverviewLoading t={t} company={!!companyId} />;
  }
  if (read?.response?.success === false || read?.error) {
    return <OverviewError t={t} company={!!companyId} onRetry={retry} />;
  }
  if (!read?.response?.success) {
    return <OverviewLoading t={t} company={!!companyId} />;
  }

  return (
    <EndpointsPage
      {...pageProps}
      endpoint={definition}
      endpointInstance={endpointInstance}
      endpointOptions={{
        read: {
          initialState: { ...args, ...(companyId ? { companyId } : {}) },
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
  progressive = false,
  onReportAction,
  args,
}: {
  alias: string;
  pageProps: OverviewPageProps;
  companyId?: string;
  progressive?: boolean;
  onReportAction?: ReportActionHandler;
  args?: Record<string, string>;
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
    const timeout = setTimeout(() => {
      if (active) {
        setResolved({ alias, attempt, endpoint: null });
      }
      active = false;
    }, 12000);
    void loadOverviewEndpoint(alias)
      .catch(() => null)
      .then((endpoint) => {
        clearTimeout(timeout);
        if (active) {
          setResolved({ alias, attempt, endpoint });
        }
        return undefined;
      });
    return (): void => {
      active = false;
      clearTimeout(timeout);
    };
  }, [alias, attempt]);

  if (!resolved || resolved.alias !== alias || resolved.attempt !== attempt) {
    return <OverviewLoading t={t} company={!!companyId} />;
  }
  if (!resolved.endpoint || resolved.endpoint.method !== "GET") {
    return (
      <OverviewError
        t={t}
        company={!!companyId}
        onRetry={() => setAttempt((value) => value + 1)}
      />
    );
  }
  if (progressive && !onReportAction) {
    return (
      <EndpointsPage
        {...pageProps}
        endpoint={{ GET: resolved.endpoint }}
        responseOnly
        endpointOptions={{
          read: {
            initialState: { ...args, ...(companyId ? { companyId } : {}) },
            queryOptions: { enabled: false },
            formOptions: { autoSubmit: false, persistForm: false },
          },
        }}
        className="flex min-w-0 flex-col"
      />
    );
  }
  return (
    <LoadedOverview
      key={`${alias}:${companyId ?? ""}`}
      reportAlias={alias}
      onReportAction={onReportAction}
      endpoint={resolved.endpoint}
      args={args}
      pageProps={pageProps}
      companyId={companyId}
      t={t}
    />
  );
}
