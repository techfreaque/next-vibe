/* eslint-disable i18next/no-literal-string */
/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, H3, H4, P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";
import { CodeBlock } from "next-vibe-ui/ui/markdown";
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

// Exhaustive — TS errors if any EndpointPlatformKey is missing or misspelled
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

// Ordered list derived from the canonical ENDPOINT_PLATFORMS — order matches constants.ts
const PLATFORMS = ENDPOINT_PLATFORMS.map((key) => ({
  key,
  ...PLATFORM_META[key],
}));

// ─── Platform panels ──────────────────────────────────────────────────────────

function WebApiPanel(): JSX.Element {
  return (
    <Div className="font-mono text-xs bg-[#0d1117] min-h-[360px] px-5 py-5 leading-6">
      <Div className="text-slate-500">
        {"// fetch from anywhere — server or client"}
      </Div>
      <Div className="mt-3">
        <Span className="text-purple-400">{"const "}</Span>
        <Span className="text-slate-300">{"res = "}</Span>
        <Span className="text-purple-400">{"await "}</Span>
        <Span className="text-yellow-300">{"fetch"}</Span>
        <Span className="text-slate-300">{"("}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-amber-300">{"`/api/en/agent/chat/threads"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-amber-300">
          {"  ?rootFolderId=private&limit=20`,"}
        </Span>
      </Div>
      <Div className="pl-4 mt-1">
        <Span className="text-slate-300">{"{"}</Span>
      </Div>
      <Div className="pl-8">
        <Span className="text-sky-300">{"headers"}</Span>
        <Span className="text-slate-300">{": {"}</Span>
      </Div>
      <Div className="pl-12">
        <Span className="text-sky-300">{"Cookie"}</Span>
        <Span className="text-slate-400">{": "}</Span>
        <Span className="text-amber-300">{"` token="}</Span>
        <Span className="text-slate-300">{"$"}</Span>
        <Span className="text-amber-300">{"{token}; leadId="}</Span>
        <Span className="text-slate-300">{"$"}</Span>
        <Span className="text-amber-300">{"{leadId}` ,"}</Span>
      </Div>
      <Div className="pl-8">
        <Span className="text-slate-300">{"},"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-slate-300">{"}"}</Span>
      </Div>
      <Div>
        <Span className="text-slate-300">{");"}</Span>
      </Div>

      <Div className="mt-3">
        <Span className="text-purple-400">{"const "}</Span>
        <Span className="text-slate-300">{"{ "}</Span>
        <Span className="text-sky-300">{"data"}</Span>
        <Span className="text-slate-300">{" } = "}</Span>
        <Span className="text-purple-400">{"await "}</Span>
        <Span className="text-slate-300">{"res."}</Span>
        <Span className="text-yellow-300">{"json"}</Span>
        <Span className="text-slate-300">{"();"}</Span>
      </Div>

      <Div className="mt-4 pt-4 border-t border-white/5">
        <Span className="text-slate-500">{"// data.threads     "}</Span>
        <Span className="text-blue-400">{"Thread"}</Span>
        <Span className="text-slate-500">{"[]"}</Span>
      </Div>
      <Div>
        <Span className="text-slate-500">{"// data.totalCount  "}</Span>
        <Span className="text-orange-300">{"47"}</Span>
      </Div>
      <Div>
        <Span className="text-slate-500">{"// data.pageCount   "}</Span>
        <Span className="text-orange-300">{"3"}</Span>
      </Div>
    </Div>
  );
}

const STEP_READ = `// hooks.ts — typed, cached, refetch-aware
const { read } = useThreadsList(
  { rootFolderId: "private" },
  user,
  logger,
);

// read.data?.threads   →  Thread[]
// read.isLoading       →  boolean
// read.isError         →  boolean`;

const STEP_OPTIMISTIC = `// optimistic rename — UI updates before server confirms
apiClient.updateEndpointData(
  definitions.GET, logger,
  (old) => old?.success
    ? success({
        ...old.data,
        threads: old.data.threads.map((t) =>
          t.id === id ? { ...t, title } : t
        ),
      })
    : old,
  { requestData: { rootFolderId: "private" } },
);

// fire & confirm in background
await apiClient.mutate(
  patchDef.PATCH, logger, user,
  { title }, { threadId: id }, locale,
);`;

const STEP_DIALOG = `// drop in anywhere — renders the full form as a dialog
<EndpointsPage
  endpoint={{ POST: createThreadDef.POST }}
  locale={locale}
  user={user}
  endpointOptions={{
    create: {
      mutationOptions: { onSuccess: closeDialog },
    },
  }}
/>`;

function ReactUiPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px]">
      <Div className="flex flex-col gap-0">
        {/* Step 1 */}
        <Div className="px-5 pt-5 pb-2">
          <H4 className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70 mb-2">
            1 — Read data
          </H4>
        </Div>
        <CodeBlock code={STEP_READ} language="typescript" />

        {/* Step 2 */}
        <Div className="h-px bg-white/5 mx-5" />
        <Div className="px-5 pt-4 pb-2">
          <H4 className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70 mb-2">
            2 — Optimistic update
          </H4>
        </Div>
        <CodeBlock code={STEP_OPTIMISTIC} language="typescript" />

        {/* Step 3 */}
        <Div className="h-px bg-white/5 mx-5" />
        <Div className="px-5 pt-4 pb-2">
          <H4 className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70 mb-2">
            3 — Open as dialog
          </H4>
        </Div>
        <CodeBlock code={STEP_DIALOG} language="typescript" />
      </Div>
    </Div>
  );
}

