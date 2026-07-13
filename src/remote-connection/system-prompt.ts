/* eslint-disable i18next/no-literal-string */
import "server-only";

import { count, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type {
  RemoteInstancesContext,
  SystemPromptFragment,
  SystemPromptServerParams,
} from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";
import { getEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { sshConnections } from "@/app/api/[locale]/ssh/db";
import { envClient } from "@/config/env-client";

import { remoteConnections } from "./db";
import { RemoteConnectionRepository } from "./repository";

// ─── Shared pre-fetch ─────────────────────────────────────────────────────────

export async function loadRemoteInstancesContext(
  params: SystemPromptServerParams,
): Promise<RemoteInstancesContext | undefined> {
  if (params.user.isPublic) {
    return undefined;
  }

  const isAdmin = params.user.roles.includes(UserPermissionRole.ADMIN);
  const userId = params.user.id;

  const [rows, selfInstanceId, sshCount] = await Promise.all([
    db
      .select({ instanceId: remoteConnections.instanceId })
      .from(remoteConnections)
      .where(eq(remoteConnections.userId, userId)),
    RemoteConnectionRepository.getLocalInstanceId(userId),
    db
      .select({ count: count() })
      .from(sshConnections)
      .where(eq(sshConnections.userId, userId)),
  ]);

  const appUrl = envClient.NEXT_PUBLIC_APP_URL;
  const isLocalMode = envClient.NEXT_PUBLIC_LOCAL_MODE;
  const isDev = process.env["NODE_ENV"] === "development";
  const totalModelCount = getAvailableModelCount(isAdmin, getEnvAvailability());

  return {
    remoteConnections: rows,
    instanceId: selfInstanceId,
    knownInstanceIds: rows.map((r) => r.instanceId).filter(Boolean),
    isAdmin,
    appName: params.appName ?? "",
    appUrl,
    isLocalMode,
    isDev,
    totalModelCount,
    sshConnectionCount: sshCount[0]?.count ?? 0,
  };
}

// ─── Fragments ─────────────────────────────────────────────────────────────────

export const systemContextFragment: SystemPromptFragment = {
  id: "system-context",
  placement: "leading",
  priority: 800,
  build: async (params) => {
    const ctx = params.remoteInstancesContext;
    if (!ctx?.isAdmin) {
      return null;
    }

    const {
      appName,
      isLocalMode,
      isDev,
      appUrl,
      instanceId,
      knownInstanceIds,
    } = ctx;

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
      lines.push(`- **Models available:** ${ctx.totalModelCount}`);
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

export const remoteInstancesFragment: SystemPromptFragment = {
  id: "remote-instances",
  placement: "leading",
  priority: 850,
  build: async (params) => {
    const connections = params.remoteInstancesContext?.remoteConnections ?? [];
    if (connections.length === 0) {
      return null;
    }

    const lines = connections.map(
      (c) =>
        `- "${c.instanceId}" - use tool-help(instanceId="${c.instanceId}") to discover tools on that instance, execute-tool(toolName='...', instanceId="${c.instanceId}", input={...}) to run them`,
    );

    return `## Remote Instances

${lines.join("\n")}

**Pinned tools** from remote instances are prefixed as \`instanceId__toolName\` in your tool list — call directly, no instanceId needed.`;
  },
};

export const sshConnectionsFragment: SystemPromptFragment = {
  id: "ssh-connections",
  placement: "leading",
  priority: 855,
  build: async (params) => {
    const ctx = params.remoteInstancesContext;
    if (!ctx?.isAdmin) {
      return null;
    }

    const { sshConnectionCount } = ctx;

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
