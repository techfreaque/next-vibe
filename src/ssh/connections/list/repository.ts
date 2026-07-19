/**
 * SSH Connections List Repository
 *
 * Merges SSH connections and active remote connections into a unified list.
 * Read-time merge — no write-time sync needed.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { remoteConnections } from "next-vibe/remote-connection/db";
import { RemoteConnectionRepository } from "next-vibe/remote-connection/repository";

import { sshConnections } from "../../db";
import { SshAuthType } from "../../enum";
import type { ConnectionsListResponseOutput } from "./definition";
import type { ConnectionsListT } from "./i18n";

type Connection = ConnectionsListResponseOutput["connections"][number];

export class ConnectionsListRepository {
  static async list(
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: ConnectionsListT,
  ): Promise<ResponseType<ConnectionsListResponseOutput>> {
    try {
      const [sshRows, remoteRows] = await Promise.all([
        db
          .select({
            id: sshConnections.id,
            label: sshConnections.label,
            host: sshConnections.host,
            port: sshConnections.port,
            username: sshConnections.username,
            authType: sshConnections.authType,
            isDefault: sshConnections.isDefault,
            fingerprint: sshConnections.fingerprint,
            notes: sshConnections.notes,
            createdAt: sshConnections.createdAt,
          })
          .from(sshConnections)
          .where(eq(sshConnections.userId, user.id!)),
        db
          .select({
            id: remoteConnections.id,
            instanceId: remoteConnections.instanceId,
            remoteUrl: remoteConnections.remoteUrl,
            isActive: remoteConnections.isActive,
            lastSyncedAt: remoteConnections.lastSyncedAt,
            transportMode: remoteConnections.transportMode,
            createdAt: remoteConnections.createdAt,
          })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, user.id!),
              eq(remoteConnections.isActive, true),
            ),
          ),
      ]);

      const connections: Connection[] = [];

      // Always ensure a LOCAL entry exists — admin only
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      if (isAdmin) {
        const hasLocal = sshRows.some((c) => c.authType === SshAuthType.LOCAL);
        if (!hasLocal) {
          const hasDefault = sshRows.some((c) => c.isDefault);
          const [inserted] = await db
            .insert(sshConnections)
            .values({
              userId: user.id!,
              label: "Local Machine",
              host: "localhost",
              port: 0,
              username: process.env["USER"] ?? "local",
              authType: SshAuthType.LOCAL,
              encryptedSecret: "",
              isDefault: !hasDefault,
              notes: "Built-in local shell - no SSH credentials needed",
            })
            .returning({
              id: sshConnections.id,
              label: sshConnections.label,
              host: sshConnections.host,
              port: sshConnections.port,
              username: sshConnections.username,
              authType: sshConnections.authType,
              isDefault: sshConnections.isDefault,
              fingerprint: sshConnections.fingerprint,
              notes: sshConnections.notes,
              createdAt: sshConnections.createdAt,
            });
          if (inserted) {
            sshRows.unshift(inserted);
          }
        }
      }

      // Map SSH connections
      for (const r of sshRows) {
        connections.push({
          id: r.id,
          label: r.label,
          host: r.host,
          port: r.port,
          username: r.username,
          authType: r.authType,
          isDefault: r.isDefault,
          fingerprint: r.fingerprint ?? null,
          notes: r.notes ?? null,
          createdAt: r.createdAt.toISOString(),
          connectionType: r.authType === SshAuthType.LOCAL ? "local" : "ssh",
          health: null,
          instanceId: null,
          transportMode: null,
        });
      }

      // Map remote connections
      for (const r of remoteRows) {
        connections.push({
          id: r.id,
          label: r.instanceId,
          host: r.remoteUrl,
          port: 0,
          username: r.instanceId,
          authType: "remote",
          isDefault: false,
          fingerprint: null,
          notes: null,
          createdAt: r.createdAt.toISOString(),
          connectionType: "remote",
          health: RemoteConnectionRepository.getConnectionHealth(r),
          instanceId: r.instanceId,
          transportMode: r.transportMode,
        });
      }

      // Sort: local first, then ssh, then remote. Within each group, by label.
      const typeOrder: Record<string, number> = {
        local: 0,
        ssh: 1,
        remote: 2,
      };
      connections.sort((a, b) => {
        const orderDiff =
          (typeOrder[a.connectionType] ?? 9) -
          (typeOrder[b.connectionType] ?? 9);
        if (orderDiff !== 0) {
          return orderDiff;
        }
        return a.label.localeCompare(b.label);
      });

      logger.debug(
        `Listed ${connections.length} connections (${sshRows.length} SSH + ${remoteRows.length} remote) for user ${user.id!}`,
      );
      return success({ connections });
    } catch (error) {
      logger.error("Failed to list connections", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
