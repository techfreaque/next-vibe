"use client";

/**
 * Prefilled chat links: `/threads/<folder>/new?q=<text>&model=<id>`.
 * - `q` pre-fills the composer once
 * - `model` selects that chat model (legacy ids → successor; ids the user
 *   cannot use are ignored silently and the current model stays)
 * Both params are then stripped from the URL so a reload or a shared link
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
import { getDraftKey, saveDraft } from "./use-input-autosave";

/** Query param carrying the prompt to pre-fill. */
export const PREFILL_QUERY_PARAM = "q";

/** Query param carrying the chat model id to select. */
export const PREFILL_MODEL_PARAM = "model";

/** Hard cap so a crafted link cannot dump megabytes into storage. */
export const PREFILL_MAX_LENGTH = 4000;

export function buildPrefillUrl(pathname: string, search: string): string {
  const params = new URLSearchParams(search);
  params.delete(PREFILL_QUERY_PARAM);
  params.delete(PREFILL_MODEL_PARAM);
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
  const search = searchParams.toString();
  const isNewThread =
    activeThreadId === null || activeThreadId === NEW_MESSAGE_ID;

  useLayoutEffect(() => {
    if (consumedRef.current || (prefill === null && linkedModel === null)) {
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

    replaceState(buildPrefillUrl(pathname, search));
  }, [
    prefill,
    linkedModel,
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
