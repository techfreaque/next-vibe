"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CodeSnippet } from "next-vibe-ui/ui/markdown";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import {
  ENDPOINT_PLATFORMS,
  type EndpointPlatformKey,
  PLATFORM_COUNT,
} from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface ArchitectureProps {
  locale: CountryLanguage;
}

interface PlatformMeta {
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  activeColor: string;
  filename: string;
}

// Exhaustive - TS errors if any EndpointPlatformKey is missing or misspelled
const PLATFORM_META: Record<EndpointPlatformKey, PlatformMeta> = {
  webApi: {
    icon: "🌍",
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800/50",
    activeColor:
      "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600",
    filename: "fetch()",
  },
  reactUi: {
    icon: "🌐",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    activeColor:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    filename: "widget.tsx",
  },
  cli: {
    icon: "⌨️",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800/50",
    activeColor:
      "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    filename: "terminal",
  },
  aiTool: {
    icon: "🤖",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800/50",
    activeColor:
      "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
    filename: "definition.ts",
  },
  mcpServer: {
    icon: "🔌",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800/50",
    activeColor:
      "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
    filename: "mcp-tool.json",
  },
  reactNative: {
    icon: "📱",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800/50",
    activeColor:
      "bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600",
    filename: "widget.tsx",
  },
  cron: {
    icon: "⏰",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800/50",
    activeColor:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    filename: "task-runner.ts",
  },
  websocket: {
    icon: "⚡",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800/50",
    activeColor:
      "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600",
    filename: "server.ts",
  },
  electron: {
    icon: "🖥️",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800/50",
    activeColor:
      "bg-slate-600 text-white hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600",
    filename: "terminal",
  },
  adminPanel: {
    icon: "🛡️",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800/50",
    activeColor:
      "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    filename: "definition.ts",
  },
  vibeFrame: {
    icon: "🪟",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800/50",
    activeColor:
      "bg-pink-600 text-white hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600",
    filename: "embed.html",
  },
  remoteSkill: {
    icon: "📜",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800/50",
    activeColor:
      "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600",
    filename: "skill.ts",
  },
  vibeBoard: {
    icon: "🔮",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800/50",
    activeColor:
      "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    filename: "definition.ts",
  },
};

// Ordered list derived from the canonical ENDPOINT_PLATFORMS - order matches constants.ts
const PLATFORMS = ENDPOINT_PLATFORMS.map((key) => ({
  key,
  ...PLATFORM_META[key],
}));

// ─── Platform panels ──────────────────────────────────────────────────────────

function buildWebApiSnippet(locale: CountryLanguage): string {
  return `const res = await fetch("/api/${locale}/greet", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice" }),
});
const { message } = await res.json();
// message → "Hello, Alice!"`;
}

function WebApiPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-teal-400 mb-1.5">
          {t("home.architecture.panelDetails.webApi.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.webApi.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            /api/[locale]/[path]
          </Span>
          {t("home.architecture.panelDetails.webApi.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet
        code={buildWebApiSnippet(locale)}
        language="typescript"
        noCopy
      />
    </Div>
  );
}

const STEP_READ = `const endpoint = useEndpoint(
  greetDefinitions,
  { write: {} },
  logger, user,
);

// endpoint.write?.data?.message → "Hello, Alice!"
// endpoint.write?.isLoading     → boolean
// endpoint.write?.error         → EndpointError | null`;

const STEP_OPTIMISTIC = `// optimistic update before server confirms
apiClient.updateEndpointData(
  greetDefinitions.POST, logger,
  (old) => old?.success
    ? success({ ...old.data, message: "Hello!" })
    : old,
);`;

const STEP_DIALOG = `// auto-renders form from definition — works anywhere
<EndpointsPage
  endpoint={greetDefinitions}
  locale={locale}
  user={user}
/>`;

function ReactUiPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-4 px-6 py-6">
      <P className="text-sm font-semibold text-blue-400">
        {t("home.architecture.panelDetails.reactUi.headline")}
      </P>
      <Div className="flex flex-col gap-3">
        <Div>
          <P className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/60 mb-1.5">
            {t("home.architecture.panelDetails.reactUi.stepRead")}
          </P>
          <CodeSnippet code={STEP_READ} language="typescript" noCopy />
        </Div>
        <Div>
          <P className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/60 mb-1.5">
            {t("home.architecture.panelDetails.reactUi.stepOptimistic")}
          </P>
          <CodeSnippet code={STEP_OPTIMISTIC} language="typescript" noCopy />
        </Div>
        <Div>
          <P className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/60 mb-1.5">
            {t("home.architecture.panelDetails.reactUi.stepDialog")}
          </P>
          <CodeSnippet code={STEP_DIALOG} language="tsx" noCopy />
        </Div>
      </Div>
    </Div>
  );
}

