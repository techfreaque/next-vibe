/**
 * Interactive Help Navigator (Ink-based)
 *
 * Full-screen terminal UI for browsing and executing endpoints.
 * Uses ink + ink-select-input for reactive navigation (replaces inquirer prompts).
 *
 * Views:
 *   1. Category list - grouped tool overview with counts
 *   2. Tool list - tools within a category (or all)
 *   3. Tool detail - full endpoint info rendered via InkEndpointRenderer
 *   4. Execution result - endpoint response rendered via InkEndpointRenderer
 */

import { Box, render, Text, useApp, useInput } from "ink";
import SelectInput from "ink-select-input";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointMeta } from "@/app/api/[locale]/system/generated/endpoints-meta/en";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as cliScopedTranslation } from "../unified-interface/cli/i18n";
import type { CliCompatiblePlatform } from "../unified-interface/cli/runtime/route-executor";
import { permissionsRegistry } from "../unified-interface/shared/endpoints/permissions/registry";
import type { InkEndpointRenderer } from "../unified-interface/unified-ui/renderers/cli/CliEndpointRenderer";

type InkEndpointRendererType = typeof InkEndpointRenderer;

// Lazy imports to avoid server-only issues at module level
let InkEndpointRendererModule: Awaited<
  ReturnType<typeof getInkEndpointRenderer>
> | null = null;

async function getInkEndpointRenderer(): Promise<{
  InkEndpointRenderer: InkEndpointRendererType;
}> {
  if (!InkEndpointRendererModule) {
    InkEndpointRendererModule =
      await import("../unified-interface/unified-ui/renderers/cli/CliEndpointRenderer");
  }
  return InkEndpointRendererModule;
}

// ── Types ──────────────────────────────────────────────────────────────────

interface CategoryInfo {
  name: string;
  translatedName: string;
  count: number;
}

interface ToolInfo {
  name: string;
  description: string;
  category: string;
  method: string;
  /** toolName used for lazy-loading the full definition on detail view */
  toolName: string;
  credits?: number;
  aliases: string[];
  /** Full definition - only populated after user clicks into detail view */
  endpoint?: CreateApiEndpointAny;
}

type View =
  | { type: "categories" }
  | { type: "tools"; category: string | null } // null = all tools
  | { type: "detail"; tool: ToolInfo }
  | { type: "result"; tool: ToolInfo; response: ResponseType<WidgetData> };

interface InteractiveHelpProps {
  user: JwtPayloadType;
  locale: CountryLanguage;
  platform: CliCompatiblePlatform;
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function loadEndpointsMeta(): Promise<EndpointMeta[]> {
  const { endpointsMeta } =
    await import("@/app/api/[locale]/system/generated/endpoints-meta/en");
  return endpointsMeta;
}

async function getToolsForUser(
  platform: CliCompatiblePlatform,
  user: JwtPayloadType,
): Promise<{ tools: ToolInfo[]; categories: CategoryInfo[] }> {
  const allMeta = await loadEndpointsMeta();
  const tools: ToolInfo[] = [];
  const categoryMap = new Map<
    string,
    { translatedName: string; count: number }
  >();

  for (const ep of allMeta) {
    const allowedRoles = ep.allowedRoles as Parameters<
      typeof permissionsRegistry.checkPlatformAccess
    >[0];
    // Platform access check
    const platformAccess = permissionsRegistry.checkPlatformAccess(
      allowedRoles,
      platform,
    );
    if (!platformAccess.allowed) {
      continue;
    }
    // User role check
    if (user.isPublic) {
      if (!allowedRoles.includes(UserRole.PUBLIC)) {
        continue;
      }
    } else {
      if (!user.roles.some((role) => allowedRoles.includes(role))) {
        continue;
      }
    }

    tools.push({
      name: ep.toolName,
      description: ep.description,
      category: ep.category,
      method: ep.method,
      toolName: ep.toolName,
      credits: ep.credits,
      aliases: ep.aliases,
    });

    const existing = categoryMap.get(ep.category);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(ep.category, {
        translatedName: ep.category,
        count: 1,
      });
    }
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));

  const categories = [...categoryMap.entries()]
    .map(([name, info]) => ({
      name,
      translatedName: info.translatedName,
      count: info.count,
    }))
    .toSorted((a, b) => b.count - a.count);

  return { tools, categories };
}

