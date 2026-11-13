"use client";

/**
 * Uncensored-model consent: client state used outside this endpoint's own
 * widget (chat composer gate, chat settings menu, API keys page).
 */

import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useCallback, useMemo, useState } from "react";
import { create } from "zustand";

import { type ChatModelId, getChatModelById } from "../../ai-stream/models";
import { isUncensoredContent } from "./constants";
import type { UncensoredConsentStatus } from "./definition";
import uncensoredConsentEndpoints from "./definition";

const STATUS_STALE_MS = 5 * 60 * 1000;

function writeStatusCache(
  status: UncensoredConsentStatus,
  logger: EndpointLogger,
): void {
  apiClient.updateEndpointData(uncensoredConsentEndpoints.GET, logger, () =>
    success(status),
  );
}

/**
 * Consent as the client last saw it: true / false, or null when the status was
 * never loaded (callers then let the server decide).
 */
export function getCachedUncensoredConsent(
  logger: EndpointLogger,
): boolean | null {
  const cached = apiClient.getEndpointData(
    uncensoredConsentEndpoints.GET,
    logger,
  );
  return cached?.success ? cached.data.consented : null;
}

/** The server refused a run for missing consent: remember that locally. */
export function markUncensoredConsentMissing(logger: EndpointLogger): void {
  writeStatusCache(
    { consented: false, consentedAt: null, version: null },
    logger,
  );
}

export interface UseUncensoredConsentReturn {
  /** null while the status is still loading */
  consented: boolean | null;
  consentedAt: Date | null;
  /** Consent stored for an older consent text: ask again */
  isOutdated: boolean;
  isSaving: boolean;
  agree: () => Promise<ResponseType<UncensoredConsentStatus>>;
  withdraw: () => Promise<ResponseType<UncensoredConsentStatus>>;
}

export function useUncensoredConsent(
  user: JwtPayloadType,
  logger: EndpointLogger,
): UseUncensoredConsentReturn {
  const query = useApiQuery({
    endpoint: uncensoredConsentEndpoints.GET,
    logger,
    user,
    options: {
      staleTime: STATUS_STALE_MS,
      refetchOnWindowFocus: false,
    },
  });
  const { locale } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const status = query.data;

  const agree = useCallback(async (): Promise<
    ResponseType<UncensoredConsentStatus>
  > => {
    setIsSaving(true);
    const result = await apiClient.mutate(
      uncensoredConsentEndpoints.POST,
      logger,
      user,
      { confirm: true },
      undefined,
      locale,
    );
    setIsSaving(false);
    if (result.success) {
      writeStatusCache(result.data, logger);
    }
    return result;
  }, [logger, user, locale]);

  const withdraw = useCallback(async (): Promise<
    ResponseType<UncensoredConsentStatus>
  > => {
    setIsSaving(true);
    const result = await apiClient.mutate(
      uncensoredConsentEndpoints.DELETE,
      logger,
      user,
      undefined,
      undefined,
      locale,
    );
    setIsSaving(false);
    if (result.success) {
      writeStatusCache(result.data, logger);
    }
    return result;
  }, [logger, user, locale]);

  return useMemo(
    () => ({
      consented: status ? status.consented : null,
      consentedAt: status?.consentedAt ? new Date(status.consentedAt) : null,
      isOutdated: Boolean(status && !status.consented && status.consentedAt),
      isSaving,
      agree,
      withdraw,
    }),
    [status, isSaving, agree, withdraw],
  );
}

/** Why the consent dialog is open. */
export type UncensoredConsentPrompt =
  /** an uncensored model became active (picker, skill variant, link) */
  | "select"
  /** a send was held back (client check or server refusal) */
  | "send";

interface UncensoredConsentGateState {
  open: boolean;
  prompt: UncensoredConsentPrompt;
  modelName: string | null;
  /** The composer holds a message that should go out right after agreeing */
  resendOnAgree: boolean;
  request: (params: {
    prompt: UncensoredConsentPrompt;
    modelName: string | null;
    resendOnAgree: boolean;
  }) => void;
  close: () => void;
}

/**
 * Global open-state of the consent dialog: the stream hook (outside React
 * render) asks for it, the composer gate renders it.
 */
export const useUncensoredConsentGate = create<UncensoredConsentGateState>(
  (set) => ({
    open: false,
    prompt: "select",
    modelName: null,
    resendOnAgree: false,
    request: ({ prompt, modelName, resendOnAgree }): void =>
      set({ open: true, prompt, modelName, resendOnAgree }),
    close: (): void => set({ open: false, resendOnAgree: false }),
  }),
);

/**
 * Composer pre-send check: true = send now. false = the model is uncensored
 * and this person has not consented; the consent dialog opens and the message
 * goes out right after they agree (the composer keeps the text meanwhile).
 */
export function canSendWithModel(
  modelId: ChatModelId | null | undefined,
  logger: EndpointLogger,
): boolean {
  const model = getChatModelById(modelId);
  if (
    !model ||
    !isUncensoredContent(model.content) ||
    getCachedUncensoredConsent(logger) !== false
  ) {
    return true;
  }
  useUncensoredConsentGate.getState().request({
    prompt: "send",
    modelName: model.name,
    resendOnAgree: true,
  });
  return false;
}
