"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { GitBranch, RotateCcw, Trash2 } from "next-vibe-ui/ui/icons";
import type React from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { CopyButton } from "./copy-button";
import { MessageActionButton } from "./message-action-button";

interface UserMessageActionsProps {
  messageId: string;
  content: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onBranch?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
}

export function UserMessageActions({
  messageId,
  content,
  locale,
  logger,
  onBranch,
  onRetry,
  onDelete,
  className,
}: UserMessageActionsProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const isTouch = useTouchDevice();

  return (
    <Div
      className={cn(
        "flex items-center gap-1",
        "transition-opacity duration-150",
        // Touch devices: always visible but slightly transparent
        // Pointer devices: hidden until hover
        isTouch
          ? "opacity-70 active:opacity-100"
          : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
        className,
      )}
    >
      <CopyButton content={content} locale={locale} logger={logger} />

      {onBranch && (
        <MessageActionButton
          icon={GitBranch}
          onClick={() => onBranch(messageId)}
          title={t("app.chat.common.userMessageActions.branch")}
        />
      )}

      {onRetry && (
        <MessageActionButton
          icon={RotateCcw}
          onClick={() => onRetry(messageId)}
          title={t("app.chat.common.userMessageActions.retry")}
        />
      )}

      {onDelete && (
        <MessageActionButton
          icon={Trash2}
          onClick={() => onDelete(messageId)}
          title={t("app.chat.common.userMessageActions.deleteMessage")}
          variant="destructive"
        />
      )}
    </Div>
  );
}
