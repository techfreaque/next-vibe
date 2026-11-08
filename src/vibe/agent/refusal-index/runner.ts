/**
 * Refusal Index runner.
 *
 * For every pending (question, model) pair: ask the model through the same
 * headless stream ai-run uses (maxTurns 1, incognito, no memories, no tools,
 * neutral instruction), classify the answer with the fixed judge model, store
 * the verdict. Budget-capped, bounded concurrency, resumable.
 */

import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
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
import { AiStreamRepository } from "../ai-stream/repository";
import type { AiStreamPostRequestOutput } from "../ai-stream/stream/definition";
import { scopedTranslation as aiStreamScopedTranslation } from "../ai-stream/stream/i18n";
import { ChatMessageRole } from "../chat/enum";
import { NO_SKILL_ID } from "../skills/constants";
import { buildFavoriteConfig } from "../skills/favorites/repository";
import { stripThinkTags } from "../text-to-speech/content-processing";
import {
  computePendingPairs,
  createBudgetTracker,
  executePairs,
  type Pair,
  parseJudgeReply,
  planPairs,
} from "./aggregate";
import { invalidateRefusalIndexCaches } from "./cache";
import {
  ANSWER_EXCERPT_CHARS,
  DEFAULT_BUDGET_CREDITS,
  DEFAULT_CONCURRENCY,
  JUDGE_INPUT_CHARS,
  JUDGE_INSTRUCTION,
  JUDGE_MODEL_ID,
  JUDGE_PROMPT_VERSION,
  MAX_CONCURRENCY,
  RUNNER_INSTRUCTION,
  RUNNER_PROMPT_VERSION,
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
import { describeModel, listBenchmarkModels } from "./models";

/** In-process guard: one executor per run id. */
const activeRuns = new Set<string>();

export function isRunActive(runId: string): boolean {
  return activeRuns.has(runId);
}

interface AskOk {
  /** Null when the provider returned no content (content-filter / empty stream). */
  text: string | null;
  cost: number;
}

/** One headless single-turn call (shared by the answer step and the judge). */
async function ask(params: {
  modelId: ChatModelId;
  content: string;
  instruction: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  abortSignal: AbortSignal;
  fixtureScopeId: string | undefined;
}): Promise<ResponseType<AskOk>> {
  const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(params.locale);
  const syntheticData: AiStreamPostRequestOutput = {
    operation: "send",
    rootFolderId: DefaultFolderId.INCOGNITO,
    subFolderId: null,
    threadId: crypto.randomUUID(),
    userMessageId: null,
    parentMessageId: null,
    content: params.content,
    role: ChatMessageRole.USER,
    model: params.modelId,
    skill: NO_SKILL_ID,
    favoriteConfig: buildFavoriteConfig({
      id: "refusal-index-headless",
      skillId: NO_SKILL_ID,
      availableTools: [],
      pinnedTools: [],
    }),
    toolConfirmations: null,
    messageHistory: [],
    voiceMode: { enabled: false },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
    executionContext: { mode: "local" as const },
  };
  const result = await AiStreamRepository.createAiStream({
    data: syntheticData,
    locale: params.locale,
    logger: params.logger,
    user: params.user,
    request: undefined,
    t: aiStreamT,
    awaitResult: true,
    subAgentDepth: 1,
    extraInstructions: params.instruction,
    excludeMemories: true,
    maxToolCalls: 1,
    parentAbortSignal: params.abortSignal,
    fixtureScopeId: params.fixtureScopeId,
  });
  if (!result.success) {
    return fail({
      message: result.message,
      errorType: result.errorType,
    });
  }
  const raw = result.data.lastAiMessageContent;
  const text = raw ? stripThinkTags(raw).trim() : "";
  return success({
    text: text.length > 0 ? text : null,
    cost: result.data.totalCreditsDeducted ?? 0,
  });
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
    const reply = await ask({
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

/** Resolve the (model, question) scope for a new run from optional filters. */
export async function resolveRunScope(filters: {
  modelIds: string[] | undefined;
  questionIds: string[] | undefined;
}): Promise<RunScope> {
  const benchmarkModels = listBenchmarkModels().map((model) => model.id);
  const modelIds =
    filters.modelIds && filters.modelIds.length > 0
      ? benchmarkModels.filter((id) => filters.modelIds?.includes(id))
      : benchmarkModels;
  const questionRows = await db
    .select({ id: refusalIndexQuestions.id })
    .from(refusalIndexQuestions)
    .where(
      filters.questionIds && filters.questionIds.length > 0
        ? and(
            eq(refusalIndexQuestions.active, true),
            inArray(refusalIndexQuestions.id, filters.questionIds),
          )
        : eq(refusalIndexQuestions.active, true),
    );
  return { modelIds, questionIds: questionRows.map((row) => row.id) };
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

    const modelIds = run.modelFilter ?? [];
    const questionIds = run.questionFilter ?? [];
    const questionRows =
      questionIds.length > 0
        ? await db
            .select({
              id: refusalIndexQuestions.id,
              textEn: refusalIndexQuestions.textEn,
            })
            .from(refusalIndexQuestions)
            .where(inArray(refusalIndexQuestions.id, questionIds))
        : [];
    const questionText = new Map(questionRows.map((q) => [q.id, q.textEn]));

    const existing = await db
      .select({
        modelId: refusalIndexResults.modelId,
        questionId: refusalIndexResults.questionId,
        verdict: refusalIndexResults.verdict,
      })
      .from(refusalIndexResults)
      .where(eq(refusalIndexResults.runId, runId));
    const pending = computePendingPairs(
      planPairs(modelIds, questionIds),
      existing,
    );

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

    const modelById = new Map<string, ChatModelId>(
      listBenchmarkModels().map((model) => [model.id, model.id]),
    );
    const concurrency = Math.min(
      params.concurrency ?? DEFAULT_CONCURRENCY,
      MAX_CONCURRENCY,
    );

    const worker = async (pair: Pair): Promise<void> => {
      const question = questionText.get(pair.questionId);
      const modelId = modelById.get(pair.modelId);
      const tier = describeModel(pair.modelId).tier;
      if (question === undefined || modelId === undefined || tier === null) {
        return;
      }
      const started = Date.now();
      let verdict: typeof RefusalVerdictValue = RefusalVerdict.ERROR;
      let reason = "";
      let excerpt = "";
      let cost = 0;

      const answer = await ask({
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
        // Not stored: a fatal stop leaves the pair pending for the resume.
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
      await db
        .insert(refusalIndexResults)
        .values({
          runId,
          questionId: pair.questionId,
          modelId: pair.modelId,
          verdict,
          judgeReason: reason,
          answerExcerpt: excerpt,
          latencyMs,
          cost,
        })
        .onConflictDoUpdate({
          target: [
            refusalIndexResults.runId,
            refusalIndexResults.questionId,
            refusalIndexResults.modelId,
          ],
          set: {
            verdict,
            judgeReason: reason,
            answerExcerpt: excerpt,
            latencyMs,
            cost,
            createdAt: new Date(),
          },
        });
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

export const RUN_FREEZE = {
  judgeModelId: JUDGE_MODEL_ID,
  judgePromptVersion: JUDGE_PROMPT_VERSION,
  runnerPromptVersion: RUNNER_PROMPT_VERSION,
  defaultBudget: DEFAULT_BUDGET_CREDITS,
} as const;
