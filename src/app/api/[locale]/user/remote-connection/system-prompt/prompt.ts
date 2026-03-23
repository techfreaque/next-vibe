/* eslint-disable i18next/no-literal-string */
import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/agent/models/models";

export interface RemoteInstancesData {
  remoteConnections: Array<{ instanceId: string }>;
  instanceId?: string | null;
  knownInstanceIds?: string[];
  /** Whether the current user is an admin */
  isAdmin: boolean;
  /** App name for system context section */
  appName: string;
  /** App URL for system context section */
  appUrl: string;
  /** Whether running in local/self-hosted mode */
  isLocalMode: boolean;
  /** Whether running in development environment */
  isDev: boolean;
}

// ─── System context (leading, admin only) ─────────────────────────────────────

export const systemContextFragment: SystemPromptFragment<RemoteInstancesData> =
  {
    id: "system-context",
    placement: "leading",
    priority: 800,
    condition: (data) => data.isAdmin,
    build: (data) => {
      const {
        appName,
        isLocalMode,
        isDev,
        appUrl,
        instanceId,
        knownInstanceIds,
      } = data;

      const lines = [
        `## System Context`,
        ``,
        `- **Instance:** ${isLocalMode ? "Self-hosted / local" : "Cloud production"} (${appName})`,
        `- **URL:** ${appUrl}`,
      ];

      if (instanceId) {
        lines.push(`- **Instance ID:** ${instanceId}`);
      }

      if (isDev) {
        lines.push(`- **Environment:** development (NODE_ENV=development)`);
        lines.push(`- **Models available:** ${TOTAL_MODEL_COUNT}`);
        lines.push(
          `- **Note:** Dev mode - hot reload active, DB may contain test data, errors are verbose.`,
        );
      }

      const hasKnownInstances = knownInstanceIds && knownInstanceIds.length > 0;

      if (!isLocalMode && !isDev) {
        lines.push(``);
        lines.push(
          `**Your role:** You are the production AI admin for ${appName}. You serve live users, monitor platform health, and delegate development work to local instances via task routing.`,
        );
        lines.push(``);
        lines.push(`**Multi-instance task routing:**`);
        lines.push(
          `Tasks have an optional \`targetInstance\` field. When set, the task only runs on the matching instance.`,
        );
        lines.push(`- \`null\` / empty = runs only on the host instance`);
        if (instanceId) {
          lines.push(`- This instance is \`${instanceId}\``);
        }
        if (hasKnownInstances) {
          lines.push(
            `- **Known instances:** ${knownInstanceIds.map((id) => `\`${id}\``).join(", ")}`,
          );
          lines.push(
            `- Route tasks to any of these instances by setting \`targetInstance\` to the instance ID.`,
          );
        }
        lines.push(``);
        lines.push(
          `**Hermes** is the local dev instance that runs Claude Code for automated task execution. If the user hasn't set up Hermes yet, proactively suggest it - it enables scheduled code tasks, automated PR reviews, and local-only agent work.`,
        );
        lines.push(
          `Setup: connect your local instance via cloud sync in the user settings (Settings → Remote Connection).`,
        );
        lines.push(``);
        lines.push(
          `**You do NOT have direct code execution.** Delegate development tasks to Hermes via task routing (\`targetInstance: "hermes"\`).`,
        );
      } else {
        lines.push(``);
        lines.push(
          `**Your role:** You are the local dev companion on this machine. Your primary job is helping the admin with development, executing tasks via tools (Claude Code, SQL, shell, browser, rebuild), and processing tasks delegated from production.`,
        );
        lines.push(``);
        lines.push(`**Operational context:**`);
        lines.push(
          `- Built/production server: ${appUrl} - this is where you run`,
        );
        if (isDev) {
          lines.push(
            `- Dev server (hot-reload): also running - use for testing UI changes`,
          );
        }
        lines.push(
          `- **Claude Code** is your primary tool for code execution - use it to make codebase changes`,
        );
        lines.push(
          `- Check the **cron dashboard** for tasks delegated from production`,
        );
        lines.push(``);
        lines.push(
          `**Task routing:** Tasks with \`targetInstance\` matching \`${instanceId ?? "(not set)"}\` run here.`,
        );
        if (hasKnownInstances) {
          lines.push(
            `**Known instances:** ${knownInstanceIds.map((id) => `\`${id}\``).join(", ")}`,
          );
        }
      }

      return lines.join("\n");
    },
  };

// ─── Remote instances list (trailing) ─────────────────────────────────────────

export const remoteInstancesFragment: SystemPromptFragment<RemoteInstancesData> =
  {
    id: "remote-instances",
    placement: "trailing",
    priority: 400,
    condition: (data) => (data.remoteConnections?.length ?? 0) > 0,
    build: (data) => {
      const { remoteConnections } = data;
      if (!remoteConnections?.length) {
        return null;
      }

      const lines = remoteConnections.map(
        (c) =>
          `- "${c.instanceId}" - use help(instanceId="${c.instanceId}") to discover tools, execute-tool(toolName, instanceId="${c.instanceId}", input) to run them`,
      );

      return `## Remote Instances\n\nUser has ${remoteConnections.length} connected local instance${remoteConnections.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}\n\nRemote tools use the same callbackMode system as local tools. Default is "wait" - the tool result arrives automatically once the remote instance finishes execution. No special handling needed.`;
    },
  };