// ── Header ─────────────────────────────────────────────────────────────────

function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): JSX.Element {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="cyan">
        {title}
      </Text>
      {subtitle && <Text dimColor>{subtitle}</Text>}
    </Box>
  );
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────

function Breadcrumb({ parts }: { parts: string[] }): JSX.Element {
  return (
    <Box marginBottom={1}>
      {parts.map((part, i) => (
        <Text key={`${i}-${part}`} dimColor={i < parts.length - 1}>
          {i > 0 ? " > " : ""}
          {part}
        </Text>
      ))}
    </Box>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer({ hints }: { hints: string }): JSX.Element {
  return (
    <Box marginTop={1}>
      <Text dimColor>{hints}</Text>
    </Box>
  );
}

// ── Category View ──────────────────────────────────────────────────────────

function CategoryView({
  categories,
  totalTools,
  onSelect,
  locale,
}: {
  categories: CategoryInfo[];
  totalTools: number;
  onSelect: (category: string | null) => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const items: { label: string; value: string | null; key?: string }[] =
    useMemo(
      () => [
        {
          label: `All Tools (${totalTools})`,
          value: null,
          key: "__all__",
        },
        ...categories.map((cat) => ({
          label: `${cat.translatedName} (${cat.count})`,
          value: cat.name as string | null,
          key: cat.name,
        })),
      ],
      [categories, totalTools],
    );

  const handleSelect = useCallback(
    (item: { label: string; value: string | null; key?: string }): void => {
      onSelect(item.value);
    },
    [onSelect],
  );

  return (
    <Box flexDirection="column">
      <Header
        title={`Tool Categories (${totalTools} tools)`}
        subtitle={cliT("vibe.interactive.help.selectCategory")}
      />
      <SelectInput<string | null>
        items={items}
        onSelect={handleSelect}
        limit={20}
      />
      <Footer hints={cliT("vibe.interactive.help.hintsNavSelect")} />
    </Box>
  );
}

// ── Tool List View ─────────────────────────────────────────────────────────

function ToolListView({
  tools,
  category,
  onSelect,
  onBack,
  locale,
}: {
  tools: ToolInfo[];
  category: string | null;
  onSelect: (tool: ToolInfo) => void;
  onBack: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const filtered = useMemo(
    () => (category ? tools.filter((t) => t.category === category) : tools),
    [tools, category],
  );

  const items: { label: string; value: ToolInfo | null; key?: string }[] =
    useMemo(
      () => [
        { label: "< Back to categories", value: null, key: "__back__" },
        ...filtered.map((tool) => {
          const credits =
            tool.credits && tool.credits > 0 ? ` (${tool.credits}cr)` : "";
          const desc =
            tool.description.length > 50
              ? `${tool.description.slice(0, 47)}...`
              : tool.description;
          return {
            label: `${tool.name.padEnd(25)} ${desc}${credits}`,
            value: tool as ToolInfo | null,
            key: `${tool.name}_${tool.method}`,
          };
        }),
      ],
      [filtered],
    );

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
  });

  const handleSelect = useCallback(
    (item: { label: string; value: ToolInfo | null; key?: string }): void => {
      if (item.value === null) {
        onBack();
      } else {
        onSelect(item.value);
      }
    },
    [onBack, onSelect],
  );

  const title = category ?? "All Tools";

  return (
    <Box flexDirection="column">
      <Header
        title={`${title} (${filtered.length} tools)`}
        subtitle={cliT("vibe.interactive.help.selectTool")}
      />
      <SelectInput<ToolInfo | null>
        items={items}
        onSelect={handleSelect}
        limit={20}
      />
      <Footer hints={cliT("vibe.interactive.help.hintsNavSelectBack")} />
    </Box>
  );
}

// ── Tool Detail View ───────────────────────────────────────────────────────

function ToolDetailView({
  tool,
  locale,
  user,
  platform,
  onBack,
  onExecute,
}: {
  tool: ToolInfo;
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: CliCompatiblePlatform;
  onBack: () => void;
  onExecute: () => void;
}): JSX.Element {
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const [RendererComponent, setRendererComponent] =
    useState<InkEndpointRendererType | null>(null);

  // Load InkEndpointRenderer dynamically
  useEffect(() => {
    void getInkEndpointRenderer().then((mod) => {
      setRendererComponent(() => mod.InkEndpointRenderer);
      return undefined;
    });
  }, []);

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
    if (key.return) {
      onExecute();
    }
  });

  const aliases = tool.aliases;

  return (
    <Box flexDirection="column">
      <Breadcrumb parts={["Help", tool.category, tool.name]} />

      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        paddingY={1}
        flexDirection="column"
      >
        <Text bold color="cyan">
          {tool.name}
          {aliases && aliases.length > 0 && (
            <Text dimColor>{` (${aliases.join(", ")})`}</Text>
          )}
        </Text>
        <Text>{tool.description}</Text>
        <Text />
        <Box gap={4}>
          <Text>
            <Text dimColor>{cliT("vibe.interactive.help.category")}</Text>
            {tool.category}
          </Text>
          <Text>
            <Text dimColor>{cliT("vibe.interactive.help.method")}</Text>
            <Text color="yellow">{tool.method}</Text>
          </Text>
          {tool.credits && tool.credits > 0 && (
            <Text>
              <Text dimColor>{cliT("vibe.interactive.help.credits")}</Text>
              <Text color="yellow">{String(tool.credits)}</Text>
            </Text>
          )}
        </Box>
        <Text>
          <Text dimColor>{"Call as   "}</Text>
          <Text color="green">{`vibe ${tool.name}`}</Text>
        </Text>
      </Box>

      {/* Render endpoint fields - only when full definition is loaded */}
      {RendererComponent && tool.endpoint && (
        <Box
          marginTop={1}
          borderStyle="round"
          borderColor="blue"
          paddingX={1}
          paddingY={1}
          flexDirection="column"
        >
          <Text bold color="blue">
            {cliT("vibe.interactive.help.fields")}
          </Text>
          <RendererComponent
            endpoint={tool.endpoint}
            locale={locale}
            data={undefined}
            isSubmitting={false}
            logger={logger}
            user={user}
            platform={platform === Platform.MCP ? Platform.MCP : Platform.CLI}
            response={undefined}
          />
        </Box>
      )}

      <Footer hints={cliT("vibe.interactive.help.hintsExecuteBack")} />
    </Box>
  );
}

