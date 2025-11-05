"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import type { JSX } from "react";
import React, { useEffect } from "react";

import { useFolderPermissions } from "@/app/api/[locale]/v1/core/agent/chat/folders/[id]/permissions/hooks";
import { UserRoleOptions } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { type EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface FolderPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderName: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function FolderPermissionsDialog({
  open,
  onOpenChange,
  folderId,
  folderName,
  locale,
  logger,
}: FolderPermissionsDialogProps): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useFolderPermissions(
    {
      folderId,
      enabled: open && !!folderId,
    },
    logger,
  );

  // Load current permissions when dialog opens
  useEffect(() => {
    if (open && folderId) {
      void endpoint.read.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, folderId]);

  const handleSave = async (e?: React.FormEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
    }
    await endpoint.create.onSubmit(e);
    if (endpoint.create.response?.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t("app.chat.permissions.folder.title")}</DialogTitle>
          <Div className="text-sm text-muted-foreground mt-2">{folderName}</Div>
        </DialogHeader>

        <Form
          form={endpoint.create.form}
          onSubmit={handleSave}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <ScrollArea className="flex-1 -mx-6 px-6 overflow-y-auto">
            <Div className="space-y-4 pr-4 pb-4">
              {/* Show error alert if GET request failed */}
              {endpoint.alert && <FormAlert alert={endpoint.alert} />}

              {/* Description */}
              <Div className="text-sm text-muted-foreground">
                {t("app.chat.permissions.folder.description")}
              </Div>

              {/* Read Permissions */}
              <EndpointFormField
                name="rolesRead"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.read.label",
                  description: "app.chat.permissions.read.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Write Permissions */}
              <EndpointFormField
                name="rolesWrite"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.write.label",
                  description: "app.chat.permissions.write.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Hide Permissions */}
              <EndpointFormField
                name="rolesHide"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.hide.label",
                  description: "app.chat.permissions.hide.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Delete Permissions */}
              <EndpointFormField
                name="rolesDelete"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.delete.label",
                  description: "app.chat.permissions.delete.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />
            </Div>
          </ScrollArea>

          {/* Action buttons */}
          <Div className="flex gap-2 justify-end pt-4 border-t flex-shrink-0 -mx-6 px-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={endpoint.isLoading || !!endpoint.read?.error}
            >
              {t("app.chat.common.save")}
            </Button>
          </Div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
