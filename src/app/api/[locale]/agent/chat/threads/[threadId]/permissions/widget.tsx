"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { type EndpointLogger } from "next-vibe/logger/types";
import { EndpointsPage } from "next-vibe/ui/renderers/react/EndpointsPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/web/ui/dialog";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import { scopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/permissions/i18n";

import threadPermissionsDefinitions from "./definition";

interface ThreadPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
  threadTitle: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function ThreadPermissionsDialog({
  open,
  onOpenChange,
  threadId,
  threadTitle,
  locale,
  user,
}: ThreadPermissionsDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const handleSuccess = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const endpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId },
        queryOptions: {
          enabled: open && !!threadId,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
      },
      update: {
        urlPathParams: { threadId },
        formOptions: { persistForm: false },
        mutationOptions: {
          onSuccess: handleSuccess,
        },
      },
    }),
    [threadId, open, handleSuccess],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="shrink-0">
          <DialogTitle>{t("dialog.title", { threadTitle })}</DialogTitle>
        </DialogHeader>

        <EndpointsPage
          endpoint={threadPermissionsDefinitions}
          locale={locale}
          user={user}
          endpointOptions={endpointOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
