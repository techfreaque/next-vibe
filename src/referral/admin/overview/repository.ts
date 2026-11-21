/**
 * Referral Overview (admin) - Repository
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";

import { previousSpan } from "../../analytics/overview";
import {
  type CodeMetricsRow,
  queryCodeMetrics,
  queryDataFloor,
  queryPartnerBalances,
  queryPayoutStates,
  querySeries,
  queryTotals,
  type ReferralScopeFilters,
} from "../../analytics/queries";
import {
  buildCodeRow,
  buildKpis,
  buildPayoutQueue,
  buildTrend,
} from "../../analytics/rows";
import type {
  ReferralOverviewGetRequestOutput,
  ReferralOverviewGetResponseOutput,
} from "./definition";
import { ReferralCodeSort, type ReferralCodeSortValue } from "./enum";
import type { ReferralOverviewT } from "./i18n";

interface OwnerMoney {
  queueCents: number;
  freeCents: number;
}

function sortValue(
  row: CodeMetricsRow,
  sort: ReferralCodeSortValue,
  owners: ReadonlyMap<string, OwnerMoney>,
): number {
  switch (sort) {
    case ReferralCodeSort.OWNER_QUEUE:
      return owners.get(row.ownerUserId)?.queueCents ?? 0;
    case ReferralCodeSort.OWNER_FREE: {
      // Owners with money queued or over-committed first, lowest free first;
      // owners with nothing queued sink to the bottom.
      const owner = owners.get(row.ownerUserId);
      const free = owner?.freeCents ?? 0;
      const needsAction = (owner?.queueCents ?? 0) > 0 || free < 0;
      return needsAction ? 1e12 - free : -1e12 - free;
    }
    case ReferralCodeSort.COMMISSION:
      return row.commissionCents;
    case ReferralCodeSort.PAYERS:
      return row.payers;
    case ReferralCodeSort.SIGNUPS:
      return row.signups;
    case ReferralCodeSort.LEADS:
      return row.leads;
    case ReferralCodeSort.CLICKS:
      return row.clicks;
    case ReferralCodeSort.CONVERSION:
      return row.clicks > 0 ? row.signups / row.clicks : -1;
    case ReferralCodeSort.NEWEST:
      return row.createdAt.getTime();
    default:
      return row.revenueCents;
  }
}

/** Descending by the chosen metric; ties by revenue, signups, clicks, code. */
export function sortCodes(
  rows: readonly CodeMetricsRow[],
  sort: ReferralCodeSortValue,
  owners: ReadonlyMap<string, OwnerMoney> = new Map(),
): CodeMetricsRow[] {
  return rows.toSorted(
    (a, b) =>
      sortValue(b, sort, owners) - sortValue(a, sort, owners) ||
      b.revenueCents - a.revenueCents ||
      b.signups - a.signups ||
      b.clicks - a.clicks ||
      a.code.localeCompare(b.code),
  );
}

export const ReferralOverviewRepository = {
  async getOverview(
    data: ReferralOverviewGetRequestOutput,
    logger: EndpointLogger,
    t: ReferralOverviewT,
  ): Promise<ResponseType<ReferralOverviewGetResponseOutput>> {
    try {
      const filters: ReferralScopeFilters = {
        search: data.search,
        ownerUserId: data.ownerUserId,
        activeOnly: data.activeOnly,
      };
      const floor = await queryDataFloor(filters);
      const win = resolveAnalyticsWindow(data, new Date(), floor);
      const range = { from: win.from, to: win.to };
      const prevRange = previousSpan(win);
      const [current, previous, series, codes, previousCodes, payoutStates] =
        await Promise.all([
          queryTotals(filters, range),
          prevRange ? queryTotals(filters, prevRange) : Promise.resolve(null),
          querySeries(filters, range, win.bucket),
          queryCodeMetrics(filters, range),
          prevRange
            ? queryCodeMetrics(filters, prevRange)
            : Promise.resolve(null),
          queryPayoutStates(filters),
        ]);
      const balances = await queryPartnerBalances([
        ...new Set(codes.map((row) => row.ownerUserId)),
      ]);
      const owners = new Map<string, OwnerMoney>(
        [...balances].map(([userId, balance]) => [
          userId,
          { queueCents: balance.openPayoutCents, freeCents: balance.freeCents },
        ]),
      );
      const shown = sortCodes(codes, data.sortBy, owners).slice(0, data.limit);
      const previousSignups = new Map(
        (previousCodes ?? []).map((row) => [row.codeId, row.signups]),
      );
      return success({
        window: serializeWindow(win),
        kpis: buildKpis(current, previous),
        trend: buildTrend(win, series),
        codes: shown.map((row) => {
          const balance = balances.get(row.ownerUserId);
          return buildCodeRow(row, {
            signupsPrevious: previousCodes
              ? (previousSignups.get(row.codeId) ?? 0)
              : null,
            ownerQueueCents: balance?.openPayoutCents ?? 0,
            ownerFreeCents: balance?.freeCents ?? 0,
          });
        }),
        codesTotal: codes.length,
        overCommittedOwners: [...balances.values()].filter(
          (balance) => balance.freeCents < 0,
        ).length,
        payouts: buildPayoutQueue(payoutStates),
      });
    } catch (error) {
      logger.error("Failed to build referral overview", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
