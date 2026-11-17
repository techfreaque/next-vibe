/**
 * Refusal Index - Runs Repository
 * List / detail for admins and the start-run entry point (also used by the cron task).
 */

import "server-only";

import { and, count, desc, eq, ilike, inArray } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatModelOptionsIndex } from "../../ai-stream/models";
import { calculateCreditCost } from "../../models/models";
import type { Pair } from "../aggregate";
import {
  DEFAULT_BUDGET_CREDITS,
  ESTIMATE_SPEND_FACTOR,
  JUDGE_MODEL_ID,
  JUDGE_PROMPT_VERSION,
  RUNNER_PROMPT_VERSION,
  STALE_RUN_MS,
} from "../constants";
import {
  refusalIndexQuestions,
  refusalIndexResults,
  refusalIndexRuns,
  refusalIndexSamples,
} from "../db";
import { RefusalRunStatus, RefusalVerdict } from "../enum";
import { scopedTranslation } from "../i18n";
import { describeModel, listBenchmarkModels } from "../models";
import { estimateGenerationCredits } from "../question-gen";
import {
  ESTIMATED_PAIR_TOKENS,
  executeRun,
  isRunActive,
  pendingFillPairs,
  resolveRunScope,
} from "../runner";
import type {
  RunDetailRequestOutput,
  RunDetailResponseOutput,
} from "./[id]/definition";
import type { RunsGetRequestOutput, RunsGetResponseOutput } from "./definition";
import type {
  StartRunRequestOutput,
  StartRunResponseOutput,
} from "./start/definition";

function splitList(value: string | undefined): string[] {
  if (value === undefined) {
    return [];
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "");
}

function toRunSummary(
  run: typeof refusalIndexRuns.$inferSelect,
  resultCount: number,
): RunsGetResponseOutput["runs"][number] {
  return {
    id: run.id,
    status: run.status,
    startedAt: run.startedAt.toISOString(),
    finishedAt: run.finishedAt?.toISOString() ?? null,
    modelCount: run.modelCount,
    questionCount: run.questionCount,
    pairCount: run.pairCount,
    questionsRequested: run.questionsRequested,
    questionsGenerated: run.questionsGenerated,
    resultCount,
    totalCost: Math.round(run.totalCost * 100) / 100,
    budgetCredits: run.budgetCredits,
    judgeModelId: run.judgeModelId,
    judgePromptVersion: run.judgePromptVersion,
    cancelReason: run.cancelReason,
    notes: run.notes,
  };
}

async function resultCounts(runIds: string[]): Promise<Map<string, number>> {
  if (runIds.length === 0) {
    return new Map();
  }
  const rows = await db
    .select({ runId: refusalIndexResults.runId, value: count() })
    .from(refusalIndexResults)
    .where(inArray(refusalIndexResults.runId, runIds))
    .groupBy(refusalIndexResults.runId);
  return new Map(rows.map((row) => [row.runId, row.value]));
}

/**
 * Estimated credits of one answer. Token-priced models are scaled by the
 * observed real-spend factor (reasoning tokens, long answers); fixed-price
 * models (one price per message) are exact.
 */
function answerCredits(modelId: string): number {
  const option = chatModelOptionsIndex[modelId];
  if (!option) {
    return 0;
  }
  const credits = calculateCreditCost(
    option,
    ESTIMATED_PAIR_TOKENS.answerInput,
    ESTIMATED_PAIR_TOKENS.answerOutput,
  );
  return typeof option.creditCost === "number"
    ? credits
    : credits * ESTIMATE_SPEND_FACTOR;
}

function judgeCredits(): number {
  const option = chatModelOptionsIndex[JUDGE_MODEL_ID];
  return option
    ? calculateCreditCost(
        option,
        ESTIMATED_PAIR_TOKENS.judgeInput,
        ESTIMATED_PAIR_TOKENS.judgeOutput,
      ) * ESTIMATE_SPEND_FACTOR
    : 0;
}

/**
 * Estimated credits (answer + judge, 2 decimals) for the pending pairs plus
 * `newQuestions` generated questions asked to every model in scope.
 */
