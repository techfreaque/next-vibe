"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Lock } from "next-vibe-ui/ui/icons/Lock";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Input } from "next-vibe-ui/ui/input";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { success } from "next-vibe/shared/types/response.schema";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface ThreadShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
  threadTitle: string;
  currentRootFolderId: DefaultFolderId;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  onThreadMoved?: () => void;
}

export function ThreadShareDialog({
  open,
  onOpenChange,
  threadId,
  threadTitle,
  currentRootFolderId,
  locale,
  user,
  logger,
  onThreadMoved,
}: ThreadShareDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const isInSharedFolder = currentRootFolderId === DefaultFolderId.SHARED;
  const [overridePublic, setOverridePublic] = useState<boolean | null>(null);
  const isPublic = overridePublic !== null ? overridePublic : isInSharedFolder;

  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  /* eslint-disable i18next/no-literal-string */
  const threadUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/${locale}/threads/shared/${threadId}`;
    }
    return `${window.location.origin}/${locale}/threads/shared/${threadId}`;
  }, [locale, threadId]);
  /* eslint-enable i18next/no-literal-string */

  const handleCopy = useCallback((): void => {
    void navigator.clipboard.writeText(threadUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return undefined;
    });
  }, [threadUrl]);

  const handleSendEmail = useCallback((): void => {
    const emails = emailInput.trim();
    if (!emails) {
      return;
    }
    /* eslint-disable i18next/no-literal-string */
    const subject = encodeURIComponent(threadTitle);
    const body = encodeURIComponent(threadUrl);
    window.open(`mailto:${emails}?subject=${subject}&body=${body}`, "_blank");
    /* eslint-enable i18next/no-literal-string */
    setEmailInput("");
  }, [emailInput, threadTitle, threadUrl]);

  const handleTogglePublic = useCallback(async (): Promise<void> => {
    const targetPublic = !isPublic;
    const targetFolderId = targetPublic
      ? DefaultFolderId.SHARED
      : DefaultFolderId.PRIVATE;

    setIsToggling(true);
    try {
      // Optimistic: update threads sidebar cache
      const threadsDefModule =
        await import("@/app/api/[locale]/agent/chat/threads/definition");
      apiClient.updateEndpointData(
        threadsDefModule.default.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            threads: old.data.threads.map((row) =>
              row.id === threadId
                ? { ...row, rootFolderId: targetFolderId, folderId: null }
                : row,
            ),
          });
        },
        {
          requestData: { rootFolderId: currentRootFolderId, subFolderId: null },
        },
      );

      // Optimistic: remove from current folder-contents cache
      const folderContentsDefModule =
        await import("@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition");
      apiClient.updateEndpointData(
        folderContentsDefModule.default.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            items: old.data.items.filter((i) => i.id !== threadId),
          });
        },
        {
          urlPathParams: { rootFolderId: currentRootFolderId },
          requestData: { subFolderId: null, threadIds: null },
        },
      );

      // Persist
      const threadDef =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
      await apiClient.mutate(
        threadDef.default.PATCH,
        logger,
        user,
        { rootFolderId: targetFolderId, folderId: null },
        { threadId },
        locale,
      );

      setOverridePublic(targetPublic);
      onThreadMoved?.();
    } finally {
      setIsToggling(false);
    }
  }, [
    isPublic,
    threadId,
    currentRootFolderId,
    logger,
    user,
    locale,
    onThreadMoved,
  ]);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] flex flex-col gap-0 p-0">
        <DialogHeader className="px-5 pt-5 pb-4 flex-shrink-0">
          <DialogTitle className="text-sm font-semibold">
            {t("widget.shareDialog.title")}{" "}
            <Span className="font-normal text-muted-foreground">
              &ldquo;{threadTitle}&rdquo;
            </Span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("widget.shareDialog.title")}
          </DialogDescription>
        </DialogHeader>

        <Div className="px-5 pb-5 flex flex-col gap-4">
          {/* Public / private toggle */}
          <Div
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-colors",
              isPublic
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-muted/30",
            )}
            onClick={(): void => {
              void handleTogglePublic();
            }}
          >
            <Div
              className={cn(
                "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                isPublic
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isPublic ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Div>
            <Div className="flex-1 flex flex-col gap-0.5">
              <Div className="text-sm font-medium">
                {isPublic
                  ? t("widget.visibility.publicTitle")
                  : t("widget.visibility.privateTitle")}
              </Div>
              <Div className="text-xs text-muted-foreground">
                {isPublic
                  ? t("widget.visibility.publicDescription")
                  : t("widget.visibility.privateDescription")}
              </Div>
            </Div>
            <Button
              variant={isPublic ? "outline" : "default"}
              size="sm"
              disabled={isToggling}
              onClick={(e) => {
                e.stopPropagation();
                void handleTogglePublic();
              }}
              className="shrink-0"
            >
              {isToggling
                ? t("widget.visibility.toggling")
                : isPublic
                  ? t("widget.visibility.makePrivate")
                  : t("widget.visibility.makePublic")}
            </Button>
          </Div>

          {isPublic && (
            <>
              <Separator />

              {/* Thread URL + copy */}
              <Div className="flex gap-2">
                <Div className="flex-1 min-w-0 flex items-center rounded-md border bg-muted/40 px-3 py-2 text-sm font-mono text-muted-foreground overflow-hidden">
                  {/* eslint-disable-next-line i18next/no-literal-string */}
                  <Span className="truncate">{threadUrl}</Span>
                </Div>
                <Button
                  variant={copied ? "default" : "outline"}
                  size="icon"
                  onClick={handleCopy}
                  className={cn(
                    "shrink-0 transition-colors",
                    copied &&
                      "bg-green-600 border-green-600 hover:bg-green-700",
                  )}
                  title={t("widget.shareDialog.copyLink")}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </Div>

              {/* Email invite */}
              <Div className="flex gap-2">
                <Div className="relative flex-1">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendEmail();
                      }
                    }}
                    placeholder={t("widget.emailShare.placeholder")}
                    className="pl-8 text-sm"
                  />
                </Div>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!emailInput.trim()}
                  onClick={handleSendEmail}
                  title={t("widget.emailShare.send")}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </Div>
            </>
          )}
        </Div>

        <Separator />
        <Div className="flex justify-end px-5 py-3 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            {t("widget.common.close")}
          </Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