// ── Result View ────────────────────────────────────────────────────────────

function ResultView({
  tool,
  response,
  locale,
  user,
  platform,
  onBack,
}: {
  tool: ToolInfo;
  response: ResponseType<WidgetData>;
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: CliCompatiblePlatform;
  onBack: () => void;
}): JSX.Element {
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  const [RendererComponent, setRendererComponent] =
    useState<InkEndpointRendererType | null>(null);

  useEffect(() => {
    void getInkEndpointRenderer().then((mod) => {
      setRendererComponent(() => mod.InkEndpointRenderer);
      return undefined;
    });
  }, []);

  // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
  useInput((_, key) => {
    if (key.escape || key.return) {
      onBack();
    }
  });

  const isSuccess = response.success;

  return (
    <Box flexDirection="column">
      <Breadcrumb
        parts={[
          "Help",
          tool.category,
          tool.name,
          cliT("vibe.interactive.help.result"),
        ]}
      />

      <Box
        borderStyle="round"
        borderColor={isSuccess ? "green" : "red"}
        paddingX={1}
        paddingY={1}
        flexDirection="column"
      >
        <Text bold color={isSuccess ? "green" : "red"}>
          {isSuccess
            ? cliT("vibe.interactive.help.success")
            : cliT("vibe.interactive.help.error")}
        </Text>

        {isSuccess && RendererComponent && tool.endpoint && (
          <RendererComponent
            endpoint={tool.endpoint}
            locale={locale}
            data={response.data}
            isSubmitting={false}
            logger={logger}
            user={user}
            platform={platform === Platform.MCP ? Platform.MCP : Platform.CLI}
            response={response}
            responseOnly
          />
        )}

        {!isSuccess && <Text color="red">{response.message}</Text>}
      </Box>

      <Footer hints={cliT("vibe.interactive.help.hintsBack")} />
    </Box>
  );
}

// ── Main Interactive Help Component ────────────────────────────────────────