function estimateCredits(
  pairs: readonly Pair[],
  newQuestions: number,
  modelIds: readonly string[],
): number {
  const judgePerPair = judgeCredits();
  let total = 0;
  for (const pair of pairs) {
    total += answerCredits(pair.modelId) + judgePerPair;
  }
  if (newQuestions > 0) {
    let perQuestion = 0;
    for (const modelId of modelIds) {
      perQuestion += answerCredits(modelId) + judgePerPair;
    }
    total +=
      perQuestion * newQuestions +
      estimateGenerationCredits(newQuestions) * ESTIMATE_SPEND_FACTOR;
  }
  return Math.round(total * 100) / 100;
}

export class RefusalRunsRepository {
  static async list(
    data: RunsGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RunsGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const runs = await db
        .select()
        .from(refusalIndexRuns)
        .orderBy(desc(refusalIndexRuns.startedAt))
        .limit(data.limit)
        .offset(data.offset);
      const [totalRow] = await db
        .select({ value: count() })
        .from(refusalIndexRuns);
      const [activeQuestions] = await db
        .select({ value: count() })
        .from(refusalIndexQuestions)
        .where(eq(refusalIndexQuestions.active, true));
      const counts = await resultCounts(runs.map((run) => run.id));
      return success({
        runs: runs.map((run) => toRunSummary(run, counts.get(run.id) ?? 0)),
        total: totalRow?.value ?? 0,
        activeQuestionCount: activeQuestions?.value ?? 0,
        benchmarkModelCount: listBenchmarkModels().length,
      });
    } catch (error) {
      logger.error("RefusalRunsRepository.list failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async detail(
    data: RunDetailRequestOutput,
    urlPathParams: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RunDetailResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [run] = await db
        .select()
        .from(refusalIndexRuns)
        .where(eq(refusalIndexRuns.id, urlPathParams.id))
        .limit(1);
      if (!run) {
        return fail({
          message: t("messages.runNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const verdictRows = await db
        .select({ verdict: refusalIndexResults.verdict, value: count() })
        .from(refusalIndexResults)
        .where(eq(refusalIndexResults.runId, run.id))
        .groupBy(refusalIndexResults.verdict);
      const countOf = (verdict: string): number =>
        verdictRows.find((row) => row.verdict === verdict)?.value ?? 0;

      const conditions = [eq(refusalIndexResults.runId, run.id)];
      if (data.model && data.model.trim() !== "") {
        conditions.push(
          ilike(refusalIndexResults.modelId, `%${data.model.trim()}%`),
        );
      }
      if (data.category && data.category.trim() !== "") {
        conditions.push(
          eq(
            refusalIndexQuestions.category,
            data.category.trim().toLowerCase(),
          ),
        );
      }
      if (data.verdict !== "all") {
        conditions.push(eq(refusalIndexResults.verdict, data.verdict));
      }
      const where = and(...conditions);

      const rows = await db
        .select({
          id: refusalIndexResults.id,
          modelId: refusalIndexResults.modelId,
          questionSlug: refusalIndexQuestions.slug,
          category: refusalIndexQuestions.category,
          questionText: refusalIndexQuestions.textEn,
          verdict: refusalIndexResults.verdict,
          judgeReason: refusalIndexResults.judgeReason,
          answerExcerpt: refusalIndexResults.answerExcerpt,
          latencyMs: refusalIndexResults.latencyMs,
          cost: refusalIndexResults.cost,
          sampleVisible: refusalIndexSamples.visible,
        })
        .from(refusalIndexResults)
        .innerJoin(
          refusalIndexQuestions,
          eq(refusalIndexResults.questionId, refusalIndexQuestions.id),
        )
        .leftJoin(
          refusalIndexSamples,
          eq(refusalIndexSamples.resultId, refusalIndexResults.id),
        )
        .where(where)
        .orderBy(refusalIndexResults.modelId, refusalIndexQuestions.slug)
        .limit(data.limit)
        .offset(data.offset);
      const [filteredTotal] = await db
        .select({ value: count() })
        .from(refusalIndexResults)
        .innerJoin(
          refusalIndexQuestions,
          eq(refusalIndexResults.questionId, refusalIndexQuestions.id),
        )
        .where(where);
      const total = verdictRows.reduce((sum, row) => sum + row.value, 0);

      return success({
        run: toRunSummary(run, total),
        answered: countOf(RefusalVerdict.ANSWERED),
        hedged: countOf(RefusalVerdict.HEDGED),
        refused: countOf(RefusalVerdict.REFUSED),
        errors: countOf(RefusalVerdict.ERROR),
        results: rows.map((row) => {
          const model = describeModel(row.modelId);
          return {
            ...row,
            cost: Math.round(row.cost * 1000) / 1000,
            modelName: model.name,
            tier: model.tier,
            sampleVisible: row.sampleVisible ?? null,
          };
        }),
        total: filteredTotal?.value ?? 0,
      });
    } catch (error) {
      logger.error("RefusalRunsRepository.detail failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Start (or resume) a run: generate `newQuestions`, then answer every pair
   * still missing. Dry run: plan + estimate only, nothing written. Otherwise
   * the run executes in the background (fire-and-forget) unless `wait` is
   * set; a crashed run is continued with `resumeRunId` (or automatically when
   * a stale running run exists and no scope is given).
   */
  static async start(
    data: StartRunRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<StartRunResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const requestedModels = splitList(data.models);
      const requestedSlugs = splitList(data.questions);

      // ── Resume target ────────────────────────────────────────────────
      let resumeId: string | undefined =
        data.resumeRunId && data.resumeRunId !== ""
          ? data.resumeRunId
          : undefined;
      const now = Date.now();
      const running = await db
        .select()
        .from(refusalIndexRuns)
        .where(eq(refusalIndexRuns.status, RefusalRunStatus.RUNNING));
      const live = running.find(
        (run) =>
          isRunActive(run.id) || now - run.heartbeatAt.getTime() < STALE_RUN_MS,
      );
      if (live && live.id !== resumeId && !data.dryRun) {
        return fail({
          message: t("messages.runAlreadyActive", { id: live.id }),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      if (
        resumeId === undefined &&
        !data.dryRun &&
        requestedModels.length === 0 &&
        requestedSlugs.length === 0
      ) {
        resumeId = running.find((run) => !isRunActive(run.id))?.id;
      }

      if (resumeId !== undefined) {
        const [run] = await db
          .select()
          .from(refusalIndexRuns)
          .where(eq(refusalIndexRuns.id, resumeId))
          .limit(1);
        if (!run) {
          return fail({
            message: t("messages.runNotFound"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        if (isRunActive(run.id)) {
          return fail({
            message: t("messages.runAlreadyActive", { id: run.id }),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const scope = await resolveRunScope({
          modelIds: run.modelFilter,
          questionIds: run.questionFilter,
        });
        const pending = await pendingFillPairs(scope);
        const toGenerate = Math.max(
          0,
          run.questionsRequested - run.questionsGenerated,
        );
        const estimate = estimateCredits(pending, toGenerate, scope.modelIds);
        if (data.dryRun) {
          return success({
            runId: run.id,
            status: t("messages.dryRunStatus"),
            isDryRun: true,
            modelCount: scope.modelIds.length,
            questionCount: scope.questionIds.length,
            newQuestionCount: toGenerate,
            pendingPairs: pending.length,
            estimatedCredits: estimate,
            note: t("messages.dryRunResume"),
          });
        }
        await db
          .update(refusalIndexRuns)
          .set({
            // Keep the run's cap unless the caller sets a new one: a resume
            // without a budget must never turn a capped run into an uncapped one.
            budgetCredits: data.budgetCredits ?? run.budgetCredits,
            updatedAt: new Date(),
          })
          .where(eq(refusalIndexRuns.id, run.id));
        return RefusalRunsRepository.launch({
          runId: run.id,
          user,
          locale,
          logger,
          data,
          toolExecutionContext,
          modelCount: scope.modelIds.length,
          questionCount: scope.questionIds.length,
          newQuestions: toGenerate,
          pendingPairs: pending.length,
          estimatedCredits: estimate,
          note: t("messages.resumed"),
        });
      }

      // ── New run: resolve scope ───────────────────────────────────────
      let questionIdFilter: string[] | undefined;
      if (requestedSlugs.length > 0) {
        const rows = await db
          .select({
            id: refusalIndexQuestions.id,
            slug: refusalIndexQuestions.slug,
          })
          .from(refusalIndexQuestions)
          .where(inArray(refusalIndexQuestions.slug, requestedSlugs));
        const unknown = requestedSlugs.filter(
          (slug) => !rows.some((row) => row.slug === slug),
        );
        if (unknown.length > 0) {
          return fail({
            message: t("messages.unknownQuestions", {
              slugs: unknown.join(", "),
            }),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        questionIdFilter = rows.map((row) => row.id);
      }
      if (requestedModels.length > 0) {
        const known = new Set<string>(
          listBenchmarkModels().map((model) => model.id),
        );
        const unknown = requestedModels.filter((id) => !known.has(id));
        if (unknown.length > 0) {
          return fail({
            message: t("messages.unknownModels", { ids: unknown.join(", ") }),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }
      const scope = await resolveRunScope({
        modelIds: requestedModels.length > 0 ? requestedModels : undefined,
        questionIds: questionIdFilter,
      });
      // An explicit question list means "only these": nothing is generated.
      const newQuestions = questionIdFilter ? 0 : (data.newQuestions ?? 0);
      if (scope.questionIds.length === 0 && newQuestions === 0) {
        return fail({
          message: t("messages.noQuestions"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (scope.modelIds.length === 0) {
        return fail({
          message: t("messages.noModels"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const pending = await pendingFillPairs(scope);
      const estimate = estimateCredits(pending, newQuestions, scope.modelIds);
      if (data.dryRun || (pending.length === 0 && newQuestions === 0)) {
        return success({
          runId: null,
          status: t("messages.dryRunStatus"),
          isDryRun: true,
          modelCount: scope.modelIds.length,
          questionCount: scope.questionIds.length,
          newQuestionCount: newQuestions,
          pendingPairs: pending.length,
          estimatedCredits: estimate,
          note: data.dryRun
            ? t("messages.dryRun", {
                budget: data.budgetCredits ?? DEFAULT_BUDGET_CREDITS,
              })
            : t("messages.nothingPending"),
        });
      }

      const [created] = await db
        .insert(refusalIndexRuns)
        .values({
          status: RefusalRunStatus.RUNNING,
          modelCount: scope.modelIds.length,
          questionCount: scope.questionIds.length,
          pairCount: pending.length,
          questionsRequested: newQuestions,
          budgetCredits: data.budgetCredits ?? DEFAULT_BUDGET_CREDITS,
          judgeModelId: JUDGE_MODEL_ID,
          judgePromptVersion: JUDGE_PROMPT_VERSION,
          runnerPromptVersion: RUNNER_PROMPT_VERSION,
          // Null = all current models / active questions, re-read on resume.
          modelFilter: requestedModels.length > 0 ? scope.modelIds : null,
          questionFilter: questionIdFilter ? scope.questionIds : null,
          startedByUserId: user.isPublic ? null : user.id,
          notes: data.notes ?? null,
        })
        .returning({ id: refusalIndexRuns.id });
      if (!created) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      return RefusalRunsRepository.launch({
        runId: created.id,
        user,
        locale,
        logger,
        data,
        toolExecutionContext,
        modelCount: scope.modelIds.length,
        questionCount: scope.questionIds.length,
        newQuestions,
        pendingPairs: pending.length,
        estimatedCredits: estimate,
        note: t("messages.started"),
      });
    } catch (error) {
      logger.error("RefusalRunsRepository.start failed", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async launch(params: {
    runId: string;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    data: StartRunRequestOutput;
    toolExecutionContext: ToolExecutionContext;
    modelCount: number;
    questionCount: number;
    newQuestions: number;
    pendingPairs: number;
    estimatedCredits: number;
    note: string;
  }): Promise<ResponseType<StartRunResponseOutput>> {
    const execution = executeRun({
      runId: params.runId,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      concurrency: params.data.concurrency,
      // Own signal: the request's signal dies when the HTTP call returns.
      abortSignal: new AbortController().signal,
      fixtureScopeId: params.toolExecutionContext.fixtureScopeId,
    });
    const { t } = scopedTranslation.scopedT(params.locale);
    let status: string = t(RefusalRunStatus.RUNNING);
    let note = params.note;
    if (params.data.wait) {
      const finished = await execution;
      if (!finished.success) {
        return fail({
          message: finished.message,
          errorType: finished.errorType,
        });
      }
      status = t(finished.data.status);
      note = t("messages.finishedWaiting");
    } else {
      void execution;
    }
    return success({
      runId: params.runId,
      status,
      isDryRun: false,
      modelCount: params.modelCount,
      questionCount: params.questionCount,
      newQuestionCount: params.newQuestions,
      pendingPairs: params.pendingPairs,
      estimatedCredits: params.estimatedCredits,
      note,
    });
  }
}
