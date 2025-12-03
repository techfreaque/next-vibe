"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import { useMemo, useState } from "react";
import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { useApiForm } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation-form";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

interface HelpInteractiveViewProps {
  locale: CountryLanguage;
  endpoints: CreateApiEndpointAny[];
}

/**
 * Endpoint Executor Component
 * Renders a single endpoint with form and results
 * Widgets decide what to show based on data state
 */
function EndpointExecutor({
  endpoint,
  locale,
}: {
  endpoint: CreateApiEndpointAny;
  locale: CountryLanguage;
}): JSX.Element {
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const [responseData, setResponseData] = useState<Record<
    string,
    WidgetData
  > | null>(null);

  const { form, submitForm, isSubmitting, submitError } = useApiForm(
    endpoint,
    logger,
    { persistForm: false },
    {
      onSuccess: ({ responseData: data }) => {
        setResponseData(data as Record<string, WidgetData>);
      },
    },
  );

  return (
    <Div className="space-y-6">
      {/* Endpoint info */}
      <Card>
        <CardContent className="mt-6">
          <Div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-mono font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
              {endpoint.method}
            </span>
            <P className="font-mono text-sm text-gray-600 dark:text-gray-400">
              {Array.isArray(endpoint.path)
                ? endpoint.path.join("/")
                : endpoint.path}
            </P>
          </Div>
          {endpoint.title && (
            <H2 className="text-xl font-bold mb-2">{endpoint.title}</H2>
          )}
          {endpoint.description && (
            <P className="text-gray-600 dark:text-gray-400">
              {endpoint.description}
            </P>
          )}
        </CardContent>
      </Card>

      {/* Single renderer - widgets decide what to show based on data */}
      <Card>
        <CardContent className="mt-6">
          <EndpointRenderer
            endpoint={endpoint}
            form={form}
            onSubmit={submitForm}
            data={responseData ?? undefined}
            locale={locale}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Error */}
      {submitError && (
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardContent className="mt-6">
            <P className="text-red-600 dark:text-red-400">
              {submitError.message}
            </P>
          </CardContent>
        </Card>
      )}
    </Div>
  );
}

/**
 * Help Interactive View Component
 * Browse and execute all ~140 endpoint definitions interactively
 */
export function HelpInteractiveView({
  locale,
  endpoints,
}: HelpInteractiveViewProps): JSX.Element {
  const { t } = simpleT(locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<CreateApiEndpointAny | null>(null);

  // Use endpoints passed from server (already filtered by user permissions)
  const allEndpoints = useMemo(() => {
    return endpoints;
  }, [endpoints]);

  // Filter endpoints based on search
  const filteredEndpoints = useMemo(() => {
    if (!searchQuery) {
      return allEndpoints;
    }
    const query = searchQuery.toLowerCase();
    return allEndpoints.filter((ep) => {
      const toolName = ep.path.join("_");
      return (
        toolName.toLowerCase().includes(query) ||
        ep.title?.toLowerCase().includes(query) ||
        ep.description?.toLowerCase().includes(query) ||
        ep.category?.toLowerCase().includes(query)
      );
    });
  }, [allEndpoints, searchQuery]);

  // Group by category
  const groupedEndpoints = useMemo(() => {
    const groups: Record<string, CreateApiEndpointAny[]> = {};
    for (const ep of filteredEndpoints) {
      const category = ep.category || "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(ep);
    }
    return groups;
  }, [filteredEndpoints]);

  return (
    <Div className="min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4">
      <Div className="container max-w-7xl mx-auto">
        <Div className="text-center mb-12">
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-cyan-500 to-blue-600">
            {t("app.api.system.help.interactive.ui.title")}
          </H1>
          <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("app.api.system.help.interactive.ui.description")}{" "}
            {allEndpoints.length}{" "}
            {t("app.api.system.help.interactive.ui.availableEndpoints")}
          </P>
        </Div>

        <Div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Endpoint list */}
          <Div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="mt-6">
                <H2 className="text-lg font-semibold mb-4">
                  {t("app.api.system.help.interactive.ui.endpointsLabel")}
                </H2>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />

                {/* Endpoint list */}
                <Div className="max-h-[600px] overflow-y-auto space-y-4">
                  {Object.entries(groupedEndpoints).map(([category, eps]) => (
                    <Div key={category}>
                      <P className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        {category}
                      </P>
                      <Div className="space-y-1">
                        {eps.map((ep, idx) => {
                          const toolName = ep.path.join("_");
                          const selectedToolName = selectedEndpoint
                            ? selectedEndpoint.path.join("_")
                            : null;
                          return (
                            <button
                              key={`${toolName}-${idx}`}
                              onClick={() => {
                                setSelectedEndpoint(ep);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedToolName === toolName
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <Div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                {ep.method}
                              </Div>
                              <Div className="font-medium truncate">
                                {toolName.replace(/_/g, "/")}
                              </Div>
                              {ep.aliases && ep.aliases.length > 0 && (
                                <Div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {t(
                                    "app.api.system.help.interactive.ui.aliasesLabel",
                                  )}{" "}
                                  {ep.aliases.join(", ")}
                                </Div>
                              )}
                            </button>
                          );
                        })}
                      </Div>
                    </Div>
                  ))}
                </Div>
              </CardContent>
            </Card>
          </Div>

          {/* Right content - Endpoint details and execution */}
          <Div className="lg:col-span-2">
            {!selectedEndpoint && (
              <Card>
                <CardContent className="mt-6 text-center py-12">
                  <P className="text-gray-500 dark:text-gray-400">
                    {t("app.api.system.help.interactive.ui.selectEndpoint")}
                  </P>
                </CardContent>
              </Card>
            )}

            {selectedEndpoint && (
              <EndpointExecutor endpoint={selectedEndpoint} locale={locale} />
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
