"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft, ChevronRight } from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { definitionsRegistry } from "../../../unified-interface/shared/endpoints/definitions/registry";
import { Platform } from "../../../unified-interface/shared/types/platform";

type GroupingMode = "category" | "tags" | "path";

interface HelpInteractiveViewProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialEndpointId?: string;
}

/**
 * Tree node for nested path structure
 */
interface PathTreeNode {
  name: string;
  endpoints: CreateApiEndpointAny[];
  children: Record<string, PathTreeNode>;
}

/**
 * Build a tree structure from endpoint paths
 */
function buildPathTree(endpoints: CreateApiEndpointAny[]): PathTreeNode {
  const root: PathTreeNode = { name: "root", endpoints: [], children: {} };

  for (const ep of endpoints) {
    let current = root;
    for (let i = 0; i < ep.path.length; i++) {
      const segment = ep.path[i];
      if (!current.children[segment]) {
        current.children[segment] = {
          name: segment,
          endpoints: [],
          children: {},
        };
      }
      current = current.children[segment];

      // Add endpoint at its final path segment
      if (i === ep.path.length - 1) {
        current.endpoints.push(ep);
      }
    }
  }

  return root;
}

/**
 * Generate endpoint ID from endpoint (path_parts_METHOD)
 * Format: browser_handle-dialog_POST or system_setup_status_POST
 */
function getEndpointId(ep: CreateApiEndpointAny): string {
  return `${ep.path.join("_")}_${ep.method}`;
}

/**
 * Helper function to wrap an endpoint in the format expected by EndpointsPage
 */
function wrapEndpoint(endpoint: CreateApiEndpointAny): {
  GET?: CreateApiEndpointAny;
  POST?: CreateApiEndpointAny;
  DELETE?: CreateApiEndpointAny;
} {
  const method = endpoint.method;
  if (method === "GET") {
    return { GET: endpoint };
  }
  if (method === "POST") {
    return { POST: endpoint };
  }
  if (method === "DELETE") {
    return { DELETE: endpoint };
  }
  // Default to POST if method is not recognized
  return { POST: endpoint };
}

/**
 * Help Interactive View Component
 * Browse and execute all ~140 endpoint definitions interactively
 */
/**
 * Recursive component to render nested path tree
 */
