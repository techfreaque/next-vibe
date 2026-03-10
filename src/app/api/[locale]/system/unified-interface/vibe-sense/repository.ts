/**
 * Vibe Sense — Repository
 *
 * All DB operations for graphs, registry, triggers, and backtests.
 */

import "server-only";

import { and, eq, isNull, or, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { GraphConfig } from "./graph/types";
import { getAllIndicatorMeta, initializeRegistry } from "./indicators/registry";
import type { IndicatorMeta, Resolution } from "./indicators/types";
import { runBacktest } from "./engine/backtest";
import { runGraph } from "./engine/runner";
import { runDueGraphs } from "./engine/scheduler";
import { evictExpiredSnapshots } from "./store/cache";
import { runAllRetentionCleanup } from "./store/datapoints";
import { cleanupOldSignals } from "./store/signals";
import { pipelineDatapoints, pipelineGraphs } from "./db";
import type { VibeSenseT } from "./i18n";

// ─── Registry ─────────────────────────────────────────────────────────────────

export interface RegistryResponse {
  indicators: IndicatorMeta[];
}

export class VibeSenseRegistryRepository {
  static async getRegistry(
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<RegistryResponse>> {
    try {
      await initializeRegistry();
      const indicators = getAllIndicatorMeta();
      logger.debug(`[vibe-sense] Registry: ${indicators.length} indicators`);
      return success({ indicators });
    } catch (error) {
      logger.error("[vibe-sense] Failed to load registry", parseError(error));
      return fail({
        message: t("registry.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// ─── Graph CRUD ───────────────────────────────────────────────────────────────

export interface GraphSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  ownerType: string;
  ownerId: string | null;
  parentVersionId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface GraphListResponse {
  graphs: GraphSummary[];
}

export interface GraphCreateInput {
  name: string;
  slug: string;
  description?: string;
  config: GraphConfig;
}

export interface GraphCreateResponse {
  id: string;
}

export interface GraphGetResponse {
  graph: GraphSummary & { config: GraphConfig };
}

export interface GraphEditInput {
  name?: string;
  description?: string;
  config: GraphConfig;
}

export interface GraphEditResponse {
  newId: string;
}

export interface GraphTriggerInput {
  rangeFrom: string;
  rangeTo: string;
}

export interface GraphTriggerResponse {
  nodeCount: number;
  errorCount: number;
  errors: Array<{ nodeId: string; error: string }>;
}

export interface GraphBacktestInput {
  rangeFrom: string;
  rangeTo: string;
  resolution: Resolution;
}

export interface GraphBacktestResponse {
  runId: string;
  eligible: boolean;
  ineligibleNodes: string[];
}

export interface GraphDataInput {
  rangeFrom: string;
  rangeTo: string;
}

export interface GraphDataResponse {
  series: Array<{
    nodeId: string;
    points: Array<{ timestamp: string; value: number }>;
  }>;
  signals: Array<{
    nodeId: string;
    events: Array<{ timestamp: string; fired: boolean }>;
  }>;
}

export interface CleanupResponse {
  nodesProcessed: number;
  totalDeleted: number;
  snapshotsDeleted: number;
  graphsChecked: number;
  graphsExecuted: number;
}

export class VibeSenseRepository {
  // ─── Config Validation ──────────────────────────────────────────────────────

  /**
   * Validate referential integrity of a GraphConfig.
   * Returns null if valid, or a fail() ResponseType if invalid.
   */
  private static validateConfig(
    config: GraphConfig,
    t: VibeSenseT,
    logger?: EndpointLogger,
  ): ResponseType<never> | null {
    const nodeIds = new Set(Object.keys(config.nodes));
    const badEdges: string[] = [];

    for (const edge of config.edges) {
      if (!nodeIds.has(edge.from)) {
        badEdges.push(`Edge references unknown source node: ${edge.from}`);
      }
      if (!nodeIds.has(edge.to)) {
        badEdges.push(`Edge references unknown target node: ${edge.to}`);
      }
    }

    if (badEdges.length > 0) {
      logger?.warn("[vibe-sense] validateConfig: bad edges", badEdges);
      return fail({
        message: t("graphs.create.errors.validation.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return null;
  }

  // ─── List Graphs ────────────────────────────────────────────────────────────

  static async listGraphs(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphListResponse>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(
          and(
            eq(pipelineGraphs.isActive, true),
            isNull(pipelineGraphs.archivedAt),
            or(
              eq(pipelineGraphs.ownerType, "system"),
              eq(pipelineGraphs.ownerId, user.id!),
            ),
          ),
        )
        .orderBy(pipelineGraphs.createdAt);

      const graphs: GraphSummary[] = rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        ownerType: r.ownerType,
        ownerId: r.ownerId,
        parentVersionId: r.parentVersionId,
        isActive: r.isActive,
        createdAt: r.createdAt.toISOString(),
      }));

      return success({ graphs });
    } catch (error) {
      logger.error("[vibe-sense] listGraphs failed", parseError(error));
      return fail({
        message: t("graphs.list.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Create Graph ────────────────────────────────────────────────────────────

  static async createGraph(
    data: GraphCreateInput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphCreateResponse>> {
    try {
      // Validate config referential integrity
      const configError = VibeSenseRepository.validateConfig(
        data.config,
        t,
        logger,
      );
      if (configError) {
        return configError;
      }

      // Check slug uniqueness for this user
      const existing = await db
        .select({ id: pipelineGraphs.id })
        .from(pipelineGraphs)
        .where(
          and(
            eq(pipelineGraphs.slug, data.slug),
            eq(pipelineGraphs.ownerId, user.id!),
            eq(pipelineGraphs.isActive, true),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return fail({
          message: t("graphs.create.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [row] = await db
        .insert(pipelineGraphs)
        .values({
          slug: data.slug,
          name: data.name,
          description: data.description ?? null,
          ownerType: "admin",
          ownerId: user.id!,
          parentVersionId: null,
          config: data.config,
          isActive: true,
        })
        .returning({ id: pipelineGraphs.id });

      if (!row) {
        return fail({
          message: t("graphs.create.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info(`[vibe-sense] Created graph ${row.id} (${data.slug})`);
      return success({ id: row.id });
    } catch (error) {
      logger.error("[vibe-sense] createGraph failed", parseError(error));
      return fail({
        message: t("graphs.create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Get Graph ───────────────────────────────────────────────────────────────

  static async getGraph(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphGetResponse>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const row = rows[0];
      if (!row) {
        return fail({
          message: t("graphs.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Access check: system graphs visible to all admins, others only to owner
      if (row.ownerType !== "system" && row.ownerId !== user.id) {
        return fail({
          message: t("graphs.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
        graph: {
          id: row.id,
          slug: row.slug,
          name: row.name,
          description: row.description,
          ownerType: row.ownerType,
          ownerId: row.ownerId,
          parentVersionId: row.parentVersionId,
          isActive: row.isActive,
          createdAt: row.createdAt.toISOString(),
          config: row.config,
        },
      });
    } catch (error) {
      logger.error("[vibe-sense] getGraph failed", parseError(error));
      return fail({
        message: t("graphs.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Edit (Branch) Graph ──────────────────────────────────────────────────────

  static async editGraph(
    id: string,
    data: GraphEditInput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphEditResponse>> {
    try {
      // Validate config referential integrity
      const configError = VibeSenseRepository.validateConfig(
        data.config,
        t,
        logger,
      );
      if (configError) {
        return configError;
      }

      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const parent = rows[0];
      if (!parent) {
        return fail({
          message: t("graphs.edit.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // System graphs are read-only — cannot branch from system directly
      // Admins can branch from any graph they can see
      if (parent.ownerType !== "system" && parent.ownerId !== user.id) {
        return fail({
          message: t("graphs.edit.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Deactivate old active version for this slug+owner (if same owner)
      if (parent.ownerType !== "system") {
        await db
          .update(pipelineGraphs)
          .set({ isActive: false })
          .where(
            and(
              eq(pipelineGraphs.slug, parent.slug),
              eq(pipelineGraphs.ownerId, user.id!),
              eq(pipelineGraphs.isActive, true),
            ),
          );
      }

      // Create new branch
      const [newRow] = await db
        .insert(pipelineGraphs)
        .values({
          slug: parent.slug,
          name: data.name ?? parent.name,
          description: data.description ?? parent.description,
          ownerType: "admin",
          ownerId: user.id!,
          parentVersionId: parent.id,
          config: data.config,
          isActive: true,
        })
        .returning({ id: pipelineGraphs.id });

      if (!newRow) {
        return fail({
          message: t("graphs.edit.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info(`[vibe-sense] Branched graph ${id} → ${newRow.id}`);
      return success({ newId: newRow.id });
    } catch (error) {
      logger.error("[vibe-sense] editGraph failed", parseError(error));
      return fail({
        message: t("graphs.edit.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Promote to System ────────────────────────────────────────────────────────

  static async promoteGraph(
    id: string,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<{ promotedId: string }>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const graph = rows[0];
      if (!graph) {
        return fail({
          message: t("graphs.promote.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Deactivate existing system graph with same slug
      await db
        .update(pipelineGraphs)
        .set({ isActive: false })
        .where(
          and(
            eq(pipelineGraphs.slug, graph.slug),
            eq(pipelineGraphs.ownerType, "system"),
            eq(pipelineGraphs.isActive, true),
          ),
        );

      // Promote this version to system
      await db
        .update(pipelineGraphs)
        .set({ ownerType: "system", ownerId: null })
        .where(eq(pipelineGraphs.id, id));

      logger.info(`[vibe-sense] Promoted graph ${id} to system`);
      return success({ promotedId: id });
    } catch (error) {
      logger.error("[vibe-sense] promoteGraph failed", parseError(error));
      return fail({
        message: t("graphs.promote.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Trigger (On-Demand) ──────────────────────────────────────────────────────

  static async triggerGraph(
    id: string,
    data: GraphTriggerInput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphTriggerResponse>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const graph = rows[0];
      if (!graph) {
        return fail({
          message: t("graphs.trigger.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (graph.ownerType !== "system" && graph.ownerId !== user.id) {
        return fail({
          message: t("graphs.trigger.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const range = {
        from: new Date(data.rangeFrom),
        to: new Date(data.rangeTo),
      };

      await initializeRegistry();
      const result = await runGraph(graph.id, graph.config, range);

      return success({
        nodeCount: result.series.size + result.signals.size,
        errorCount: result.errors.length,
        errors: result.errors,
      });
    } catch (error) {
      logger.error("[vibe-sense] triggerGraph failed", parseError(error));
      return fail({
        message: t("graphs.trigger.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Backtest ─────────────────────────────────────────────────────────────────

  static async backtestGraph(
    id: string,
    data: GraphBacktestInput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphBacktestResponse>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const graph = rows[0];
      if (!graph) {
        return fail({
          message: t("graphs.backtest.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (graph.ownerType !== "system" && graph.ownerId !== user.id) {
        return fail({
          message: t("graphs.backtest.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const range = {
        from: new Date(data.rangeFrom),
        to: new Date(data.rangeTo),
      };

      await initializeRegistry();
      const result = await runBacktest(
        graph.id,
        graph.id, // version id = graph id (current version)
        graph.config,
        range,
        data.resolution,
      );

      return success({
        runId: result.runId,
        eligible: result.eligible,
        ineligibleNodes: result.ineligibleNodeIds,
      });
    } catch (error) {
      logger.error("[vibe-sense] backtestGraph failed", parseError(error));
      return fail({
        message: t("graphs.backtest.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Data (on-demand render) ──────────────────────────────────────────────────

  static async getGraphData(
    id: string,
    data: GraphDataInput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<GraphDataResponse>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const graph = rows[0];
      if (!graph) {
        return fail({
          message: t("graphs.data.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (graph.ownerType !== "system" && graph.ownerId !== user.id) {
        return fail({
          message: t("graphs.data.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const range = {
        from: new Date(data.rangeFrom),
        to: new Date(data.rangeTo),
      };

      await initializeRegistry();
      const result = await runGraph(graph.id, graph.config, range, undefined, {
        readOnly: true,
      });

      const series = [...result.series.entries()].map(([nodeId, points]) => ({
        nodeId,
        points: points.map((p) => ({
          timestamp: p.timestamp.toISOString(),
          value: p.value,
        })),
      }));

      const signals = [...result.signals.entries()].map(([nodeId, events]) => ({
        nodeId,
        events: events.map((e) => ({
          timestamp: e.timestamp.toISOString(),
          fired: e.fired,
        })),
      }));

      return success({ series, signals });
    } catch (error) {
      logger.error("[vibe-sense] getGraphData failed", parseError(error));
      return fail({
        message: t("graphs.data.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Archive ──────────────────────────────────────────────────────────────────

  static async archiveGraph(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<{ archivedId: string }>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const graph = rows[0];
      if (!graph) {
        return fail({
          message: t("graphs.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (graph.ownerType === "system") {
        return fail({
          message: t("graphs.edit.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (graph.ownerId !== user.id) {
        return fail({
          message: t("graphs.edit.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      await db
        .update(pipelineGraphs)
        .set({ isActive: false, archivedAt: new Date() })
        .where(eq(pipelineGraphs.id, id));

      logger.info(`[vibe-sense] Archived graph ${id}`);
      return success({ archivedId: id });
    } catch (error) {
      logger.error("[vibe-sense] archiveGraph failed", parseError(error));
      return fail({
        message: t("graphs.edit.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  static async deleteGraph(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<{ deletedId: string }>> {
    try {
      const rows = await db
        .select()
        .from(pipelineGraphs)
        .where(eq(pipelineGraphs.id, id))
        .limit(1);

      const graph = rows[0];
      if (!graph) {
        return fail({
          message: t("graphs.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (graph.ownerType === "system") {
        return fail({
          message: t("graphs.edit.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (graph.ownerId !== user.id) {
        return fail({
          message: t("graphs.edit.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Check for existing datapoints — only allow hard delete if no data
      const dataCheck = await db
        .select({ count: sql<number>`count(*)` })
        .from(pipelineDatapoints)
        .where(eq(pipelineDatapoints.graphId, id));

      const dataCount = Number(dataCheck[0]?.count ?? 0);
      if (dataCount > 0) {
        return fail({
          message: t("graphs.edit.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db.delete(pipelineGraphs).where(eq(pipelineGraphs.id, id));

      logger.info(`[vibe-sense] Deleted graph ${id}`);
      return success({ deletedId: id });
    } catch (error) {
      logger.error("[vibe-sense] deleteGraph failed", parseError(error));
      return fail({
        message: t("graphs.edit.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────────

  static async runCleanup(
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<ResponseType<CleanupResponse>> {
    try {
      const [retention, snapshots, scheduler, signalsDeleted] =
        await Promise.all([
          runAllRetentionCleanup(),
          evictExpiredSnapshots(),
          runDueGraphs(logger),
          cleanupOldSignals(90), // 90-day signal retention
        ]);

      logger.info(
        `[vibe-sense] Cleanup: ${retention.nodesProcessed} nodes, ` +
          `${retention.totalDeleted} rows deleted, ` +
          `${snapshots.deleted} snapshots evicted, ` +
          `${signalsDeleted} signals cleaned, ` +
          `${scheduler.graphsExecuted}/${scheduler.graphsChecked} graphs executed`,
      );

      return success({
        nodesProcessed: retention.nodesProcessed,
        totalDeleted: retention.totalDeleted + signalsDeleted,
        snapshotsDeleted: snapshots.deleted,
        graphsChecked: scheduler.graphsChecked,
        graphsExecuted: scheduler.graphsExecuted,
      });
    } catch (error) {
      logger.error("[vibe-sense] cleanup failed", parseError(error));
      return fail({
        message: t("cleanup.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
