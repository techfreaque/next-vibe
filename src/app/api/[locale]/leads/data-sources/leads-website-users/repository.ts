/**
 * Leads Website Users — Repository
 * Server-only. DB access.
 * Snapshot: count of leads with WEBSITE_USER status per resolution bucket.
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

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { TimeRange } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import type { Resolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { leads } from "../../db";
import { LeadStatus } from "../../enum";

export class QueryLeadsWebsiteUsersRepository {
  static async queryLeadsWebsiteUsers(data: {
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
            eq(leads.status, LeadStatus.WEBSITE_USER),
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
