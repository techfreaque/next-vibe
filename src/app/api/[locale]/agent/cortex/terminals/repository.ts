/**
 * Cortex Terminals Repository
 * Lists active terminal sessions from the in-memory session pool.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  getSessionsForConnection,
  sessionPool,
} from "../../../ssh/session/pool";
import type { CortexTerminalsResponseOutput } from "./definition";

export class CortexTerminalsRepository {
  private static parseConnectionSlug(path: string): string | null {
    const match = /^\/ssh\/([^/]+)/.exec(path);
    return match?.[1] ?? null;
  }

  static async list(
    path: string | undefined,
  ): Promise<ResponseType<CortexTerminalsResponseOutput>> {
    const slug = path ? this.parseConnectionSlug(path) : null;

    const sessions = slug
      ? getSessionsForConnection(slug)
      : [...sessionPool.values()];

    const terminals = sessions.map((s) => ({
      terminalId: s.sessionId,
      connectionSlug: s.connectionSlug,
      cwd: s.cwd,
      name: s.name,
      openedAt: s.openedAt.toISOString(),
      lastCommandAt: s.lastCommandAt.toISOString(),
      status: s.status,
    }));

    return success({ terminals, total: terminals.length });
  }
}
