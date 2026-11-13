"use client";

/**
 * Composer gate: opens the consent dialog when an uncensored model becomes
 * active (model picker, skill variant, deep link, saved favorite) or when a
 * send was held back for missing consent (client check or server refusal).
 * Mounted once by the chat composer.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useState } from "react";

import { type ChatModelId, getChatModelById } from "../../../ai-stream/models";
import { isUncensoredContent } from "../constants";
import { useUncensoredConsent, useUncensoredConsentGate } from "../hooks";
import { UncensoredConsentDialog } from "./consent-dialog";

export function UncensoredConsentGate({
  modelId,
  locale,
  onResend,
  onPickAnother,
}: {
  modelId: ChatModelId | null | undefined;
  locale: CountryLanguage;
  /** Re-send the held-back message (the composer still has it) */
  onResend: () => void;
  /** Open the model picker */
  onPickAnother: () => void;
}): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const consent = useUncensoredConsent(user, logger);
  const gate = useUncensoredConsentGate();
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const model = getChatModelById(modelId);
  const selectionNeedsConsent =
    !!model &&
    isUncensoredContent(model.content) &&
    consent.consented === false &&
    dismissedFor !== model.id;
  const open =
    (gate.open || selectionNeedsConsent) && consent.consented !== true;

  const dismiss = (): void => {
    setError(null);
    setDismissedFor(model?.id ?? null);
    gate.close();
  };

  return (
    <UncensoredConsentDialog
      open={open}
      locale={locale}
      modelName={
        gate.open
          ? (gate.modelName ?? model?.name ?? null)
          : (model?.name ?? null)
      }
      isSaving={consent.isSaving}
      error={error}
      onDismiss={dismiss}
      onPickAnother={(): void => {
        dismiss();
        onPickAnother();
      }}
      onAgree={(): void => {
        setError(null);
        const resend = gate.resendOnAgree;
        void (async (): Promise<void> => {
          const result = await consent.agree();
          if (!result.success) {
            setError(result.message);
            return;
          }
          gate.close();
          if (resend) {
            onResend();
          }
        })();
      }}
    />
  );
}