function PathTreeAccordion({
  node,
  locale,
  selectedEndpoint,
  handleSelectEndpoint,
  depth = 0,
}: {
  node: PathTreeNode;
  locale: CountryLanguage;
  selectedEndpoint: CreateApiEndpointAny | null;
  handleSelectEndpoint: (ep: CreateApiEndpointAny) => void;
  depth?: number;
}): JSX.Element {
  // oxlint-disable-next-line no-array-sort
  const childKeys = Object.keys(node.children).sort();
  const hasChildren = childKeys.length > 0;
  const hasEndpoints = node.endpoints.length > 0;

  return (
    <Div className={depth > 0 ? "pl-3 border-l border-gray-200 dark:border-gray-700" : ""}>
      {/* Render endpoints at this level */}
      {hasEndpoints && (
        <Div className="space-y-1 mb-2">
          {node.endpoints.map((ep) => {
            const endpointId = getEndpointId(ep);
            const isSelected = selectedEndpoint && getEndpointId(selectedEndpoint) === endpointId;

            return (
              <Link
                key={endpointId}
                href={`/${locale}/help/interactive/${encodeURIComponent(endpointId)}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectEndpoint(ep);
                }}
                className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Div className="flex items-center gap-2">
                  <Span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-12">
                    {ep.method}
                  </Span>
                  <Span className="font-medium truncate text-xs">{ep.path.at(-1)}</Span>
                </Div>
              </Link>
            );
          })}
        </Div>
      )}

      {/* Render child folders */}
      {hasChildren && (
        <Accordion type="multiple" defaultValue={[]} className="w-full">
          {childKeys.map((childKey) => {
            const child = node.children[childKey];
            const childCount = countEndpoints(child);

            return (
              <AccordionItem key={childKey} value={childKey} className="border-b-0">
                <AccordionTrigger className="py-1.5 text-sm hover:no-underline">
                  <Div className="flex items-center gap-2">
                    <Span className="font-medium text-gray-700 dark:text-gray-300">{childKey}</Span>
                    <Span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                      ({childCount})
                    </Span>
                  </Div>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <PathTreeAccordion
                    node={child}
                    locale={locale}
                    selectedEndpoint={selectedEndpoint}
                    handleSelectEndpoint={handleSelectEndpoint}
                    depth={depth + 1}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </Div>
  );
}

// Count total endpoints in this branch
const countEndpoints = (n: PathTreeNode): number => {
  let count = n.endpoints.length;
  for (const child of Object.values(n.children)) {
    count += countEndpoints(child);
  }
  return count;
};

export function HelpInteractiveView({
  locale,
  user,
  initialEndpointId,
}: HelpInteractiveViewProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("path");
  const [selectedEndpoint, setSelectedEndpoint] = useState<CreateApiEndpointAny | null>(null);
  // Sidebar is collapsed by default when viewing a specific endpoint, open otherwise
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(!!initialEndpointId);
  const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);

  // Fetch endpoints server-side with user permissions
  const endpoints = useMemo(
    () => (user ? definitionsRegistry.getEndpointsForUser(Platform.NEXT_PAGE, user, logger) : []),
    [user, logger],
  );

  // Create endpoint lookup map
  const endpointMap = useMemo(() => {
    const map = new Map<string, CreateApiEndpointAny>();
    for (const ep of endpoints) {
      map.set(getEndpointId(ep), ep);
    }
    return map;
  }, [endpoints]);

  // Set initial endpoint from URL
  useEffect(() => {
    if (initialEndpointId && !selectedEndpoint) {
      const ep = endpointMap.get(initialEndpointId);
      if (ep) {
        setSelectedEndpoint(ep);
      }
    }
  }, [initialEndpointId, endpointMap, selectedEndpoint]);

  // Handle endpoint selection with URL update
  const handleSelectEndpoint = useCallback(
    (ep: CreateApiEndpointAny) => {
      setSelectedEndpoint(ep);
      const endpointId = getEndpointId(ep);
      router.push(`/${locale}/help/interactive/${encodeURIComponent(endpointId)}`, {
        scroll: false,
      });
    },
    [locale, router],
  );

  // Filter endpoints based on search (searches keys and translated values)
  const filteredEndpoints = useMemo(() => {
    if (!searchQuery) {
      return endpoints;
    }
    const query = searchQuery.toLowerCase();
    return endpoints.filter((ep) => {
      const toolName = ep.path.join("_");
      const pathSlash = ep.path.join("/");

      // Search in path (both formats)
      if (toolName.toLowerCase().includes(query)) {
        return true;
      }
      if (pathSlash.toLowerCase().includes(query)) {
        return true;
      }

      // Search in title (key and translated)
      if (ep.title?.toLowerCase().includes(query)) {
        return true;
      }
      if (
        t(ep.title as TranslationKey)
          .toLowerCase()
          .includes(query)
      ) {
        return true;
      }

      // Search in description (key and translated)
      if (ep.description?.toLowerCase().includes(query)) {
        return true;
      }
      if (
        t(ep.description as TranslationKey)
          .toLowerCase()
          .includes(query)
      ) {
        return true;
      }

      // Search in category (key and translated)
      if (ep.category?.toLowerCase().includes(query)) {
        return true;
      }
      if (
        t(ep.category as TranslationKey)
          .toLowerCase()
          .includes(query)
      ) {
        return true;
      }

      // Search in aliases
      if (ep.aliases?.some((alias) => alias.toLowerCase().includes(query))) {
        return true;
      }

      // Search in tags (keys and translated)
      if (ep.tags?.some((tag) => tag.toLowerCase().includes(query))) {
        return true;
      }
      if (
        ep.tags?.some((tag) =>
          t(tag as TranslationKey)
            .toLowerCase()
            .includes(query),
        )
      ) {
        return true;
      }

      // Search in method
      if (ep.method.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [endpoints, searchQuery, t]);

  // Build path tree for nested navigation
  const pathTree = useMemo(() => {
    return buildPathTree(filteredEndpoints);
  }, [filteredEndpoints]);

  // Group endpoints based on selected grouping mode (for category and tags)
  const groupedEndpoints = useMemo(() => {
    if (groupingMode === "path") {
      return {}; // Path mode uses tree structure instead
    }

    const groups: Record<string, CreateApiEndpointAny[]> = {};

    for (const ep of filteredEndpoints) {
      let groupKey: string;

      switch (groupingMode) {
        case "tags":
          // Group by first tag, or "Uncategorized" if no tags
          groupKey = ep.tags && ep.tags.length > 0 ? ep.tags[0] : "Uncategorized";
          break;
        case "category":
        default:
          groupKey = ep.category;
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(ep);
    }

    // Sort groups alphabetically
    const sortedGroups: Record<string, CreateApiEndpointAny[]> = {};
    // oxlint-disable-next-line no-array-sort
    for (const key of Object.keys(groups).sort()) {
      sortedGroups[key] = groups[key];
    }

    return sortedGroups;
  }, [filteredEndpoints, groupingMode]);

  return (
    <Div className="min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4">
      <Div className="container max-w-7xl mx-auto">
        <Div className="text-center mb-12">
          <H1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-cyan-500 to-blue-600">
            {t("app.api.system.help.interactive.ui.title")}
          </H1>
          <P className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("app.api.system.help.interactive.ui.description")} {endpoints.length}{" "}
            {t("app.api.system.help.interactive.ui.availableEndpoints")}
          </P>
        </Div>

        <Div className="relative flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Endpoint list */}
          <Div
            className={`
              transition-all duration-300 ease-in-out
              ${isSidebarCollapsed ? "w-0 lg:w-0 overflow-hidden" : "w-full lg:w-80 xl:w-96"}
            `}
          >
            <Card className="sticky top-4">
              <CardContent className="mt-6">
                <Div className="flex items-center justify-between mb-4">
                  <P className="text-lg font-semibold">
                    {t("app.api.system.help.interactive.ui.endpointsLabel")}
                  </P>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsSidebarCollapsed(true)}
                    aria-label="Close sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </Div>

                {/* Search */}
                <Input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />

                {/* Grouping mode selector */}
                <Div className="flex gap-1 mb-4">
                  <Button
                    size="sm"
                    variant={groupingMode === "category" ? "default" : "ghost"}
                    onClick={() => setGroupingMode("category")}
                    className="text-xs"
                  >
                    {t("app.api.system.help.interactive.grouping.category")}
                  </Button>
                  <Button
                    size="sm"
                    variant={groupingMode === "tags" ? "default" : "ghost"}
                    onClick={() => setGroupingMode("tags")}
                    className="text-xs"
                  >
                    {t("app.api.system.help.interactive.grouping.tags")}
                  </Button>
                  <Button
                    size="sm"
                    variant={groupingMode === "path" ? "default" : "ghost"}
                    onClick={() => setGroupingMode("path")}
                    className="text-xs"
                  >
                    {t("app.api.system.help.interactive.grouping.path")}
                  </Button>
                </Div>

                {/* Endpoint list with accordion */}
                <Div className="max-h-150 overflow-y-auto">
                  {groupingMode === "path" ? (
                    /* Nested path tree view */
                    <PathTreeAccordion
                      node={pathTree}
                      locale={locale}
                      selectedEndpoint={selectedEndpoint}
                      handleSelectEndpoint={handleSelectEndpoint}
                    />
                  ) : (
                    /* Category/Tags flat accordion view */
                    <Accordion type="multiple" defaultValue={[]} className="w-full">
                      {Object.entries(groupedEndpoints).map(([group, eps]) => (
                        <AccordionItem key={group} value={group} className="border-b-0">
                          <AccordionTrigger className="py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:no-underline">
                            <Div className="flex items-center gap-2">
                              <Span>
                                {/* Both category and tags are translation keys */}
                                {t(group as TranslationKey)}
                              </Span>
                              <Span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                                ({eps.length})
                              </Span>
                            </Div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-2">
                            <Div className="space-y-1 pl-2">
                              {eps.map((ep) => {
                                const endpointId = getEndpointId(ep);
                                const toolName = ep.path.join("_");
                                const isSelected =
                                  selectedEndpoint &&
                                  getEndpointId(selectedEndpoint) === endpointId;

                                return (
                                  <Link
                                    key={endpointId}
                                    href={`/${locale}/help/interactive/${encodeURIComponent(endpointId)}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleSelectEndpoint(ep);
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                      isSelected
                                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    <Div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                      {ep.method}
                                    </Div>
                                    <Div className="font-medium truncate">
                                      {toolName.replaceAll("_", "/")}
                                    </Div>
                                    {ep.aliases && ep.aliases.length > 0 && (
                                      <Div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t("app.api.system.help.interactive.ui.aliasesLabel")}{" "}
                                        {ep.aliases.join(", ")}
                                      </Div>
                                    )}
                                  </Link>
                                );
                              })}
                            </Div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </Div>
              </CardContent>
            </Card>
          </Div>

          {/* Right content - Endpoint details and execution */}
          <Div className="flex-1 min-w-0">
            {/* Toggle button for collapsed sidebar */}
            {isSidebarCollapsed && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsSidebarCollapsed(false)}
                className="mb-4"
                aria-label="Open sidebar"
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                {t("app.api.system.help.interactive.ui.endpointsLabel")}
              </Button>
            )}

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
              <EndpointsPage
                key={getEndpointId(selectedEndpoint)}
                endpoint={wrapEndpoint(selectedEndpoint)}
                locale={locale}
                user={user}
                endpointOptions={{
                  queryOptions: {
                    enabled: selectedEndpoint.method.toUpperCase() === "GET",
                    refetchOnWindowFocus: false,
                    staleTime: 5 * 60 * 1000, // 5 minutes
                  },
                }}
              />
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
