/**
 * Model + credit phase — resolves the active model and validates credit
 * balance. Extracted verbatim from setup.ts (behavior-preserving).
 */
import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { buildMissingKeyMessage } from "@/app/api/[locale]/agent/env-availability";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";

import { type ChatModelOption, getChatModelById } from "../../models";
import { type AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import { CreditValidatorHandler } from "../core/credit-validator-handler";

/** Normalize DB tool config items - ensures requiresConfirmation is always boolean */
interface ModelCreditPhaseResult {
  modelConfig: ChatModelOption;
  effectiveLeadId: string;
  modelCost: number;
}

/**
 * Run the model + credit validation guards. Resolves to the validated outputs,
 * or a fail() response (auth / bad-request / forbidden / credits) the caller
 * must return directly.
 */
export async function runModelCreditPhase(params: {
  data: AiStreamPostRequestOutput;
  user: JwtPayloadType;
  userId: string | undefined;
  leadId: string;
  ipAddress: string | undefined;
  isIncognito: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  aiStreamT: AiStreamT;
}): Promise<ResponseType<ModelCreditPhaseResult>> {
  const {
    data,
    user,
    userId,
    leadId,
    ipAddress,
    isIncognito,
    locale,
    logger,
    aiStreamT,
  } = params;

  if (!userId && !leadId && !isIncognito) {
    logger.error("User has neither userId nor leadId", {
      rootFolderId: data.rootFolderId,
    });
    return fail({
      message: aiStreamT("route.errors.authenticationRequired"),
      errorType: ErrorResponseTypes.AUTH_ERROR,
    });
  }
  const modelConfig = getChatModelById(data.model);

  // Guard: TTS/STT models are dispatched via their own handlers, not the LLM stream pipeline.
  if (
    modelConfig.apiProvider === ApiProvider.OPENAI_TTS ||
    modelConfig.apiProvider === ApiProvider.OPENAI_STT ||
    modelConfig.apiProvider === ApiProvider.ELEVENLABS ||
    modelConfig.apiProvider === ApiProvider.DEEPGRAM ||
    modelConfig.apiProvider === ApiProvider.EDEN_AI_TTS ||
    modelConfig.apiProvider === ApiProvider.EDEN_AI_STT
  ) {
    logger.warn("[Setup] TTS/STT model routed to LLM stream - invalid", {
      model: data.model,
      provider: modelConfig.apiProvider,
    });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData"),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Guard: check that the required API key for this model's provider is configured.
  const providerKeyMissing = ((): string | null => {
    switch (modelConfig.apiProvider) {
      case ApiProvider.OPENROUTER:
        return agentEnv.OPENROUTER_API_KEY
          ? null
          : buildMissingKeyMessage("openRouter");
      case ApiProvider.UNCENSORED_AI:
        return agentEnv.UNCENSORED_AI_API_KEY
          ? null
          : buildMissingKeyMessage("uncensoredAI");
      case ApiProvider.FREEDOMGPT:
        return agentEnv.FREEDOMGPT_API_KEY
          ? null
          : buildMissingKeyMessage("freedomGPT");
      case ApiProvider.GAB_AI:
        return agentEnv.GAB_AI_API_KEY ? null : buildMissingKeyMessage("gabAI");
      case ApiProvider.VENICE_AI:
        return agentEnv.VENICE_AI_API_KEY
          ? null
          : buildMissingKeyMessage("veniceAI");
      case ApiProvider.OPENAI_IMAGES:
        return agentEnv.OPENAI_API_KEY
          ? null
          : buildMissingKeyMessage("openAiImages");
      case ApiProvider.REPLICATE:
        return agentEnv.REPLICATE_API_TOKEN
          ? null
          : buildMissingKeyMessage("replicate");
      case ApiProvider.FAL_AI:
        return agentEnv.FAL_AI_API_KEY ? null : buildMissingKeyMessage("falAi");
      case ApiProvider.CLAUDE_CODE:
        // Agent SDK authenticates via OAuth login, no separate API key needed.
        return null;
      default:
        return null;
    }
  })();

  // Guard: Agent SDK models are admin-only.
  if (
    modelConfig.apiProvider === ApiProvider.CLAUDE_CODE &&
    (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN))
  ) {
    logger.warn("[Setup] Non-admin user attempted to use Agent SDK model", {
      model: data.model,
    });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }

  if (providerKeyMissing) {
    logger.warn("AI provider API key not configured", { model: data.model });
    return fail({
      message: aiStreamT("route.errors.invalidRequestData", {
        issue: providerKeyMissing,
      }),
      errorType: ErrorResponseTypes.BAD_REQUEST,
    });
  }

  // Every instance that runs the loop bills its own wallet at its own markup —
  // there is no "skip". A ws-provider receiver runs the loop as the connection
  // owner (a user that exists here with a wallet), so validation + billing apply
  // normally. This is what makes inference-provider bill on BOTH sides (each hop's
  // markup) and remote-folder bill only where the loop actually runs.
  const creditValidation = await CreditValidatorHandler.validateCredits({
    user,
    ipAddress,
    modelInfo: modelConfig,
    locale,
    logger,
    t: aiStreamT,
  });
  if (!creditValidation.success) {
    return creditValidation;
  }

  const { effectiveLeadId, modelCost } = creditValidation.data;
  return { success: true, data: { modelConfig, effectiveLeadId, modelCost } };
}
/**
 * Headless Intake Phase
 *
 * Runs at the very top of createAiStream — before the ws-provider/relay/
 * auto-queue branches — but ONLY when the caller passes `headlessIntake`
 * (i.e. the runHeadlessAiStream adapter). Interactive clients and the
 * ws-provider/relay receivers send fully-formed request data and never
 * enter this phase.
 *
 * Responsibilities (moved verbatim from the old headless wrapper):
 * 1. preCall injection — write pre-fetched tool results as real thread
 *    messages (user + synthetic assistant + TOOL chain) so the AI sees them
 *    in context and the UI renders them like regular tool calls. Persistent
 *    threads only — incognito preCalls are skipped (nothing to persist).
 * 2. Append-mode parent resolution — data.parentMessageId (the adapter's
 *    explicitParentMessageId) wins; otherwise the thread's newest message.
 *    The explicit parent is critical for WAIT-mode resume where the tool
 *    message with the backfilled result must be the history root, not
 *    whatever message was created last by timestamp.
 * 3. Operation derivation — operationOverride ?? (revival+parent →
 *    "wakeup-resume" | parent → "answer-as-ai" | none → "send"). When
 *    preCalls were written, the user message already exists, so the
 *    operation is forced to "answer-as-ai" and userMessageId to null so
 *    setup's processOperation/createUserMessageWithAttachments never double-insert it.
 *
 * Ordering matters: this phase must run BEFORE the relay branch so that a
 * relayed headless turn (e.g. a REMOTE-folder revival) forwards the DERIVED
 * operation + parent to the remote instance — exactly like the old wrapper,
 * which derived everything before calling createAiStream.
 */

/** A pre-fetched tool call result to inject into the thread before the AI runs */
