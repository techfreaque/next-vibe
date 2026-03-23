/**
 * SSH Terminal Repository
 * No-op - terminal widget manages its own sessions via session/* endpoints
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { TerminalResponseOutput } from "./definition";

export class TerminalRepository {
  static async get(): Promise<ResponseType<TerminalResponseOutput>> {
    return success({ ok: true });
  }
}
