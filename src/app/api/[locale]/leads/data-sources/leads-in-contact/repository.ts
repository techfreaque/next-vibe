/**
 * Leads In Contact - Repository
 * Server-only. DB access.
 * Snapshot: count of leads with IN_CONTACT status per resolution bucket.
 */

import "server-only";

import {
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { and, count, eq, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { RESOLUTION_MS } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leads } from "../../db";
import { LeadStatus } from "../../enum";

export class QueryLeadsInContactRepository {
  static async queryLeadsInContact(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const stepMs = RESOLUTION_MS[resolution];
    const points: DataPoint[] = [];

    let ts = range.from.getTime();
    while (ts <= range.to.getTime()) {
      const bucket = new Date(ts);
      const next = new Date(ts + stepMs);

      const [row] = await db
        .select({ cnt: count() })
        .from(leads)
        .where(
          and(
            lt(leads.createdAt, next),
            eq(leads.status, LeadStatus.IN_CONTACT),
          ),
        );

      points.push({ timestamp: bucket, value: Number(row?.cnt ?? 0) });
      ts += stepMs;
    }

    const result = fillGaps(points, range, resolution);
    return success({
      result,
      meta: {
        actualResolution: resolution ?? "enums.resolution.1d",
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
