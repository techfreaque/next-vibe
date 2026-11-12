/**
 * Which chat models an API key's user may call. Single source: the same model
 * pool + per-user filtering the chat UI uses (provider availability, admin-only,
 * legacy -> successor).
 */

import "server-only";

import {
  type ChatModelOption,
  chatModelOptionsPool,
  ChatModelId,
  filterChatModels,
  resolveChatModelForUser,
} from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { ModelSelectionType } from "next-vibe/agent/skills/enum";
import { filterRoleModels, ApiProvider } from "next-vibe/agent/models/models";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

/** Text-in / text-out chat models only (no image/audio generators). */
function isTextChatModel(model: ChatModelOption): boolean {
  return model.inputs.includes("text") && model.outputs.includes("text");
}

/** The current (non-legacy) models this user can call right now. */
export function listUserChatModels(
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption[] {
  const pool = availability.unbottledForce
    ? chatModelOptionsPool.filter(
        (m) => m.apiProvider === ApiProvider.UNBOTTLED,
      )
    : chatModelOptionsPool;
  return filterRoleModels(pool, null, user, availability).filter(
    isTextChatModel,
  );
}

/**
 * One entry per model id, as GET /v1/models must list it. The pool holds one
 * option per provider route, so the same id can appear several times; each id
 * is reported as the variant a request with that id actually runs on.
 */
export function listUserCallableModels(
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption[] {
  const seen = new Set<string>();
  const models: ChatModelOption[] = [];
  for (const candidate of listUserChatModels(user, availability)) {
    if (seen.has(candidate.id)) {
      continue;
    }
    seen.add(candidate.id);
    const served = resolveRequestedModel(candidate.id, user, availability);
    models.push(served?.id === candidate.id ? served : candidate);
  }
  return models;
}

/**
 * Strict resolution of the `model` string from a request: exact id (legacy ids
 * map to their successor). Returns undefined when the model is unknown or not
 * servable for this user - never silently swaps to a different model.
 */
export function resolveRequestedModel(
  requested: string,
  user: JwtPayloadType,
  availability: AgentEnvAvailability,
): ChatModelOption | undefined {
  const modelId = Object.values(ChatModelId).find((id) => id === requested);
  if (!modelId) {
    return undefined;
  }
  const resolvedId = resolveChatModelForUser(modelId, user, availability);
  const [match] = filterChatModels(
    { selectionType: ModelSelectionType.MANUAL, manualModelId: resolvedId },
    user,
    availability,
  );
  if (!match || match.id !== resolvedId || !isTextChatModel(match)) {
    return undefined;
  }
  return match;
}
