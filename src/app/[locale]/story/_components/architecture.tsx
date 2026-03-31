/* eslint-disable i18next/no-literal-string */
/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CodeBlock } from "next-vibe-ui/ui/markdown";
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

const WEB_API_SNIPPET = `const res = await fetch(
  "/api/en/agent/chat/threads?rootFolderId=private",
  { headers: { Cookie: \`token=\${token}\` } }
);
const { threads, totalCount } = await res.json();`;

function WebApiPanel(): JSX.Element {
  return (
<<<<<<< HEAD
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-teal-400 mb-2">
          Your definition.ts is already a REST API.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          The moment you add a path and schema, the endpoint is live at{" "}
          <Span className="text-slate-300 font-mono">/api/[locale]/[path]</Span>
          . No routing code to write. No controllers. Any HTTP client — server,
          browser, mobile — can call it immediately.
        </P>
=======
    <Div className="font-mono text-xs bg-[#0d1117] min-h-[360px] px-5 py-5 leading-6">
      <Div className="text-slate-500">
        {"// fetch from anywhere - server or client"}
>>>>>>> ffa7090e2 (add multi modal support)
      </Div>
      <CodeBlock code={WEB_API_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          The response shape is inferred from your Zod schema. Validation,
          role-checking, and error responses are handled before your repository
          is ever called.
        </P>
      </Div>
    </Div>
  );
}

<<<<<<< HEAD
const REACT_UI_SNIPPET = `const { read } = useThreadsList(
=======
const STEP_READ = `// hooks.ts - typed, cached, refetch-aware
const { read } = useThreadsList(
>>>>>>> ffa7090e2 (add multi modal support)
  { rootFolderId: "private" },
  user, logger,
);
<<<<<<< HEAD
// read.data?.threads → Thread[]
// read.isLoading     → boolean`;

function ReactUiPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-blue-400 mb-2">
          One hook. Typed data, cache, and mutations included.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          The definition generates a typed React hook. It handles caching,
          refetch-on-focus, loading states — all wired automatically. Optimistic
          updates let you mutate the cache instantly so the UI never flickers
          while the server confirms.
        </P>
      </Div>
      <CodeBlock code={REACT_UI_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          Need a full form? Drop{" "}
          <Span className="text-slate-300 font-mono">
            {"<EndpointsPage />"}
          </Span>{" "}
          anywhere and pass the definitions object. It renders the complete
          form, validation, and success state — no extra code.
        </P>
=======

// read.data?.threads   →  Thread[]
// read.isLoading       →  boolean
// read.isError         →  boolean`;

const STEP_OPTIMISTIC = `// optimistic rename - UI updates before server confirms
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

const STEP_DIALOG = `// drop in anywhere - renders the full form as a dialog
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
            1 - Read data
          </H4>
        </Div>
        <CodeBlock code={STEP_READ} language="typescript" />

        {/* Step 2 */}
        <Div className="h-px bg-white/5 mx-5" />
        <Div className="px-5 pt-4 pb-2">
          <H4 className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70 mb-2">
            2 - Optimistic update
          </H4>
        </Div>
        <CodeBlock code={STEP_OPTIMISTIC} language="typescript" />

        {/* Step 3 */}
        <Div className="h-px bg-white/5 mx-5" />
        <Div className="px-5 pt-4 pb-2">
          <H4 className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70 mb-2">
            3 - Open as dialog
          </H4>
        </Div>
        <CodeBlock code={STEP_DIALOG} language="typescript" />
>>>>>>> ffa7090e2 (add multi modal support)
      </Div>
    </Div>
  );
}

const CLI_SNIPPET = `$ vibe help
Available Tools (419) · 28 categories

$ vibe help agent_chat_threads_GET
  GET /agent/chat/threads
  --rootFolderId  enum    (required)
  --limit         number  default 20

$ vibe agent_chat_threads_GET --rootFolderId=private
  threads     Thread[20]
  totalCount  47`;

function CliPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-green-400 mb-2">
          Every endpoint is a CLI command. No docs needed.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Run <Span className="text-slate-300 font-mono">vibe help</Span> to
          browse all 419 tools across 28 categories. Inspect any tool to see its
          params, then call it directly. The same definition that powers the web
          UI is what the CLI reads.
        </P>
      </Div>
      <CodeBlock code={CLI_SNIPPET} language="bash" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          Useful for scripting, debugging, and automation — the entire platform
          is scriptable from day one without any extra effort.
        </P>
      </Div>
    </Div>
  );
}

const AI_TOOL_SNIPPET = `vibe execute-tool \\
  --toolName="agent_chat_threads_GET" \\
  --input.rootFolderId="private" \\
  --input.limit=20 \\
  --callbackMode=wakeUp`;

function AiToolPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-purple-400 mb-2">
          Claude can call any endpoint as a tool — no integration code.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Every endpoint is automatically available to AI agents via{" "}
          <Span className="text-slate-300 font-mono">execute-tool</Span>. Claude
          discovers what exists, inspects the schema, and calls it with typed
          parameters. Use{" "}
          <Span className="text-slate-300 font-mono">wakeUp</Span> mode for
          long-running tasks — the agent suspends and resumes when the result is
          ready.
        </P>
      </Div>
      <CodeBlock code={AI_TOOL_SNIPPET} language="bash" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          Pass <Span className="text-slate-300 font-mono">--instanceId</Span> to
          delegate the call to a remote instance — Claude on your laptop can
          trigger work on the production server.
        </P>
      </Div>
    </Div>
  );
}

const MCP_SNIPPET = `// claude_desktop_config.json
"hermes-dev": {
  "command": "bun",
  "args": ["vibe-runtime.ts", "mcp"]
}`;

function McpServerPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-orange-400 mb-2">
          One config line — Claude Desktop gets 419 tools.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Point Claude at the MCP server and every endpoint becomes a callable
          tool. The server is context-efficient by design:{" "}
          <Span className="text-slate-300 font-mono">tool-help</Span> returns
          names and descriptions only — full schemas expand only when you query
          5 or fewer tools. Claude browses fast, digs in only when needed.
        </P>
      </Div>
      <CodeBlock code={MCP_SNIPPET} language="json" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          Two servers:{" "}
          <Span className="text-slate-300 font-mono">hermes-dev</Span> points at
          your local instance,{" "}
          <Span className="text-slate-300 font-mono">hermes</Span> at
          production. Add{" "}
          <Span className="text-slate-300 font-mono">--local</Span> to switch
          env files.
        </P>
      </Div>
    </Div>
  );
}

const REACT_NATIVE_SNIPPET = `const platform = useWidgetPlatform();
const isWeb = platform === Platform.NEXT_PAGE;

if (isWeb) return <ThreadsTable field={field} />;
return <ThreadsList field={field} />;`;

function ReactNativePanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-cyan-400 mb-2">
          One widget file. Web and native branch at runtime.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          The same <Span className="text-slate-300 font-mono">widget.tsx</Span>{" "}
          serves both React on web and React Native on iOS and Android. A single
          platform check splits the render path — rich shadcn UI on web, native
          primitives on mobile. Auth, types, and API calls are shared.
        </P>
      </Div>
      <CodeBlock code={REACT_NATIVE_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          No duplicate logic. No separate mobile app repo. One codebase ships to
          iOS, Android, and web simultaneously.
        </P>
      </Div>
    </Div>
  );
}

const CRON_SNIPPET = `createCronTask(definitions.POST, tools.POST, {
  id: "error-logs-cleanup",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
  category: TaskCategory.MAINTENANCE,
  priority: CronTaskPriority.LOW,
  enabled: true,
})`;

function CronPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-red-400 mb-2">
          Any endpoint becomes a scheduled job in one call.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Wrap an existing endpoint with{" "}
          <Span className="text-slate-300 font-mono">createCronTask</Span> and
          it runs on a schedule. No new logic, no separate worker process — the
          same <Span className="text-slate-300 font-mono">definition.ts</Span>{" "}
          and <Span className="text-slate-300 font-mono">route.ts</Span> you
          already wrote. The scheduler picks it up automatically on startup.
        </P>
      </Div>
      <CodeBlock code={CRON_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          Schedules, categories, priorities, and timeouts are all typed enums.
          The cron queue is visible in the admin panel and manageable via CLI.
        </P>
      </Div>
    </Div>
  );
}

const WEBSOCKET_SNIPPET = `// server — push from any repository
broadcastLocal("thread:abc123", "message:new", {
  threadId, content,
});`;

function WebSocketPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-yellow-400 mb-2">
          Real-time push from any repository, one line.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Clients subscribe to named channels over a persistent WebSocket
          connection. On the server, any repository can push an event by calling{" "}
          <Span className="text-slate-300 font-mono">broadcastLocal</Span> with
          a channel, event name, and payload. No pub/sub infrastructure to set
          up.
        </P>
      </Div>
      <CodeBlock code={WEBSOCKET_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          The AI streaming interface uses this to push tokens to the browser in
          real time. The same mechanism works for any live data — notifications,
          presence, progress updates.
        </P>
      </Div>
    </Div>
  );
}

const ELECTRON_SNIPPET = `# dev — compiles main.js, spawns server, opens window
$ vibe electron --vibeStart=true

# ship — produces .AppImage · .exe · .dmg
$ vibe electron:build --platform=all`;

function ElectronPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-slate-300 mb-2">
          Your web app becomes a desktop app with two commands.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          There is no separate desktop codebase. The exact same Next.js app runs
          inside an Electron{" "}
          <Span className="text-slate-300 font-mono">BrowserWindow</Span>. Vibe
          compiles the Electron main process, starts the server, and opens the
          window — all in one step.
        </P>
      </Div>
      <CodeBlock code={ELECTRON_SNIPPET} language="bash" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          The build command packages for all platforms via electron-builder.
          Everything that works in the browser — auth, AI, real-time — works
          identically in the desktop app.
        </P>
      </Div>
    </Div>
  );
}

const ADMIN_SNIPPET = `// page.tsx
const user = await requireAdminUser(locale, redirect);

// page-client.tsx
<EndpointsPage
  endpoint={cronQueueDefinition}
  locale={locale}
  user={user}
/>`;

function AdminPanelPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-indigo-400 mb-2">
          Admin pages write themselves — guard, render, done.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Set{" "}
          <Span className="text-slate-300 font-mono">
            allowedRoles: [UserRole.ADMIN]
          </Span>{" "}
          in the definition and the endpoint is locked down everywhere — API,
          CLI, MCP, and UI. On the page, one guard call and one{" "}
          <Span className="text-slate-300 font-mono">EndpointsPage</Span>{" "}
          renders the complete admin interface with zero additional markup.
        </P>
      </Div>
      <CodeBlock code={ADMIN_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          Every admin page in the platform is built this way — cron queue, user
          management, task runner, settings. All consistent, all role-protected,
          zero boilerplate.
        </P>
      </Div>
    </Div>
  );
}

const VIBE_FRAME_SNIPPET = `window.vibeFrameConfig = {
  serverUrl: "https://unbottled.ai",
  integrations: [{
    endpoint: "contact_POST",
    target: "#contact-form",
    theme: "dark",
  }],
};`;

function VibeFramePanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-pink-400 mb-2">
          Embed any endpoint into any website with a script tag.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Drop the Vibe Frame script onto any existing site — WordPress,
          Webflow, plain HTML. Declare which endpoint to render and where to
          mount it. The full form, validation, and submission flow appears
          inside the host page, communicating back over a postMessage bridge.
        </P>
      </Div>
      <CodeBlock code={VIBE_FRAME_SNIPPET} language="javascript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          No iframes, no CORS headaches. The frame is a first-class citizen of
          the host page. Use the imperative{" "}
          <Span className="text-slate-300 font-mono">VibeFrame.mount()</Span>{" "}
          API for dynamic embedding.
        </P>
      </Div>
    </Div>
  );
}

