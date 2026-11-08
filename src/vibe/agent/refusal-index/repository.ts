/**
 * Refusal Index - public read repository (leaderboard + per-model stats).
 * Reads the latest COMPLETED run only. Cached in-process; the cache is dropped
 * when a run finishes or an admin changes a sample.
 */

import "server-only";

import { and, desc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ChatModelId } from "../ai-stream/models";
import {
  aggregateVerdicts,
  type ModelAggregate,
  refusalTrend,
  toRates,
} from "./aggregate";
import { TtlCache } from "./cache";
import {
  refusalIndexQuestions,
  refusalIndexResults,
  refusalIndexRuns,
  refusalIndexSamples,
} from "./db";
import { RefusalRunStatus, RefusalVerdict } from "./enum";
import { scopedTranslation } from "./i18n";
import type { LeaderboardResponseOutput } from "./leaderboard/definition";
import type {
  ModelStatsResponseOutput,
  ModelStatsUrlParams,
} from "./model/[modelId]/definition";
import { describeModel, listBenchmarkModels } from "./models";

interface Snapshot {
  run: typeof refusalIndexRuns.$inferSelect;
  /** Sorted lowest refusal first. */
  ranked: ModelAggregate[];
  previous: Map<string, ModelAggregate>;
  categories: string[];
}

const snapshotCache = new TtlCache<Snapshot | null>();
const leaderboardCache = new TtlCache<LeaderboardResponseOutput>();
const modelCache = new TtlCache<ModelStatsResponseOutput>();

async function aggregateRun(runId: string): Promise<ModelAggregate[]> {
  const rows = await db
    .select({
      modelId: refusalIndexResults.modelId,
      category: refusalIndexQuestions.category,
      verdict: refusalIndexResults.verdict,
    })
    .from(refusalIndexResults)
    .innerJoin(
      refusalIndexQuestions,
      eq(refusalIndexResults.questionId, refusalIndexQuestions.id),
    )
    .where(eq(refusalIndexResults.runId, runId));
  return aggregateVerdicts(rows);
}

async function loadSnapshot(): Promise<Snapshot | null> {
  const cached = snapshotCache.get("latest");
  if (cached !== undefined) {
    return cached;
  }
  const runs = await db
    .select()
    .from(refusalIndexRuns)
    .where(eq(refusalIndexRuns.status, RefusalRunStatus.COMPLETED))
    .orderBy(desc(refusalIndexRuns.finishedAt))
    .limit(2);
  const latest = runs[0];
  if (!latest) {
    // Do not cache "no run yet": the first completed run must appear at once.
    return null;
  }
  const current = await aggregateRun(latest.id);
  const previousRun = runs[1];
  const previousAggregates = previousRun
    ? await aggregateRun(previousRun.id)
    : [];

  const benchmarkIds = new Set<string>(
    listBenchmarkModels().map((model) => model.id),
  );
  const ranked = current
    .filter((agg) => agg.judged > 0 && benchmarkIds.has(agg.modelId))
    .toSorted(
      (a, b) =>
        a.refusedPct - b.refusedPct ||
        a.hedgedPct - b.hedgedPct ||
        a.modelId.localeCompare(b.modelId),
    );
  const categories = [
    ...new Set(ranked.flatMap((agg) => Object.keys(agg.byCategory))),
  ].toSorted((a, b) => a.localeCompare(b));
  const snapshot: Snapshot = {
    run: latest,
    ranked,
    previous: new Map(previousAggregates.map((agg) => [agg.modelId, agg])),
    categories,
  };
  snapshotCache.set("latest", snapshot);
  return snapshot;
}

function breakdown(
  agg: ModelAggregate,
): LeaderboardResponseOutput["models"][number]["categoryBreakdown"] {
  return Object.entries(agg.byCategory)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([category, rates]) => ({
      category,
      judged: rates.judged,
      answeredPct: rates.answeredPct,
      hedgedPct: rates.hedgedPct,
      refusedPct: rates.refusedPct,
    }));
}

const EMPTY_META = {
  hasData: false,
  runId: null,
  runFinishedAt: null,
  modelCount: 0,
  questionCount: 0,
  judgeModelId: null,
  judgeModelName: null,
  judgePromptVersion: null,
} as const;

function runMeta(snapshot: Snapshot): {
  hasData: true;
  runId: string;
  runFinishedAt: string | null;
  modelCount: number;
  questionCount: number;
  judgeModelId: string;
  judgeModelName: string;
  judgePromptVersion: string;
} {
  return {
    hasData: true,
    runId: snapshot.run.id,
    runFinishedAt: snapshot.run.finishedAt?.toISOString() ?? null,
    modelCount: snapshot.ranked.length,
    questionCount: snapshot.run.questionCount,
    judgeModelId: snapshot.run.judgeModelId,
    judgeModelName: describeModel(snapshot.run.judgeModelId).name,
    judgePromptVersion: snapshot.run.judgePromptVersion,
  };
}

