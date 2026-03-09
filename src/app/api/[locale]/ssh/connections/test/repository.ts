/**
 * SSH Connections Test Repository
 * Tests SSH connectivity using ssh2.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  openSshClient,
  saveFingerprint,
  sshExecCommand,
} from "../../client";
import { sshConnections } from "../../db";
import type {
  ConnectionTestRequestOutput,
  ConnectionTestResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class ConnectionTestRepository {
  static async test(
    data: ConnectionTestRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: ModuleT,
  ): Promise<ResponseType<ConnectionTestResponseOutput>> {
    // Verify connection belongs to user
    const [row] = await db
      .select({ id: sshConnections.id })
      .from(sshConnections)
      .where(
        and(
          eq(sshConnections.id, data.connectionId),
          eq(sshConnections.userId, user.id!),
        ),
      );

    if (!row) {
      return fail({
        message: t("errors.connectionNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const credsResult = await getConnectionCredentials(
      data.connectionId,
      user.id!,
      t,
    );
    if (!credsResult.success) {
      return fail({
        message: credsResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const creds = credsResult.data;

    const start = Date.now();
    const clientResult = await openSshClient(
      creds,
      t,
      data.acknowledgeNewFingerprint ?? false,
    );

    if (!clientResult.success) {
      return fail({
        message: clientResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { client, fingerprint, fingerprintChanged } = clientResult.data;

    try {
      // Run a trivial command to confirm authentication
      await sshExecCommand(client, "echo ok", 5000);
    } catch (err) {
      client.end();
      logger.error("SSH test exec failed", parseError(err));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    client.end();
    const latencyMs = Date.now() - start;

    // Persist fingerprint if new or acknowledged change
    if (!creds.fingerprint || fingerprintChanged) {
      await saveFingerprint(data.connectionId, fingerprint).catch(
        (saveErr: Error) => {
          logger.warn("Failed to save fingerprint", parseError(saveErr));
        },
      );
    }

    logger.info(
      `SSH test OK for connection ${data.connectionId} → ${creds.host} (${latencyMs}ms)`,
    );

    return success({
      ok: true,
      latencyMs,
      fingerprint,
      fingerprintChanged,
    });
  }
}