const REMOTE_SKILL_SNIPPET = `// opt out of skill exposure with one role flag
allowedRoles: [
  UserRole.CUSTOMER,
  UserRole.SKILL_OFF, // exclude from skill files
]`;

function RemoteSkillPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-amber-400 mb-2">
          Your API generates its own AI skill manifest automatically.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Every public endpoint is included in a generated markdown skill file
          that external AI agents can fetch and learn from. Two files are
          served: one for anonymous users, one for authenticated users. Each
          endpoint opts in by default — add{" "}
          <Span className="text-slate-300 font-mono">SKILL_OFF</Span> to exclude
          it.
        </P>
      </Div>
      <CodeBlock code={REMOTE_SKILL_SNIPPET} language="typescript" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          An external AI fetches the manifest once, then knows exactly what your
          platform can do and how to call it — no manual API docs to maintain.
        </P>
      </Div>
    </Div>
  );
}

const VIBE_BOARD_SNIPPET = `# Vibe Sense — the data layer, live today
$ vibe system_unified-interface_vibe-sense_graphs_GET
$ vibe system_unified-interface_vibe-sense_graphs_POST`;

function VibeBoardPanel(): JSX.Element {
  return (
    <Div className="bg-[#0d1117] min-h-[360px] flex flex-col gap-0">
      <Div className="px-6 pt-6 pb-4">
        <P className="text-sm font-semibold text-violet-400 mb-2">
          Every endpoint becomes a live dashboard tile.
        </P>
        <P className="text-xs text-slate-400 leading-relaxed">
          Vibe Board is the next surface for next-vibe — a drag-and-drop
          analytics dashboard where any endpoint can be pinned as a tile. The
          data layer, Vibe Sense, is already live: define a graph pipeline today
          and it will render automatically when Vibe Board ships.
        </P>
      </Div>
      <CodeBlock code={VIBE_BOARD_SNIPPET} language="bash" />
      <Div className="px-6 pt-4 pb-5">
        <P className="text-xs text-slate-500 leading-relaxed">
          No extra instrumentation. The same definition that drives the REST
          API, CLI, and MCP tool will power the dashboard widget — zero
          additional code required.
        </P>
      </Div>
    </Div>
  );
}

const PLATFORM_PANELS: Record<EndpointPlatformKey, () => JSX.Element> = {
  webApi: WebApiPanel,
  reactUi: ReactUiPanel,
<<<<<<< HEAD
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
=======
  cli: () => <PlaceholderPanel label="cli - coming next" />,
  aiTool: () => <PlaceholderPanel label="aiTool - coming next" />,
  mcpServer: () => <PlaceholderPanel label="mcpServer - coming next" />,
  reactNative: () => <PlaceholderPanel label="reactNative - coming next" />,
  cron: () => <PlaceholderPanel label="cron - coming next" />,
  websocket: () => <PlaceholderPanel label="websocket - coming next" />,
  electron: () => <PlaceholderPanel label="electron - coming next" />,
  adminPanel: () => <PlaceholderPanel label="adminPanel - coming next" />,
  vibeFrame: () => <PlaceholderPanel label="vibeFrame - coming next" />,
  remoteSkill: () => <PlaceholderPanel label="remoteSkill - coming next" />,
  vibeBoard: () => <PlaceholderPanel label="vibeBoard - coming next" />,
>>>>>>> ffa7090e2 (add multi modal support)
};

// ─── Definition snippet (source box) ─────────────────────────────────────────

function DefinitionPanel(): JSX.Element {
  return (
    <Div className="font-mono text-xs bg-[#0d1117] px-5 py-4 leading-5">
      <Div className="text-slate-500">
        {"// definition.ts - the only file you write."}
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