/** URL segment (id or slug) to a registry model id. */
function resolveModelId(segment: string): string {
  const decoded = decodeURIComponent(segment).toLowerCase();
  const flat = decoded.replaceAll(/[._]+/g, "-");
  const match = Object.values(ChatModelId).find(
    (id) =>
      id.toLowerCase() === decoded ||
      id.toLowerCase().replaceAll(/[._]+/g, "-") === flat,
  );
  return match ?? decoded;
}

export class RefusalPublicRepository {
  static async leaderboard(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeaderboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const hit = leaderboardCache.get("lb");
      if (hit) {
        return success(hit);
      }
      const snapshot = await loadSnapshot();
      if (!snapshot) {
        return success({
          ...EMPTY_META,
          overall: { judged: 0, answeredPct: 0, hedgedPct: 0, refusedPct: 0 },
          categories: [],
          models: [],
        });
      }
      const totals = { answered: 0, hedged: 0, refused: 0, error: 0 };
      for (const agg of snapshot.ranked) {
        totals.answered += agg.answered;
        totals.hedged += agg.hedged;
        totals.refused += agg.refused;
      }
      const overall = toRates(totals);
      const response: LeaderboardResponseOutput = {
        ...runMeta(snapshot),
        overall: {
          judged: overall.judged,
          answeredPct: overall.answeredPct,
          hedgedPct: overall.hedgedPct,
          refusedPct: overall.refusedPct,
        },
        categories: snapshot.categories,
        models: snapshot.ranked.map((agg) => {
          const model = describeModel(agg.modelId);
          return {
            modelId: agg.modelId,
            name: model.name,
            tier: model.tier ?? "",
            judged: agg.judged,
            answeredPct: agg.answeredPct,
            hedgedPct: agg.hedgedPct,
            refusedPct: agg.refusedPct,
            trend: refusalTrend(agg, snapshot.previous.get(agg.modelId)),
            categoryBreakdown: breakdown(agg),
          };
        }),
      };
      leaderboardCache.set("lb", response);
      return success(response);
    } catch (error) {
      logger.error(
        "RefusalPublicRepository.leaderboard failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async modelStats(
    urlPathParams: ModelStatsUrlParams,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ModelStatsResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const modelId = resolveModelId(urlPathParams.modelId);
      const hit = modelCache.get(modelId);
      if (hit) {
        return success(hit);
      }
      const model = describeModel(modelId);
      const snapshot = await loadSnapshot();
      const index = snapshot
        ? snapshot.ranked.findIndex((agg) => agg.modelId === modelId)
        : -1;
      const agg = snapshot && index >= 0 ? snapshot.ranked[index] : undefined;
      if (!snapshot || !agg) {
        const empty: ModelStatsResponseOutput = {
          ...(snapshot ? runMeta(snapshot) : EMPTY_META),
          name: model.name,
          tier: model.tier,
          judged: 0,
          answeredPct: 0,
          hedgedPct: 0,
          refusedPct: 0,
          trend: null,
          rank: null,
          rankedModels: snapshot?.ranked.length ?? 0,
          categoryBreakdown: [],
          samples: [],
        };
        // Empty results are not cached so a freshly finished run shows at once.
        return success(empty);
      }

      const sampleRows = await db
        .select({
          id: refusalIndexSamples.id,
          category: refusalIndexQuestions.category,
          questionEn: refusalIndexQuestions.textEn,
          questionDe: refusalIndexQuestions.textDe,
          questionPl: refusalIndexQuestions.textPl,
          verdict: refusalIndexResults.verdict,
          answerExcerpt: refusalIndexResults.answerExcerpt,
          judgeReason: refusalIndexResults.judgeReason,
        })
        .from(refusalIndexSamples)
        .innerJoin(
          refusalIndexResults,
          eq(refusalIndexSamples.resultId, refusalIndexResults.id),
        )
        .innerJoin(
          refusalIndexQuestions,
          eq(refusalIndexResults.questionId, refusalIndexQuestions.id),
        )
        .where(
          and(
            eq(refusalIndexSamples.visible, true),
            eq(refusalIndexResults.modelId, modelId),
            eq(refusalIndexResults.runId, snapshot.run.id),
          ),
        )
        .orderBy(refusalIndexQuestions.category, refusalIndexQuestions.slug);

      const response: ModelStatsResponseOutput = {
        ...runMeta(snapshot),
        name: model.name,
        tier: model.tier,
        judged: agg.judged,
        answeredPct: agg.answeredPct,
        hedgedPct: agg.hedgedPct,
        refusedPct: agg.refusedPct,
        trend: refusalTrend(agg, snapshot.previous.get(modelId)),
        rank: index + 1,
        rankedModels: snapshot.ranked.length,
        categoryBreakdown: breakdown(agg),
        samples: sampleRows.filter(
          (row) => row.verdict !== RefusalVerdict.ERROR,
        ),
      };
      modelCache.set(modelId, response);
      return success(response);
    } catch (error) {
      logger.error(
        "RefusalPublicRepository.modelStats failed",
        parseError(error),
      );
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
