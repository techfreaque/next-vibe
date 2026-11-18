"use client";

/**
 * Prefilled chat links: `/threads/<folder>/new?q=<text>&model=<id>&skill=<id>`.
 * - `q` pre-fills the composer once
 * - `model` selects that chat model (legacy ids → successor; ids the user
 *   cannot use are ignored silently and the current model stays)
 * - `skill` hands the skill to the onboarding controller, which adds it,
 *   makes it active and makes sure a companion exists
 * - `ref` was already attributed server-side by the page loader
 * All of them are then stripped from the URL so a reload or a shared link
 * does not overwrite what the user did since.
 *
 * `q` works by writing the text as the new-thread draft (same key the
 * composer autosaves to). This runs in a layout effect of the page that
 * hosts the chat, so the write lands before the composer's passive
 * draft-load effect reads it - no change to the composer itself.
 */

import type { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import {
  usePathname,
  useSearchParams,
  useSilentHistory,
} from "next-vibe/ui/hooks/use-navigation";
import { useLayoutEffect, useRef } from "react";

import { NEW_MESSAGE_ID } from "../../../chat/enum";
import type { ChatSettingsGetResponseOutput } from "../../../chat/settings/definition";
import {
  applyLinkedChatModel,
  resolveLinkedChatModel,
} from "../../../chat/settings/link-model";
import { useProviderAvailability } from "../../../env-availability-store";
import { useArrivalStore } from "../widget/onboarding/arrival-store";
import { getDraftKey, saveDraft } from "./use-input-autosave";

/** Query param carrying the prompt to pre-fill. */
export const PREFILL_QUERY_PARAM = "q";

/** Query param carrying the chat model id to select. */
export const PREFILL_MODEL_PARAM = "model";

/** Query param carrying the skill to start the chat with. */
export const PREFILL_SKILL_PARAM = "skill";

/** Referral code, attributed by the page loader; only stripped here. */
export const PREFILL_REF_PARAM = "ref";

/** Skill ids are slugs, UUIDs or `<skill>__<variant>`. */
const SKILL_PARAM_PATTERN = /^[\w-]{1,128}$/;

/** Hard cap so a crafted link cannot dump megabytes into storage. */
export const PREFILL_MAX_LENGTH = 4000;

export function buildPrefillUrl(pathname: string, search: string): string {
  const params = new URLSearchParams(search);
  params.delete(PREFILL_QUERY_PARAM);
  params.delete(PREFILL_MODEL_PARAM);
  params.delete(PREFILL_SKILL_PARAM);
  params.delete(PREFILL_REF_PARAM);
  const rest = params.toString();
  return rest.length > 0 ? `${pathname}?${rest}` : pathname;
}

export function useQueryPrefill({
  activeThreadId,
  rootFolderId,
  subFolderId,
  user,
  locale,
  initialSettings,
}: {
  activeThreadId: string | null;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  user: JwtPayloadType;
  locale: CountryLanguage;
  /** SSR settings - seeds the settings cache when a model is linked. */
  initialSettings: ChatSettingsGetResponseOutput | null;
}): void {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replaceState } = useSilentHistory();
  const logger = useLogger();
  const availability = useProviderAvailability();
  const consumedRef = useRef(false);

  const prefill = searchParams.get(PREFILL_QUERY_PARAM);
  const linkedModel = searchParams.get(PREFILL_MODEL_PARAM);
  const linkedSkill = searchParams.get(PREFILL_SKILL_PARAM);
  const linkedRef = searchParams.get(PREFILL_REF_PARAM);
  const setPendingSkillId = useArrivalStore((s) => s.setPendingSkillId);
  const search = searchParams.toString();
  const isNewThread =
    activeThreadId === null || activeThreadId === NEW_MESSAGE_ID;

  useLayoutEffect(() => {
    if (
      consumedRef.current ||
      (prefill === null &&
        linkedModel === null &&
        linkedSkill === null &&
        linkedRef === null)
    ) {
      return;
    }
    consumedRef.current = true;

    if (isNewThread && prefill !== null) {
      const text = prefill.trim().slice(0, PREFILL_MAX_LENGTH);
      if (text.length > 0) {
        void saveDraft(
          getDraftKey(activeThreadId, rootFolderId, subFolderId),
          text,
          logger,
        );
      }
    }

    if (isNewThread && linkedModel !== null) {
      const modelId = resolveLinkedChatModel(linkedModel, user, availability);
      if (modelId !== null) {
        void applyLinkedChatModel({
          modelId,
          fallbackSettings: initialSettings,
          user,
          logger,
          locale,
        });
      }
    }

    if (
      isNewThread &&
      linkedSkill !== null &&
      SKILL_PARAM_PATTERN.test(linkedSkill)
    ) {
      setPendingSkillId(linkedSkill);
    }

    replaceState(buildPrefillUrl(pathname, search));
  }, [
    prefill,
    linkedModel,
    linkedSkill,
    linkedRef,
    setPendingSkillId,
    search,
    pathname,
    isNewThread,
    activeThreadId,
    rootFolderId,
    subFolderId,
    user,
    locale,
    initialSettings,
    availability,
    logger,
    replaceState,
  ]);
}
