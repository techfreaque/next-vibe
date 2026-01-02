import "server-only";

import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatThreads, threadShareLinks } from "@/app/api/[locale]/agent/chat/db";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";

import type {
  ShareLinkCreateRequestOutput,
  ShareLinkCreateResponseOutput,
  ShareLinkCreateUrlVariablesOutput,
  ShareLinkRevokeRequestOutput,
  ShareLinkRevokeResponseOutput,
  ShareLinksGetResponseOutput,
  ShareLinksGetUrlVariablesOutput,
  ShareLinkUpdateRequestOutput,
  ShareLinkUpdateResponseOutput,
} from "./definition";

/**
 * Thread Share Links Repository
 * Manages share links for threads in SHARED folders
 */
export class ShareLinksRepository {
  /**
   * List all share links for a thread
   */
  static async list(
    urlPathParams: ShareLinksGetUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ShareLinksGetResponseOutput>> {
    if (user.isPublic || !user.id) {
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Listing share links", { threadId: urlPathParams.threadId });

      // Check if thread exists
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user owns the thread
      if (thread.userId !== user.id) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get all share links for this thread
      const links = await db
        .select()
        .from(threadShareLinks)
        .where(eq(threadShareLinks.threadId, urlPathParams.threadId));

      // Transform to match response type
      const shareLinks = links.map((link) => ({
        id: link.id,
        token: link.token,
        shareUrl: `${env.NEXT_PUBLIC_APP_URL}/shared/${link.token}`,
        label: link.label,
        allowPosting: link.allowPosting,
        requireAuth: link.requireAuth,
        active: link.active,
        accessCount: link.accessCount,
        lastAccessedAt: link.lastAccessedAt?.toISOString() ?? null,
        createdAt: link.createdAt.toISOString(),
        editAction: link.id, // Link ID for edit action
        deleteAction: link.id, // Link ID for delete action
      }));

      return success({ shareLinks });
    } catch (error) {
      logger.error("Failed to list share links", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new share link
   */
  static async create(
    data: ShareLinkCreateRequestOutput,
    urlPathParams: ShareLinkCreateUrlVariablesOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ShareLinkCreateResponseOutput>> {
    if (user.isPublic || !user.id) {
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Creating share link", { threadId: urlPathParams.threadId });

      // Check if thread exists and belongs to SHARED folder
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only allow sharing for SHARED folder threads
      if (thread.rootFolderId !== "shared") {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Check if user owns the thread
      if (thread.userId !== user.id) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Generate unique token
      const token = nanoid(32);

      // Create share link
      const [shareLink] = await db
        .insert(threadShareLinks)
        .values({
          threadId: urlPathParams.threadId,
          createdBy: user.id,
          token,
          label: data.label ?? null,
          allowPosting: data.allowPosting ?? false,
          requireAuth: data.requireAuth ?? false,
          active: true,
          accessCount: 0,
        })
        .returning();

      logger.info("Share link created", {
        shareLinkId: shareLink!.id,
        threadId: urlPathParams.threadId,
        userId: user.id,
      });

      return success({
        id: shareLink!.id,
        token: shareLink!.token,
        label: shareLink!.label,
        allowPosting: shareLink!.allowPosting,
        requireAuth: shareLink!.requireAuth,
      });
    } catch (error) {
      logger.error("Failed to create share link", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a share link
   */
  static async update(
    data: ShareLinkUpdateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ShareLinkUpdateResponseOutput>> {
    if (user.isPublic || !user.id) {
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Updating share link", { linkId: data.linkId });

      // Check if link exists
      const [link] = await db
        .select()
        .from(threadShareLinks)
        .where(eq(threadShareLinks.id, data.linkId))
        .limit(1);

      if (!link) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user created the link
      if (link.createdBy !== user.id) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Update the link
      const [updatedLink] = await db
        .update(threadShareLinks)
        .set({
          label: data.label !== undefined ? data.label : link.label,
          allowPosting: data.allowPosting !== undefined ? data.allowPosting : link.allowPosting,
          requireAuth: data.requireAuth !== undefined ? data.requireAuth : link.requireAuth,
          updatedAt: new Date(),
        })
        .where(eq(threadShareLinks.id, data.linkId))
        .returning();

      logger.info("Share link updated", {
        shareLinkId: data.linkId,
        userId: user.id,
      });

      return success({
        id: updatedLink!.id,
        label: updatedLink!.label,
        allowPosting: updatedLink!.allowPosting,
        requireAuth: updatedLink!.requireAuth,
      });
    } catch (error) {
      logger.error("Failed to update share link", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.patch.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Revoke (deactivate) a share link
   */
  static async revoke(
    data: ShareLinkRevokeRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ShareLinkRevokeResponseOutput>> {
    if (user.isPublic || !user.id) {
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Revoking share link", { linkId: data.linkId });

      // Check if link exists
      const [link] = await db
        .select()
        .from(threadShareLinks)
        .where(eq(threadShareLinks.id, data.linkId))
        .limit(1);

      if (!link) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user created the link
      if (link.createdBy !== user.id) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Deactivate the link
      const [updatedLink] = await db
        .update(threadShareLinks)
        .set({
          active: false,
          updatedAt: new Date(),
        })
        .where(eq(threadShareLinks.id, data.linkId))
        .returning();

      logger.info("Share link revoked", {
        shareLinkId: data.linkId,
        userId: user.id,
      });

      return success({ id: updatedLink!.id });
    } catch (error) {
      logger.error("Failed to revoke share link", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get thread by share token (for public access)
   * Also updates access count and last accessed time
   */
  static async getByToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      thread: typeof chatThreads.$inferSelect;
      shareLink: typeof threadShareLinks.$inferSelect;
    }>
  > {
    try {
      logger.debug("Accessing thread via share token");

      // Find active share link
      const [shareLink] = await db
        .select()
        .from(threadShareLinks)
        .where(and(eq(threadShareLinks.token, token), eq(threadShareLinks.active, true)))
        .limit(1);

      if (!shareLink) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, shareLink.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Security check: Ensure thread is still in SHARED folder
      // If thread was moved to a different root folder, share links should not work
      if (thread.rootFolderId !== DefaultFolderId.SHARED) {
        logger.warn("Share link accessed for thread not in SHARED folder", {
          shareLinkId: shareLink.id,
          threadId: thread.id,
          rootFolderId: thread.rootFolderId,
        });
        return fail({
          message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Update access count and last accessed time
      await db
        .update(threadShareLinks)
        .set({
          accessCount: shareLink.accessCount + 1,
          lastAccessedAt: new Date(),
        })
        .where(eq(threadShareLinks.id, shareLink.id));

      logger.info("Share link accessed", {
        shareLinkId: shareLink.id,
        threadId: thread.id,
        accessCount: shareLink.accessCount + 1,
      });

      return success({ thread, shareLink });
    } catch (error) {
      logger.error("Failed to get thread by share token", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.shareLinks.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
