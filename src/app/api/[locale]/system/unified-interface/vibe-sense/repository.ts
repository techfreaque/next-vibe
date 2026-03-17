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
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { runBacktest } from "./engine/backtest";
import { runGraph } from "./engine/runner";
import { runDueGraphs } from "./engine/scheduler";
import { evictExpiredSnapshots } from "./store/cache";
import { runAllRetentionCleanup } from "./store/datapoints";
import { cleanupOldSignals } from "./store/signals";
import { pipelineDatapoints, pipelineGraphs } from "./db";
import type { VibeSenseT } from "./i18n";

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
  series: GraphDataResponse["series"];
  signals: GraphDataResponse["signals"];
}

export interface GraphEditInput {
  name?: string;
  slug?: string;
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
  resolution: Resolution;
  cursor?: string;
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

/**
 * Downsample a raw (typically 1-minute) series into buckets of `bucketMs` width.
 * Each bucket timestamp = floor of first point in bucket.
 * Bucket value = average of all points that fall within the bucket.
 * If bucketMs < the smallest stored interval (1 minute) the original points are returned unchanged.
 */
function downsampleToResolution(
  points: Array<{ timestamp: Date; value: number }>,
  bucketMs: number,
): Array<{ timestamp: Date; value: number }> {
  const ONE_MINUTE_MS = 60_000;
  if (bucketMs <= ONE_MINUTE_MS || points.length === 0) {
    return points;
  }

  const buckets = new Map<number, number[]>();
  for (const p of points) {
    const bucketKey = Math.floor(p.timestamp.getTime() / bucketMs) * bucketMs;
    const existing = buckets.get(bucketKey);
    if (existing) {
      existing.push(p.value);
    } else {
      buckets.set(bucketKey, [p.value]);
    }
  }

  return [...buckets.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([ts, values]) => ({
      timestamp: new Date(ts),
      value: values.reduce((sum, v) => sum + v, 0) / values.length,
    }));
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
    params: { resolution: Resolution; cursor?: string },
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

      let series: GraphDataResponse["series"] = [];
      let signals: GraphDataResponse["signals"] = [];

      const dataResult = await VibeSenseRepository.getGraphData(
        id,
        { resolution: params.resolution, cursor: params.cursor },
        user,
        logger,
        t,
      );
      if (dataResult.success) {
        series = dataResult.data.series;
        signals = dataResult.data.signals;
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
        series,
        signals,
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

      const newSlug = data.slug ?? parent.slug;

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
        // If slug changed, also deactivate any existing active version under the new slug
        if (newSlug !== parent.slug) {
          await db
            .update(pipelineGraphs)
            .set({ isActive: false })
            .where(
              and(
                eq(pipelineGraphs.slug, newSlug),
                eq(pipelineGraphs.ownerId, user.id!),
                eq(pipelineGraphs.isActive, true),
              ),
            );
        }
      }

      // Create new branch
      const [newRow] = await db
        .insert(pipelineGraphs)
        .values({
          slug: newSlug,
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

  // ─── Version Chain ────────────────────────────────────────────────────────────

  /**
   * Walk the parentVersionId chain from a given graph ID upward (toward ancestors),
   * collecting up to 50 versions. Returns oldest-first sorted array.
   */
  static async getVersionChain(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: VibeSenseT,
  ): Promise<
    ResponseType<{
      versions: Array<{
        id: string;
        name: string;
        createdAt: string;
        isActive: boolean;
      }>;
    }>
  > {
    try {
      const MAX_CHAIN = 50;
      const chain: Array<{
        id: string;
        name: string;
        createdAt: string;
        isActive: boolean;
      }> = [];

      let currentId: string | null = id;
      const visited = new Set<string>();

      while (currentId && chain.length < MAX_CHAIN) {
        if (visited.has(currentId)) {
          break;
        }
        visited.add(currentId);

        const rows: Array<{
          id: string;
          name: string;
          createdAt: Date;
          isActive: boolean;
          parentVersionId: string | null;
          ownerType: string;
          ownerId: string | null;
        }> = await db
          .select({
            id: pipelineGraphs.id,
            name: pipelineGraphs.name,
            createdAt: pipelineGraphs.createdAt,
            isActive: pipelineGraphs.isActive,
            parentVersionId: pipelineGraphs.parentVersionId,
            ownerType: pipelineGraphs.ownerType,
            ownerId: pipelineGraphs.ownerId,
          })
          .from(pipelineGraphs)
          .where(eq(pipelineGraphs.id, currentId))
          .limit(1);

        const row: (typeof rows)[0] | undefined = rows[0];
        if (!row) {
          break;
        }

        // Authorization: admin can see system graphs and their own graphs
        if (row.ownerType !== "system" && row.ownerId !== user.id) {
          break;
        }

        chain.push({
          id: row.id,
          name: row.name,
          createdAt: row.createdAt.toISOString(),
          isActive: row.isActive,
        });

        currentId = row.parentVersionId;
      }

      // Sort oldest-first (reverse the collected chain which was collected newest-first)
      chain.reverse();

      logger.info(
        `[vibe-sense] getVersionChain: ${String(chain.length)} versions for graph ${id}`,
      );
      return success({ versions: chain });
    } catch (error) {
      logger.error("[vibe-sense] getVersionChain failed", parseError(error));
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

      // Fetch a fixed number of bars (~300) at the requested resolution.
      // This keeps the query size proportional regardless of resolution.
      const resMs = RESOLUTION_MS[data.resolution];
      const TARGET_BARS = 300;
      const rangeTo = data.cursor ? new Date(data.cursor) : new Date();
      const rangeFrom = new Date(rangeTo.getTime() - TARGET_BARS * resMs);

      const range = { from: rangeFrom, to: rangeTo };

      const result = await runGraph(graph.id, graph.config, range, undefined, {
        readOnly: true,
        displayResolution: data.resolution,
      });

      const series = [...result.series.entries()].map(([nodeId, points]) => ({
        nodeId,
        points: downsampleToResolution(points, resMs).map((p) => ({
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

      logger.debug(
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
