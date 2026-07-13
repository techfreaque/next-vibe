"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { type EndpointLogger } from "next-vibe/logger/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/ui/dialog";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

import folderPermissionsDefinitions from "@/app/api/[locale]/agent/chat/folders/subfolders/[subFolderId]/permissions/definition";

import { scopedTranslation } from "../i18n";

interface FolderPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderName: string;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function FolderPermissionsDialog({
  open,
  onOpenChange,
  folderId,
  folderName,
  locale,
  user,
}: FolderPermissionsDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const endpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { subFolderId: folderId },
        queryOptions: {
          enabled: open && !!folderId,
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
      },
      update: {
        urlPathParams: { subFolderId: folderId },
        formOptions: { persistForm: false },
      },
    }),
    [folderId, open],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {t("widget.permissions.folderTitle")} ({folderName})
          </DialogTitle>
        </DialogHeader>

        <EndpointsPage
          endpoint={folderPermissionsDefinitions}
          locale={locale}
          user={user}
          endpointOptions={endpointOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
