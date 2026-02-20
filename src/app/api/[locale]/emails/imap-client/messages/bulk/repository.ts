/**
 * Bulk Message Actions Repository
 * Applies an action to multiple messages at once
 */

import "server-only";

import { inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { emails } from "@/app/api/[locale]/emails/messages/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { BulkMessageAction } from "../../enum";
import type { BulkMessageResponseOutput } from "./definition";

interface BulkActionData {
  ids: string[];
  action: string;
}

export async function bulkUpdateMessages(
  data: BulkActionData,
  logger: EndpointLogger,
): Promise<ResponseType<BulkMessageResponseOutput>> {
  try {
    logger.debug("Bulk updating messages", {
      count: data.ids.length,
      action: data.action,
    });

    let updateData: Partial<typeof emails.$inferInsert> = {};

    switch (data.action) {
      case BulkMessageAction.MARK_READ:
        updateData = { isRead: true, updatedAt: new Date() };
        break;
      case BulkMessageAction.MARK_UNREAD:
        updateData = { isRead: false, updatedAt: new Date() };
        break;
      case BulkMessageAction.FLAG:
        updateData = { isFlagged: true, updatedAt: new Date() };
        break;
      case BulkMessageAction.UNFLAG:
        updateData = { isFlagged: false, updatedAt: new Date() };
        break;
      case BulkMessageAction.DELETE:
        updateData = { isDeleted: true, updatedAt: new Date() };
        break;
      default:
        return fail({
          message:
            "app.api.emails.imapClient.messages.bulk.post.errors.validation.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { error: `Unknown action: ${data.action}` },
        });
    }

    const result = await db
      .update(emails)
      .set(updateData)
      .where(inArray(emails.id, data.ids))
      .returning({ id: emails.id });

    logger.info("Bulk update completed", {
      action: data.action,
      requested: data.ids.length,
      updated: result.length,
    });

    return success({ updated: result.length });
  } catch (err) {
    logger.error("Bulk update failed", parseError(err));
    return fail({
      message:
        "app.api.emails.imapClient.messages.bulk.post.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parseError(err).message },
    });
  }
}
