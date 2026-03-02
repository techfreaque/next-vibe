"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import threadPermissionsDefinitions from "@/app/api/[locale]/agent/chat/threads/[threadId]/permissions/definition";
import { scopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/permissions/i18n";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
