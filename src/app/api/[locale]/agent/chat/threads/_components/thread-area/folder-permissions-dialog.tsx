"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import type { JSX } from "react";

import folderPermissionsDefinitions from "@/app/api/[locale]/agent/chat/folders/[id]/permissions/definition";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const { t } = simpleT(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {t("app.chat.permissions.folder.title")} ({folderName})
          </DialogTitle>
        </DialogHeader>

        <EndpointsPage
          endpoint={folderPermissionsDefinitions}
          locale={locale}
          user={user}
          endpointOptions={{
            read: {
              urlPathParams: { id: folderId },
              queryOptions: {
                enabled: open && !!folderId,
                refetchOnWindowFocus: false,
                staleTime: 30 * 1000,
              },
            },
            create: {
              urlPathParams: { id: folderId },
              formOptions: { persistForm: false },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
