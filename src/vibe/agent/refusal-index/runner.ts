/**
 * Refusal Index runner.
 *
 * A run (1) optionally asks the generator for new questions, then (2) fills
 * every (question, model) pair that has no answer yet: a sub-agent asks the
 * target model through the same headless stream ai-run uses (single turn,
 * incognito, no memories, no tools, neutral instruction) and the fixed judge
 * classifies the answer. Answers are permanent: a pair answered by the same
 * model version is never asked again. Budget-capped (generation included),
 * bounded concurrency, resumable: a stopped run just leaves pairs pending for
 * the next one.
 */

import "server-only";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
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

import type { ChatModelId } from "../ai-stream/models";
import {
  computeFillPairs,
  createBudgetTracker,
  executePairs,
  type FillPair,
  parseJudgeReply,
  planPairs,
} from "./aggregate";
import { askModel } from "./ask";
import { invalidateRefusalIndexCaches } from "./cache";
import {
  ANSWER_EXCERPT_CHARS,
  DEFAULT_CONCURRENCY,
  JUDGE_INPUT_CHARS,
  JUDGE_INSTRUCTION,
  JUDGE_MODEL_ID,
  MAX_CONCURRENCY,
  RUNNER_INSTRUCTION,
} from "./constants";
import {
  refusalIndexQuestions,
  refusalIndexResults,
  refusalIndexRuns,
} from "./db";
import {
  RefusalRunStatus,
  RefusalVerdict,
  type RefusalVerdictValue,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { describeModel, listBenchmarkModels, modelVersionOf } from "./models";
import { activeQuestionIds, generateQuestions } from "./question-gen";

/** In-process guard: one executor per run id. */
const activeRuns = new Set<string>();

export function isRunActive(runId: string): boolean {
  return activeRuns.has(runId);
}

interface Judgement {
  verdict: typeof RefusalVerdictValue;
  reason: string;
  cost: number;
}

async function judge(params: {
  question: string;
  answer: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  abortSignal: AbortSignal;
  fixtureScopeId: string | undefined;
}): Promise<ResponseType<Judgement>> {
  const content = [
    "Question:",
    params.question,
    "",
    "Assistant answer:",
    params.answer.slice(0, JUDGE_INPUT_CHARS),
  ].join("\n");
  const { t } = scopedTranslation.scopedT(params.locale);
  let cost = 0;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const reply = await askModel({
      modelId: JUDGE_MODEL_ID,
      content,
      instruction: JUDGE_INSTRUCTION,
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      abortSignal: params.abortSignal,
      fixtureScopeId: params.fixtureScopeId,
    });
    if (!reply.success) {
      return fail({ message: reply.message, errorType: reply.errorType });
    }
    cost += reply.data.cost;
    const parsed = reply.data.text ? parseJudgeReply(reply.data.text) : null;
    if (parsed) {
      return success({ ...parsed, cost });
    }
  }
  return fail({
    message: t("messages.judgeUnparseable"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export interface RunScope {
  modelIds: string[];
  questionIds: string[];
}

/**
 * Resolve the (model, question) scope from optional filters. No filter =
 * every current benchmark model / every active question, read fresh, so a
 * resumed run also covers models and questions added since it started.
 */
export async function resolveRunScope(filters: {
  modelIds: string[] | null | undefined;
  questionIds: string[] | null | undefined;
}): Promise<RunScope> {
  const benchmarkModels = listBenchmarkModels().map((model) => model.id);
  const modelIds =
    filters.modelIds && filters.modelIds.length > 0
      ? benchmarkModels.filter((id) => filters.modelIds?.includes(id))
      : benchmarkModels;
  if (filters.questionIds && filters.questionIds.length > 0) {
    const rows = await db
      .select({ id: refusalIndexQuestions.id })
      .from(refusalIndexQuestions)
      .where(
        and(
          eq(refusalIndexQuestions.active, true),
          inArray(refusalIndexQuestions.id, filters.questionIds),
        ),
      );
    return { modelIds, questionIds: rows.map((row) => row.id) };
  }
  return { modelIds, questionIds: await activeQuestionIds() };
}

/** Pairs of the scope that still need an answer (see computeFillPairs). */
export async function pendingFillPairs(scope: RunScope): Promise<FillPair[]> {
  if (scope.modelIds.length === 0 || scope.questionIds.length === 0) {
    return [];
  }
  const existing = await db
    .select({
      modelId: refusalIndexResults.modelId,
      questionId: refusalIndexResults.questionId,
      verdict: refusalIndexResults.verdict,
      modelVersion: refusalIndexResults.modelVersion,
    })
    .from(refusalIndexResults)
    .where(
      and(
        isNull(refusalIndexResults.staleAt),
        inArray(refusalIndexResults.questionId, scope.questionIds),
        inArray(refusalIndexResults.modelId, scope.modelIds),
      ),
    );
  return computeFillPairs(
    planPairs(scope.modelIds, scope.questionIds),
    existing,
    modelVersionOf,
  );
}

/** Estimated credits for one pair (answer + judge) used by dry runs. */
export const ESTIMATED_PAIR_TOKENS = {
  answerInput: 400,
  answerOutput: 350,
  judgeInput: 700,
  judgeOutput: 60,
} as const;

export interface RunExecutionParams {
  runId: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  concurrency: number | undefined;
  abortSignal: AbortSignal;
  fixtureScopeId: string | undefined;
}

/**
 * Execute (or resume) a run to completion. Safe to call twice: the second
 * call sees the run is active in this process and returns immediately.
 */
export async function executeRun(params: RunExecutionParams): Promise<
  ResponseType<{
    status: (typeof RefusalRunStatus)[keyof typeof RefusalRunStatus];
  }>
> {
  const { runId, user, locale, logger } = params;
  const { t } = scopedTranslation.scopedT(locale);
  if (activeRuns.has(runId)) {
    return success({ status: RefusalRunStatus.RUNNING });
  }
  activeRuns.add(runId);
  try {
    const [run] = await db
      .select()
      .from(refusalIndexRuns)
      .where(eq(refusalIndexRuns.id, runId))
      .limit(1);
    if (!run) {
      return fail({
        message: t("messages.runNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    await db
      .update(refusalIndexRuns)
      .set({
        status: RefusalRunStatus.RUNNING,
        finishedAt: null,
        cancelReason: null,
        heartbeatAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(refusalIndexRuns.id, runId));

    const budget = createBudgetTracker(run.budgetCredits, run.totalCost);
    let stopReason: string | null = null;
    const shouldStop = (): boolean => {
      if (stopReason !== null) {
        return true;
      }
      if (params.abortSignal.aborted) {
        stopReason = "aborted";
        return true;
      }
      if (budget.exceeded()) {
        stopReason = `budget cap of ${String(budget.cap)} credits reached`;
        return true;
      }
      return false;
    };

    // ── 1. New questions ───────────────────────────────────────────────
    const toGenerate = run.questionsRequested - run.questionsGenerated;
    // Explicit question filters mean "only these": nothing new is added.
    if (toGenerate > 0 && !run.questionFilter?.length && !shouldStop()) {
      const generated = await generateQuestions({
        count: toGenerate,
        user,
        locale,
        logger,
        abortSignal: params.abortSignal,
        fixtureScopeId: params.fixtureScopeId,
        canSpend: () => !shouldStop(),
      });
      if (generated.success) {
        budget.add(generated.data.cost);
        await db
          .update(refusalIndexRuns)
          .set({
            questionsGenerated: sql`${refusalIndexRuns.questionsGenerated} + ${generated.data.insertedIds.length}`,
            totalCost: sql`${refusalIndexRuns.totalCost} + ${generated.data.cost}`,
            heartbeatAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(refusalIndexRuns.id, runId));
        invalidateRefusalIndexCaches();
      } else {
        // The fill still runs: missing pairs of existing questions are worth it.
        logger.warn("[RefusalIndex] question generation failed", {
          runId,
          error: generated.message,
        });
        if (generated.errorType === ErrorResponseTypes.PAYMENT_REQUIRED) {
          stopReason = "insufficient credits";
        }
      }
    }

    // ── 2. Fill missing pairs ──────────────────────────────────────────
    const scope = await resolveRunScope({
      modelIds: run.modelFilter,
      questionIds: run.questionFilter,
    });
    const pending = await pendingFillPairs(scope);
    await db
      .update(refusalIndexRuns)
      .set({
        modelCount: scope.modelIds.length,
        questionCount: scope.questionIds.length,
        pairCount: pending.length,
        updatedAt: new Date(),
      })
      .where(eq(refusalIndexRuns.id, runId));

    const pendingQuestionIds = [...new Set(pending.map((p) => p.questionId))];
    const questionRows =
      pendingQuestionIds.length > 0
        ? await db
            .select({
              id: refusalIndexQuestions.id,
              textEn: refusalIndexQuestions.textEn,
            })
            .from(refusalIndexQuestions)
            .where(inArray(refusalIndexQuestions.id, pendingQuestionIds))
        : [];
    const questionText = new Map(questionRows.map((q) => [q.id, q.textEn]));

    const modelById = new Map<string, ChatModelId>(
      listBenchmarkModels().map((model) => [model.id, model.id]),
    );
    const concurrency = Math.min(
      params.concurrency ?? DEFAULT_CONCURRENCY,
      MAX_CONCURRENCY,
    );

    const worker = async (pair: FillPair): Promise<void> => {
      const question = questionText.get(pair.questionId);
      const modelId = modelById.get(pair.modelId);
      const tier = describeModel(pair.modelId).tier;
      if (question === undefined || modelId === undefined || tier === null) {
        return;
      }
      const modelVersion = modelVersionOf(pair.modelId);
      const started = Date.now();
      let verdict: typeof RefusalVerdictValue = RefusalVerdict.ERROR;
      let reason = "";
      let excerpt = "";
      let cost = 0;

      const answer = await askModel({
        modelId,
        content: question,
        instruction: RUNNER_INSTRUCTION,
        user,
        locale,
        logger,
        abortSignal: params.abortSignal,
        fixtureScopeId: params.fixtureScopeId,
      });
      const latencyMs = Date.now() - started;

      if (!answer.success) {
        reason = answer.message.slice(0, 300);
        if (answer.errorType === ErrorResponseTypes.PAYMENT_REQUIRED) {
          stopReason = "insufficient credits";
        }
        // Not stored: a fatal stop leaves the pair pending for the next run.
        if (stopReason !== null) {
          return;
        }
      } else {
        cost += answer.data.cost;
        if (answer.data.text === null) {
          // Provider content-filter finish (or an empty stream): refused, no judge call.
          verdict = RefusalVerdict.REFUSED;
          reason = "Provider returned no content (content filter)";
        } else {
          excerpt = answer.data.text.slice(0, ANSWER_EXCERPT_CHARS);
          const judged = await judge({
            question,
            answer: answer.data.text,
            user,
            locale,
            logger,
            abortSignal: params.abortSignal,
            fixtureScopeId: params.fixtureScopeId,
          });
          if (judged.success) {
            verdict = judged.data.verdict;
            reason = judged.data.reason;
            cost += judged.data.cost;
          } else {
            reason = `judge failed: ${judged.message}`.slice(0, 300);
            if (judged.errorType === ErrorResponseTypes.PAYMENT_REQUIRED) {
              stopReason = "insufficient credits";
              return;
            }
          }
        }
      }

      budget.add(cost);
      // An error never replaces a real answer from an older model version:
      // the old one stays current until the new version answers.
      if (!(pair.supersede && verdict === RefusalVerdict.ERROR)) {
        await db.transaction(async (tx) => {
          if (pair.supersede) {
            await tx
              .update(refusalIndexResults)
              .set({ staleAt: new Date() })
              .where(
                and(
                  eq(refusalIndexResults.questionId, pair.questionId),
                  eq(refusalIndexResults.modelId, pair.modelId),
                  isNull(refusalIndexResults.staleAt),
                ),
              );
          }
          await tx
            .insert(refusalIndexResults)
            .values({
              runId,
              questionId: pair.questionId,
              modelId: pair.modelId,
              modelVersion,
              verdict,
              judgeReason: reason,
              answerExcerpt: excerpt,
              latencyMs,
              cost,
            })
            .onConflictDoUpdate({
              // Only an errored current row can conflict: retried in place.
              target: [
                refusalIndexResults.questionId,
                refusalIndexResults.modelId,
              ],
              targetWhere: isNull(refusalIndexResults.staleAt),
              set: {
                runId,
                modelVersion,
                verdict,
                judgeReason: reason,
                answerExcerpt: excerpt,
                latencyMs,
                cost: sql`${refusalIndexResults.cost} + ${cost}`,
                createdAt: new Date(),
              },
            });
        });
      }
      await db
        .update(refusalIndexRuns)
        .set({
          totalCost: sql`${refusalIndexRuns.totalCost} + ${cost}`,
          heartbeatAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(refusalIndexRuns.id, runId));
    };

    await executePairs({ pairs: pending, concurrency, shouldStop, worker });

    const cancelled = stopReason !== null;
    const status = cancelled
      ? RefusalRunStatus.CANCELLED
      : RefusalRunStatus.COMPLETED;
    await db
      .update(refusalIndexRuns)
      .set({
        status,
        finishedAt: new Date(),
        cancelReason: stopReason,
        updatedAt: new Date(),
      })
      .where(eq(refusalIndexRuns.id, runId));
    invalidateRefusalIndexCaches();
    logger.info("[RefusalIndex] run finished", {
      runId,
      status,
      stopReason,
      spent: budget.spent(),
    });
    return success({ status });
  } catch (error) {
    const message = parseError(error).message;
    logger.error("[RefusalIndex] run crashed", { runId, error: message });
    await db
      .update(refusalIndexRuns)
      .set({
        status: RefusalRunStatus.FAILED,
        finishedAt: new Date(),
        cancelReason: message.slice(0, 500),
        updatedAt: new Date(),
      })
      .where(eq(refusalIndexRuns.id, runId))
      .catch(() => undefined);
    return fail({
      message: t("errors.server.description"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  } finally {
    activeRuns.delete(runId);
  }
}