// Non-translatable code tokens
const CODE_BROWSER_WINDOW = "BrowserWindow";
const CODE_ALLOWED_ROLES = "allowedRoles: [UserRole.ADMIN]";
const CODE_ENDPOINTS_PAGE = "EndpointsPage";

// Non-translatable CLI code tokens
const CLI_ENDPOINT_FULL = "greet_POST";
const CLI_METHOD_TOKEN = "POST";
const CLI_PARAM_NAME = "name";
const CLI_PARAM_TYPE = "string";
const CLI_MESSAGE_KEY = "message";
const CLI_REQUIRED_STAR = "*";
const CLI_PROMPT_SIGIL = "$ ";
const CLI_PAREN_OPEN = " (";
const CLI_PAREN_CLOSE = ")";
const CLI_DASH_H = " -h";

function CliPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const alias = t("home.architecture.snippet.greetAlias");
  const description = t("home.architecture.snippet.greetDescription");
  const category = t("home.architecture.snippet.greetCategory");
  const nameLabel = t("home.architecture.snippet.greetNameLabel");
  const exampleName = t("home.architecture.snippet.exampleName");
  const exampleMessage = t("home.architecture.snippet.exampleMessage");
  const labelCategory = t("home.architecture.snippet.cliCategory");
  const labelMethod = t("home.architecture.snippet.cliMethod");
  const labelCallAs = t("home.architecture.snippet.cliCallAs");
  const labelParameters = t("home.architecture.snippet.cliParameters");
  const labelExamples = t("home.architecture.snippet.cliExamples");
  const exampleTitle = t("home.architecture.snippet.greetTitle");

  const vibeAlias = `vibe ${alias}`;

  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-green-400 mb-1.5">
          {t("home.architecture.platforms.cli.name")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.platforms.cli.benefit")}
        </P>
      </Div>

      {/* Terminal output — mirrors `vibe greet -h` */}
      <Div className="rounded-lg bg-[#011627] border border-slate-700/60 font-mono text-[12px] leading-relaxed overflow-hidden">
        {/* Prompt line */}
        <Div className="px-4 pt-3 pb-2 border-b border-slate-700/40">
          <Span className="text-green-400">{CLI_PROMPT_SIGIL}</Span>
          <Span className="text-slate-100">
            {vibeAlias}
            {CLI_DASH_H}
          </Span>
        </Div>

        <Div className="px-4 py-3 flex flex-col gap-3">
          {/* Title line: alias (endpoint_name) */}
          <Div>
            <Span className="text-white font-bold">{alias}</Span>
            <Span className="text-slate-500">
              {CLI_PAREN_OPEN}
              {CLI_ENDPOINT_FULL}
              {CLI_PAREN_CLOSE}
            </Span>
            <Div className="text-slate-400 text-[11px] mt-0.5">
              {description}
            </Div>
          </Div>

          {/* Meta table */}
          <Div className="flex flex-col gap-0.5">
            <Div className="flex gap-0">
              <Span className="text-slate-500 w-20 shrink-0">
                {labelCategory}
              </Span>
              <Span className="text-slate-200">{category}</Span>
            </Div>
            <Div className="flex gap-0">
              <Span className="text-slate-500 w-20 shrink-0">
                {labelMethod}
              </Span>
              <Span className="text-cyan-400">{CLI_METHOD_TOKEN}</Span>
            </Div>
            <Div className="flex gap-0">
              <Span className="text-slate-500 w-20 shrink-0">
                {labelCallAs}
              </Span>
              <Span className="text-slate-200">{vibeAlias}</Span>
            </Div>
          </Div>

          {/* Parameters */}
          <Div>
            <Div className="text-slate-500 uppercase text-[10px] tracking-widest mb-1.5">
              {labelParameters}
            </Div>
            <Div className="flex items-baseline gap-2 pl-2">
              <Span className="text-yellow-400 shrink-0">
                {CLI_REQUIRED_STAR}
              </Span>
              <Span className="text-[#82aaff] w-12 shrink-0">
                {CLI_PARAM_NAME}
              </Span>
              <Span className="text-[#7fdbca]">{CLI_PARAM_TYPE}</Span>
              <Span className="text-slate-600">{"\u2014"}</Span>
              <Span className="text-slate-400">{nameLabel}</Span>
            </Div>
          </Div>

          {/* Examples */}
          <Div>
            <Div className="text-slate-500 uppercase text-[10px] tracking-widest mb-1.5">
              {labelExamples}
            </Div>
            <Div className="pl-2">
              <Div className="text-slate-500 text-[11px]">{exampleTitle}:</Div>
              <Div className="text-slate-200 mt-0.5">
                {`${vibeAlias}--name=`}
                <Span className="text-[#ecc48d]">
                  &quot;{exampleName}&quot;
                </Span>
              </Div>

              <Div className="text-slate-600 text-[11px] mt-1.5 pl-0">
                {CLI_MESSAGE_KEY}{" "}
                <Span className="text-[#addb67]">
                  &quot;{exampleMessage}&quot;
                </Span>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

const AI_TOOL_SNIPPET = `vibe execute-tool \
  --toolName="greet_POST" \
  --input='{"name":"Alice"}' \
  --callbackMode=wait
# → { message: "Hello, Alice!" }`;

function AiToolPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-purple-400 mb-1.5">
          {t("home.architecture.panelDetails.aiTool.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.aiTool.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            execute-tool
          </Span>
          {t("home.architecture.panelDetails.aiTool.bodyMiddle1")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            wakeUp
          </Span>{" "}
          {t("home.architecture.panelDetails.aiTool.bodyMiddle2")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            --instanceId
          </Span>{" "}
          {t("home.architecture.panelDetails.aiTool.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={AI_TOOL_SNIPPET} language="bash" noCopy />
    </Div>
  );
}

const MCP_SNIPPET = `{
  "name": "greet_POST",
  "description": "Returns a personalised greeting",
  "inputSchema": {
    "name": { "type": "string", "minLength": 1 }
  }
}`;

function McpServerPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-orange-400 mb-1.5">
          {t("home.architecture.panelDetails.mcpServer.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.mcpServer.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            hermes-dev
          </Span>{" "}
          {t("home.architecture.panelDetails.mcpServer.bodyMiddle")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            hermes
          </Span>{" "}
          {t("home.architecture.panelDetails.mcpServer.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={MCP_SNIPPET} language="json" noCopy />
    </Div>
  );
}

const REACT_NATIVE_SNIPPET = `export function GreetWidget({
  field,
}: GreetWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const form = useWidgetForm();
  const message = field.value?.message;

  if (platform === Platform.REACT_NATIVE) {
    return (
      <View style={{ gap: 12 }}>
        <TextInput field={field.children.name} form={form} />
        {message ? <Text>{message}</Text> : null}
      </View>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <TextFieldWidget field={field.children.name} form={form} />
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}`;

function ReactNativePanel({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-cyan-400 mb-1.5">
          {t("home.architecture.panelDetails.reactNative.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.reactNative.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            widget.tsx
          </Span>{" "}
          {t("home.architecture.panelDetails.reactNative.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={REACT_NATIVE_SNIPPET} language="tsx" noCopy />
    </Div>
  );
}

const CRON_SNIPPET = `createCronTask(greetEndpoint.POST, tools.POST, {
  id: "daily-greeting",
  schedule: CRON_SCHEDULES.DAILY_9AM,
  category: TaskCategory.NOTIFICATIONS,
  priority: CronTaskPriority.LOW,
  enabled: true,
  data: { name: "World" },
})`;

function CronPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-red-400 mb-1.5">
          {t("home.architecture.panelDetails.cron.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.cron.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            createCronTask
          </Span>{" "}
          {t("home.architecture.panelDetails.cron.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={CRON_SNIPPET} language="typescript" noCopy />
    </Div>
  );
}

const WEBSOCKET_SNIPPET = `// in handler — push to all connected clients
broadcastLocal("greetings", "new:greeting", {
  name: data.name,
  message: \`Hello, \${data.name}!\`,
});`;

function WebSocketPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-yellow-400 mb-1.5">
          {t("home.architecture.panelDetails.websocket.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.websocket.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            broadcastLocal
          </Span>{" "}
          {t("home.architecture.panelDetails.websocket.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={WEBSOCKET_SNIPPET} language="typescript" noCopy />
    </Div>
  );
}

const ELECTRON_SNIPPET = `# dev — compile, spawn server, open window
$ vibe electron --vibeStart=true

# ship — .AppImage  ·  .exe  ·  .dmg
$ vibe electron:build --platform=all`;

function ElectronPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-slate-300 mb-1.5">
          {t("home.architecture.panelDetails.electron.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.electron.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            {CODE_BROWSER_WINDOW}
          </Span>
          {t("home.architecture.panelDetails.electron.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={ELECTRON_SNIPPET} language="bash" noCopy />
    </Div>
  );
}

const ADMIN_SNIPPET = `// page.tsx
const user = await requireAdminUser(locale, redirect);

// page-client.tsx
<EndpointsPage
  endpoint={greetDefinitions}
  locale={locale}
  user={user}
/>`;

function AdminPanelPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-indigo-400 mb-1.5">
          {t("home.architecture.panelDetails.adminPanel.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.adminPanel.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            {CODE_ALLOWED_ROLES}
          </Span>{" "}
          {t("home.architecture.panelDetails.adminPanel.bodyMiddle")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            {CODE_ENDPOINTS_PAGE}
          </Span>{" "}
          {t("home.architecture.panelDetails.adminPanel.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={ADMIN_SNIPPET} language="tsx" noCopy />
    </Div>
  );
}

const VIBE_FRAME_SNIPPET = `window.vibeFrameConfig = {
  serverUrl: "https://your-server.com",
  integrations: [{
    endpoint: "greet_POST",
    target: "#greet-form",
    theme: "dark",
  }],
};`;

function VibeFramePanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-pink-400 mb-1.5">
          {t("home.architecture.panelDetails.vibeFrame.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.vibeFrame.body")}
        </P>
      </Div>
      <CodeSnippet code={VIBE_FRAME_SNIPPET} language="javascript" noCopy />
    </Div>
  );
}

const REMOTE_SKILL_SNIPPET = `## greet_POST
Returns a personalised greeting.
**Input:** name (string, required)
**Output:** message (string)

---
# To hide an endpoint from external agents:
allowedRoles: [UserRole.PUBLIC, UserRole.SKILL_OFF]`;

function RemoteSkillPanel({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-amber-400 mb-1.5">
          {t("home.architecture.panelDetails.remoteSkill.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.remoteSkill.bodyPrefix")}{" "}
          <Span className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded text-[11px]">
            SKILL_OFF
          </Span>{" "}
          {t("home.architecture.panelDetails.remoteSkill.bodySuffix")}
        </P>
      </Div>
      <CodeSnippet code={REMOTE_SKILL_SNIPPET} language="typescript" noCopy />
    </Div>
  );
}

const VIBE_BOARD_SNIPPET = `# Define a data pipeline for any endpoint
$ vibe system_vibe-sense_graphs_POST \\
  --name="Daily Greetings" \\
  --sourceEndpoint="greet_POST" \\
  --aggregation="count"
# → renders as a tile when Vibe Board ships`;

function VibeBoardPanel({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="bg-slate-950 min-h-[360px] flex flex-col gap-5 px-6 py-6">
      <Div>
        <P className="text-sm font-semibold text-violet-400 mb-1.5">
          {t("home.architecture.panelDetails.vibeBoard.headline")}
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          {t("home.architecture.panelDetails.vibeBoard.body")}
        </P>
      </Div>
      <CodeSnippet code={VIBE_BOARD_SNIPPET} language="bash" noCopy />
    </Div>
  );
}

type PanelComponent = (props: { locale: CountryLanguage }) => JSX.Element;

const PLATFORM_PANELS: Record<EndpointPlatformKey, PanelComponent> = {
  webApi: WebApiPanel,
  reactUi: ReactUiPanel,
  cli: CliPanel,
  aiTool: AiToolPanel,
  mcpServer: McpServerPanel,
  reactNative: ReactNativePanel,
  cron: CronPanel,
  websocket: WebSocketPanel,
  electron: ElectronPanel,
  adminPanel: AdminPanelPanel,
  vibeFrame: VibeFramePanel,
  remoteSkill: RemoteSkillPanel,
  vibeBoard: VibeBoardPanel,
};

// ─── Source examples (file viewer) ───────────────────────────────────────────

type TFn = ReturnType<typeof scopedTranslation.scopedT>["t"];

// ── Example 1: Hello World — definition.ts ────────────────────────────────────
function buildHelloDefinition(t: TFn): string {
  const title = t("home.architecture.snippet.greetTitle");
  const description = t("home.architecture.snippet.greetDescription");
  const tag = t("home.architecture.snippet.greetTagName");
  const formLabel = t("home.architecture.snippet.greetFormLabel");
  const nameLabel = t("home.architecture.snippet.greetNameLabel");
  const namePlaceholder = t("home.architecture.snippet.greetNamePlaceholder");
  const submitLabel = t("home.architecture.snippet.greetSubmitLabel");
  const exampleName = t("home.architecture.snippet.exampleName");
  const exampleMessage = t("home.architecture.snippet.exampleMessage");
  return `const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["greet"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
  title: "${title}",
  description: "${description}",
  icon: "hand-wave",
  tags: ["${tag}"],
  fields: objectField({
    type: WidgetType.CONTAINER,
    title: "${formLabel}",
    usage: { request: "data", response: true },
    children: {
      name: requestField({
        schema: z.string().min(1).max(100),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "${nameLabel}",
        placeholder: "${namePlaceholder}",
      }),
      message: responseField({
        schema: z.string(),
        type: WidgetType.ALERT,
      }),
      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "${submitLabel}",
       }),
    },
  }),
  examples: {
    requests:  { simpleGreeting: { name: "${exampleName}" } },
    responses: { simpleGreeting: { message: "${exampleMessage}" } },
  },
});`;
}

// ── Example 1: Hello World — route.ts ─────────────────────────────────────────
const HELLO_ROUTE = `export const { POST, tools } = endpointsHandler({
  endpoint: greetEndpoint,
  [Methods.POST]: {
    handler: ({ data }) => {
       return success({ message: \`Hello, \${data.name}!\` });
    },
  },
});`;

// ── Example 2: Custom Widget — definition.ts ──────────────────────────────────
function buildWidgetDefinition(t: TFn): string {
  const title = t("home.architecture.snippet.greetTitle");
  const description = t("home.architecture.snippet.greetDescription");
  const tag = t("home.architecture.snippet.greetTagName");
  const nameLabel = t("home.architecture.snippet.greetNameLabel");
  const namePlaceholder = t("home.architecture.snippet.greetNamePlaceholder");
  const exampleName = t("home.architecture.snippet.exampleName");
  const exampleMessage = t("home.architecture.snippet.exampleMessage");
  return `const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["greet"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
  title: "${title}",
  description: "${description}",
  icon: "hand-wave",
  tags: ["${tag}"],
  fields: customWidgetObject({
    render: GreetWidget,
    children: {
      name: requestField({
        schema: z.string().min(1).max(100),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "${nameLabel}",
        placeholder: "${namePlaceholder}",
      }),
      message: responseField({
        schema: z.string(),
        type: WidgetType.ALERT,
      }),
    },
  }),
  examples: {
    requests:  { simpleGreeting: { name: "${exampleName}" } },
    responses: { simpleGreeting: { message: "${exampleMessage}" } },
  },
});`;
}

// ── Example 2: Custom Widget — route.ts ───────────────────────────────────────
const WIDGET_ROUTE = `export const { POST, tools } = endpointsHandler({
  endpoint: greetEndpoint,
  [Methods.POST]: {
    handler: ({ data }) => {
      return success({ message: \`Hello, \${data.name}!\` });
    },
  },
});`;

// ── Example 2: Custom Widget — widget.tsx ─────────────────────────────────────
const WIDGET_WIDGET = `"use client";

interface GreetWidgetProps {
  field: { value: GreetPostResponseOutput | null } &
    (typeof definition.POST)["fields"];
}

export function GreetWidget({ field }: GreetWidgetProps): JSX.Element {
  const message = field.value?.message;

  return (
    <div className="flex flex-col gap-4 p-4">
      <TextFieldWidget field={field.children.name} />
      {message && (
        <p className="text-lg font-medium text-green-600">{message}</p>
      )}
      <SubmitButtonWidget field={field.children.submitButton} />
    </div>
  );
}`;

type ExampleKey = "hello" | "widget";

interface FileEntry {
  name: string;
  code: string;
  lang: string;
}

function buildFiles(t: TFn): Record<ExampleKey, Record<string, FileEntry>> {
  return {
    hello: {
      "definition.ts": {
        name: "definition.ts",
        code: buildHelloDefinition(t),
        lang: "typescript",
      },
      "route.ts": { name: "route.ts", code: HELLO_ROUTE, lang: "typescript" },
    },
    widget: {
      "definition.ts": {
        name: "definition.ts",
        code: buildWidgetDefinition(t),
        lang: "typescript",
      },
      "route.ts": { name: "route.ts", code: WIDGET_ROUTE, lang: "typescript" },
      "widget.tsx": { name: "widget.tsx", code: WIDGET_WIDGET, lang: "tsx" },
    },
  };
}

function FileViewer({
  files,
}: {
  files: Record<string, FileEntry>;
}): JSX.Element {
  const keys = Object.keys(files);
  const [activeFile, setActiveFile] = useState(keys[0]!);
  const file = files[activeFile]!;

  return (
    <Div className="overflow-hidden rounded-xl border border-border/50 bg-slate-950">
      {/* File tabs */}
      <Div className="flex border-b border-border/40 bg-slate-900/50">
        {keys.map((key) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFile(key)}
            className={cn(
              "h-auto rounded-none px-4 py-2 text-xs font-mono transition-colors border-r border-border/30",
              activeFile === key
                ? "text-slate-200 bg-slate-800/80 border-b-2 border-b-primary"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40",
            )}
          >
            {files[key]!.name}
          </Button>
        ))}
      </Div>
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeFile}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <CodeSnippet
            code={file.code}
            language={file.lang}
            variant="bare"
            noCopy
          />
        </MotionDiv>
      </AnimatePresence>
    </Div>
  );
}

function SourceExamples({ t }: { t: TFn }): JSX.Element {
  const [activeExample, setActiveExample] = useState<ExampleKey>("hello");
  const allFiles = useMemo(() => buildFiles(t), [t]);

  return (
    <Div className="mx-auto max-w-2xl">
      <Div className="flex gap-1 mb-3 border-b border-border/40">
        {(["hello", "widget"] as ExampleKey[]).map((key) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => setActiveExample(key)}
            className={cn(
              "rounded-none px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px",
              activeExample === key
                ? "text-foreground border-b-primary"
                : "text-muted-foreground border-b-transparent hover:text-foreground",
            )}
          >
            {t(`home.architecture.examples.${key}`)}
          </Button>
        ))}
      </Div>
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeExample}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          <FileViewer files={allFiles[activeExample]} />
        </MotionDiv>
      </AnimatePresence>
    </Div>
  );
}
// ─── Main component ───────────────────────────────────────────────────────────

export function Architecture({ locale }: ArchitectureProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activePlatform, setActivePlatform] =
    useState<EndpointPlatformKey>("webApi");

  const handleSelect = useCallback((key: EndpointPlatformKey) => {
    setActivePlatform(key);
  }, []);

  const activeMeta = useMemo(
    () => PLATFORMS.find((platform) => platform.key === activePlatform)!,
    [activePlatform],
  );

  const ActivePanel = PLATFORM_PANELS[activePlatform];

  return (
    <Div className="relative overflow-hidden bg-muted/20" ref={ref as never}>
      <Div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />

      <Div className="container relative px-4 md:px-6 py-24 md:py-32">
        {/* Header */}
        <MotionDiv
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            {t("home.architecture.badge")}
          </Div>
          <H2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            {t("home.architecture.title", {
              platformCount: String(PLATFORM_COUNT),
            })}
          </H2>
          <P className="mx-auto max-w-[680px] text-muted-foreground md:text-xl">
            {t("home.architecture.subtitle", {
              platformCount: String(PLATFORM_COUNT),
            })}
          </P>
        </MotionDiv>

        {/* Source examples */}
        <MotionDiv
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <SourceExamples t={t} />
        </MotionDiv>

        {/* Arrow divider */}
        <MotionDiv
          className="flex justify-center mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Div className="flex flex-col items-center gap-1">
            <Div className="w-px h-8 bg-border" />
            <Span className="text-sm font-medium text-muted-foreground px-4 py-1.5 border rounded-full bg-background">
              {t("home.architecture.compilesTo")}
            </Span>
            <Div className="w-px h-8 bg-border" />
          </Div>
        </MotionDiv>

        {/* Interactive platform explorer */}
        <MotionDiv
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Div className="rounded-2xl border-2 border-border bg-card shadow-xl overflow-hidden">
            {/* Platform tabs bar */}
            <Div className="border-b border-border bg-muted/40 px-4 py-3">
              <Div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelect(platform.key)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all gap-1.5",
                      activePlatform === platform.key
                        ? platform.activeColor
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Span>{platform.icon}</Span>
                    {t(`home.architecture.platforms.${platform.key}.name`)}
                  </Button>
                ))}
              </Div>
            </Div>

            {/* Code panel */}
            <Div className="flex min-h-[420px]">
              {/* Left: file header + panel */}
              <Div className="flex-1 min-w-0">
                {/* Filename bar */}
                <Div
                  className={cn(
                    "flex items-center gap-3 px-5 py-2.5 border-b border-border text-xs font-mono",
                    activeMeta.bgColor,
                  )}
                >
                  <Span className="text-base">{activeMeta.icon}</Span>
                  <Span className={activeMeta.color}>
                    {activeMeta.filename}
                  </Span>
                </Div>

                {/* Panel */}
                <AnimatePresence mode="wait">
                  <MotionDiv
                    key={activePlatform}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ActivePanel locale={locale} />
                  </MotionDiv>
                </AnimatePresence>
              </Div>

              {/* Right: benefit sidebar */}
              <Div
                className={cn(
                  "hidden lg:flex flex-col w-56 border-l border-border p-5 gap-3 shrink-0",
                  activeMeta.bgColor,
                )}
              >
                <AnimatePresence mode="wait">
                  <MotionDiv
                    key={activePlatform}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-3"
                  >
                    <H3
                      className={cn(
                        "text-sm font-semibold flex items-center gap-2",
                        activeMeta.color,
                      )}
                    >
                      <Span className="text-xl">{activeMeta.icon}</Span>
                      {t(`home.architecture.platforms.${activePlatform}.name`)}
                    </H3>
                    <P className="text-xs text-muted-foreground leading-relaxed">
                      {t(
                        `home.architecture.platforms.${activePlatform}.benefit`,
                      )}
                    </P>
                    <Div className="mt-auto pt-4 border-t border-border/50">
                      <Span
                        className={cn(
                          "text-[10px] font-medium uppercase tracking-wide",
                          activeMeta.color,
                        )}
                      >
                        {`${t("home.architecture.checkmark")} `}
                        {t("home.architecture.callout.pills.autoGenerated")}
                      </Span>
                    </Div>
                  </MotionDiv>
                </AnimatePresence>
              </Div>
            </Div>
          </Div>
        </MotionDiv>

        {/* Bottom callout */}
        <MotionDiv
          className="mx-auto max-w-3xl text-center mt-14"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
            <P className="text-lg font-semibold mb-2">
              {t("home.architecture.callout.title")}
            </P>
            <P className="text-muted-foreground mb-4">
              {t("home.architecture.callout.body")}
            </P>
            <Div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {(
                [
                  "typeSafe",
                  "roleControlled",
                  "validated",
                  "autoGenerated",
                ] as const
              ).map((key) => (
                <Span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 bg-muted/30"
                >
                  <Span className="text-green-500">{"✓"}</Span>
                  {t(`home.architecture.callout.pills.${key}`)}
                </Span>
              ))}
            </Div>
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
