"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import type { JSX } from "react";
import React from "react";

import definitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ThreadShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
  threadTitle: string;
  locale: CountryLanguage;
}

export function ThreadShareDialog({
  open,
  onOpenChange,
  threadId,
  threadTitle,
  locale,
}: ThreadShareDialogProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t("app.chat.shareDialog.title")}</DialogTitle>
          <Div className="text-sm text-muted-foreground mt-2">
            {threadTitle}
          </Div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 overflow-y-auto">
          <EndpointsPage
            endpoint={definitions}
            locale={locale}
            endpointOptions={{
              read: {
                urlPathParams: { threadId },
                queryOptions: {
                  enabled: open && !!threadId,
                  refetchOnWindowFocus: false,
                  staleTime: 30 * 1000,
                },
              },
              create: {
                urlPathParams: { threadId },
                formOptions: { persistForm: false },
              },
              update: {
                urlPathParams: { threadId },
                formOptions: { persistForm: false },
              },
              delete: {
                urlPathParams: { threadId },
              },
            }}
          />
        </ScrollArea>

        <Div className="flex gap-2 justify-end pt-4 border-t flex-shrink-0 -mx-6 px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("app.chat.common.close")}
          </Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
