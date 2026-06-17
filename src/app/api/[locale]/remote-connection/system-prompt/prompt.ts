/* eslint-disable i18next/no-literal-string */
import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

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
  /** Dynamic model count for current user/env */
  totalModelCount: number;
  /** Number of SSH connections configured by this user */
  sshConnectionCount: number;
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
        lines.push(`- **Models available:** ${data.totalModelCount}`);
        lines.push(
          `- **Note:** Dev mode - hot reload active, DB may contain test data, errors are verbose.`,
        );
      }

      const hasKnownInstances = knownInstanceIds && knownInstanceIds.length > 0;

      if (!isLocalMode && !isDev) {
        lines.push(``);
        lines.push(
          `**Role:** Production AI admin for ${appName}. Serve users, monitor platform, delegate dev work to local instances.`,
        );
        lines.push(
          `**Task routing:** Set \`targetInstance\` to route tasks to a specific instance. \`null\` = host only.${instanceId ? ` This instance: \`${instanceId}\`.` : ""}`,
        );
        if (hasKnownInstances) {
          lines.push(
            `**Known instances:** ${knownInstanceIds.map((id) => `\`${id}\``).join(", ")}`,
          );
        }
        lines.push(
          `**Hermes** = local dev instance for code execution. Not set up? Suggest it — Settings → Remote Connection. **You have no direct code execution** — delegate to Hermes.`,
        );
      } else {
        lines.push(``);
        lines.push(
          `**Your role:** Local dev companion. Help with development, execute delegated tasks, process work from production.`,
        );
        lines.push(
          `- Server: ${appUrl}${isDev ? " (also: dev hot-reload server for UI testing)" : ""}`,
        );
        lines.push(
          `- Check the **cron dashboard** for tasks delegated from production.`,
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

// ─── Remote instances list (leading) ──────────────────────────────────────────

export const remoteInstancesFragment: SystemPromptFragment<RemoteInstancesData> =
  {
    id: "remote-instances",
    placement: "leading",
    priority: 850,
    condition: (data) => (data.remoteConnections?.length ?? 0) > 0,
    build: (data) => {
      const { remoteConnections } = data;
      if (!remoteConnections?.length) {
        return null;
      }

      const lines = remoteConnections.map(
        (c) =>
          `- "${c.instanceId}" - use tool-help(instanceId="${c.instanceId}") to discover tools on that instance, execute-tool(toolName='...', instanceId="${c.instanceId}", input={...}) to run them`,
      );

      return `## Remote Instances

${lines.join("\n")}

**Pinned tools** from remote instances are prefixed as \`instanceId__toolName\` in your tool list — call directly, no instanceId needed.`;
    },
  };

// ─── SSH connections context (leading, admin only) ────────────────────────────

export const sshConnectionsFragment: SystemPromptFragment<RemoteInstancesData> =
  {
    id: "ssh-connections",
    placement: "leading",
    priority: 855,
    condition: (data) => data.isAdmin,
    build: (data) => {
      const { sshConnectionCount } = data;

      if (sshConnectionCount === 0) {
        return `## SSH

No SSH connections configured. To run commands on a remote server, add one via **Settings → SSH Connections**.

Note: for dev workflow (code execution, codebase changes on a remote machine), the recommended path is **Settings → Remote Connection** (cloud sync / remote instance) rather than raw SSH. SSH is for connecting arbitrary servers not running next-vibe.`;
      }

      return `## SSH / Machines

${sshConnectionCount} machine${sshConnectionCount === 1 ? "" : "s"} configured (SSH connections + remote instances).

**Execute commands:** \`cortex-exec(path="/ssh/<machine>", command="...")\` — persistent terminal with tracked cwd.
**Browse files:** \`cortex-list(path="/ssh/<machine>/")\` — remote filesystem. \`cortex-read(path="/ssh/<machine>/etc/hosts")\` — read file via SFTP.
**Active terminals:** \`cortex-terminals\` — list all terminals with cwd. Sessions persist between calls.
**Connections:** \`cortex-list(path="/ssh")\` — all machines. Remote instances appear alongside SSH connections.`;
    },
  };