function InteractiveHelp({
  user,
  locale,
  platform,
}: InteractiveHelpProps): JSX.Element {
  const { exit } = useApp();
  const { t: cliT } = cliScopedTranslation.scopedT(locale);
  const [view, setView] = useState<View>({ type: "categories" });
  const [isExecuting, setIsExecuting] = useState(false);
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    void getToolsForUser(
      platform === Platform.MCP ? Platform.MCP : Platform.CLI,
      user,
    ).then(({ tools: t, categories: c }) => {
      setTools(t);
      setCategories(c);
      return undefined;
    });
  }, [platform, user]);

  // Global quit handler
  useInput((input) => {
    if (input === "q" && view.type !== "result") {
      exit();
    }
  });

  const handleCategorySelect = useCallback((category: string | null): void => {
    setView({ type: "tools", category });
  }, []);

  const handleToolSelect = useCallback((tool: ToolInfo): void => {
    // Lazy-load the full endpoint definition when user navigates to detail
    void import("@/app/api/[locale]/system/generated/endpoint")
      .then(({ getEndpoint }) => getEndpoint(tool.toolName))
      .then((endpointDef) => {
        setView({
          type: "detail",
          tool: endpointDef ? { ...tool, endpoint: endpointDef } : tool,
        });
        return undefined;
      });
  }, []);

  const handleBack = useCallback((): void => {
    setView((current) => {
      switch (current.type) {
        case "tools":
          return { type: "categories" };
        case "detail":
          return {
            type: "tools",
            category: current.tool.category,
          };
        case "result":
          return {
            type: "detail",
            tool: current.tool,
          };
        default:
          return current;
      }
    });
  }, []);

  const handleExecute = useCallback((): void => {
    if (view.type !== "detail") {
      return;
    }
    const { tool } = view;
    setIsExecuting(true);

    const toolName = tool.toolName;
    void import("../unified-interface/shared/endpoints/route/executor")
      .then(({ RouteExecutionExecutor }) =>
        RouteExecutionExecutor.executeGenericHandler<WidgetData>({
          toolName,
          data: {},
          urlPathParams: {},
          user,
          locale,
          logger: createEndpointLogger(false, Date.now(), locale),
          platform,
          streamContext: {
            rootFolderId: DefaultFolderId.PRIVATE,
            threadId: undefined,
            aiMessageId: undefined,
            skillId: undefined,
            modelId: undefined,
            headless: undefined,
            currentToolMessageId: undefined,
            callerToolCallId: undefined,
            pendingToolMessages: undefined,
            pendingTimeoutMs: undefined,
            leafMessageId: undefined,
            waitingForRemoteResult: undefined,
            favoriteId: undefined,
            abortSignal: new AbortController().signal,
            callerCallbackMode: undefined,
            onEscalatedTaskCancel: undefined,
            escalateToTask: undefined,
          },
        }),
      )
      .then(
        (result) => {
          setIsExecuting(false);
          setView({ type: "result", tool, response: result });
          return undefined;
        },
        () => {
          setIsExecuting(false);
        },
      );
  }, [view, user, locale, platform]);

  if (isExecuting) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="yellow">
          {cliT(
            "vibe.endpoints.renderers.cliUi.widgets.common.hints.executing",
          )}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {view.type === "categories" && (
        <CategoryView
          categories={categories}
          totalTools={tools.length}
          onSelect={handleCategorySelect}
          locale={locale}
        />
      )}

      {view.type === "tools" && (
        <ToolListView
          tools={tools}
          category={view.category}
          onSelect={handleToolSelect}
          onBack={handleBack}
          locale={locale}
        />
      )}

      {view.type === "detail" && (
        <ToolDetailView
          tool={view.tool}
          locale={locale}
          user={user}
          platform={platform}
          onBack={handleBack}
          onExecute={handleExecute}
        />
      )}

      {view.type === "result" && (
        <ResultView
          tool={view.tool}
          response={view.response}
          locale={locale}
          user={user}
          platform={platform}
          onBack={handleBack}
        />
      )}
    </Box>
  );
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Launch the interactive help navigator.
 * Renders to the terminal with Ink - takes over stdin/stdout.
 * Returns a promise that resolves when the user exits.
 */
export async function startInteractiveHelp(
  user: JwtPayloadType,
  locale: CountryLanguage,
  platform: CliCompatiblePlatform,
): Promise<void> {
  const instance = render(
    <InteractiveHelp user={user} locale={locale} platform={platform} />,
  );
  await instance.waitUntilExit();
}