function PlaceholderPanel({ label }: { label: string }): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex items-center justify-center">
      <Span className="text-slate-600 font-mono text-xs">{label}</Span>
    </Div>
  );
}

const PLATFORM_PANELS: Record<EndpointPlatformKey, () => JSX.Element> = {
  webApi: WebApiPanel,
  reactUi: ReactUiPanel,
  cli: () => <PlaceholderPanel label="cli — coming next" />,
  aiTool: () => <PlaceholderPanel label="aiTool — coming next" />,
  mcpServer: () => <PlaceholderPanel label="mcpServer — coming next" />,
  reactNative: () => <PlaceholderPanel label="reactNative — coming next" />,
  cron: () => <PlaceholderPanel label="cron — coming next" />,
  websocket: () => <PlaceholderPanel label="websocket — coming next" />,
  electron: () => <PlaceholderPanel label="electron — coming next" />,
  adminPanel: () => <PlaceholderPanel label="adminPanel — coming next" />,
  vibeFrame: () => <PlaceholderPanel label="vibeFrame — coming next" />,
  remoteSkill: () => <PlaceholderPanel label="remoteSkill — coming next" />,
  vibeBoard: () => <PlaceholderPanel label="vibeBoard — coming next" />,
};

// ─── Definition snippet (source box) ─────────────────────────────────────────

function DefinitionPanel(): JSX.Element {
  return (
    <Div className="font-mono text-xs bg-[#0d1117] px-5 py-4 leading-5">
      <Div className="text-slate-500">
        {"// definition.ts — the only file you write."}
      </Div>
      <Div className="mt-2">
        <Span className="text-purple-400">const </Span>
        <Span className="text-slate-300">{"{ "}</Span>
        <Span className="text-blue-400">GET</Span>
        <Span className="text-slate-300">{" } = "}</Span>
        <Span className="text-yellow-300">createEndpoint</Span>
        <Span className="text-slate-300">{"({"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-sky-300">path</Span>
        <Span className="text-slate-400">{": ["}</Span>
        <Span className="text-amber-300">"agent"</Span>
        <Span className="text-slate-400">{", "}</Span>
        <Span className="text-amber-300">"chat"</Span>
        <Span className="text-slate-400">{", "}</Span>
        <Span className="text-amber-300">"threads"</Span>
        <Span className="text-slate-400">{"],"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-sky-300">allowedRoles</Span>
        <Span className="text-slate-400">{": ["}</Span>
        <Span className="text-blue-400">UserRole</Span>
        <Span className="text-slate-400">.</Span>
        <Span className="text-orange-300">CUSTOMER</Span>
        <Span className="text-slate-400">{"],"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-sky-300">fields</Span>
        <Span className="text-slate-400">:{" {"}</Span>
      </Div>
      <Div className="pl-8">
        <Span className="text-sky-300">rootFolderId</Span>
        <Span className="text-slate-400">{": "}</Span>
        <Span className="text-yellow-300">requestField</Span>
        <Span className="text-slate-400">{"({ schema: "}</Span>
        <Span className="text-blue-400">z</Span>
        <Span className="text-slate-400">.</Span>
        <Span className="text-yellow-300">enum</Span>
        <Span className="text-slate-400">{"(["}</Span>
        <Span className="text-amber-300">"private"</Span>
        <Span className="text-slate-400">{" …]) }),"}</Span>
      </Div>
      <Div className="pl-8">
        <Span className="text-sky-300">threads</Span>
        <Span className="text-slate-400">{": "}</Span>
        <Span className="text-yellow-300">responseArrayField</Span>
        <Span className="text-slate-400">{"({ child: "}</Span>
        <Span className="text-blue-400">ThreadSchema</Span>
        <Span className="text-slate-400">{" }),"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-slate-400">{"  },"}</Span>
      </Div>
      <Div className="pl-4">
        <Span className="text-sky-300">errorTypes</Span>
        <Span className="text-slate-400">{": "}</Span>
        <Span className="text-yellow-300">endpointErrorTypes</Span>
        <Span className="text-slate-400">,</Span>
      </Div>
      <Div>
        <Span className="text-slate-300">{"});"}</Span>
      </Div>
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

        {/* Source definition box */}
        <MotionDiv
          className="mx-auto max-w-2xl mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <Div className="rounded-xl border-2 border-cyan-500/40 overflow-hidden shadow-lg shadow-cyan-500/10">
            <Div className="flex items-center gap-2 px-4 py-2 border-b border-cyan-800/40 bg-cyan-950/80">
              <Div className="flex gap-1.5">
                <Div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <Div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <Div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </Div>
              <Span className="text-xs font-mono text-cyan-400/80 ml-2">
                {t("home.architecture.defFilename")}
              </Span>
              <Span className="ml-auto text-xs text-cyan-500/60 italic">
                {t("home.architecture.sourceLabel")}
              </Span>
            </Div>
            <DefinitionPanel />
          </Div>
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
                    <ActivePanel />
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
                        {"✓ "}
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
