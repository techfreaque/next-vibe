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

import { useThreadPermissions } from "@/app/api/[locale]/agent/chat/threads/[threadId]/permissions/hooks";
import { UserRoleOptions } from "@/app/api/[locale]/user/user-roles/enum";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ThreadPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
  threadTitle: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function ThreadPermissionsDialog({
  open,
  onOpenChange,
  threadId,
  threadTitle,
  locale,
  logger,
}: ThreadPermissionsDialogProps): JSX.Element {
  const { t } = simpleT(locale);

  const endpoint = useThreadPermissions(
    {
      threadId,
      enabled: open && !!threadId,
    },
    logger,
  );

  // Load current permissions when dialog opens
  useEffect(() => {
    if (open && threadId) {
      void endpoint.read.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, threadId]);

  const handleSave = async (): Promise<void> => {
    await endpoint.create.onSubmit();
    if (endpoint.create.response?.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t("app.chat.permissions.thread.title")}</DialogTitle>
          <Div className="text-sm text-muted-foreground mt-2">
            {threadTitle}
          </Div>
        </DialogHeader>

        <Form
          form={endpoint.create.form}
          onSubmit={handleSave}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <ScrollArea className="flex-1 -mx-6 px-6 overflow-y-auto">
            <Div className="flex flex-col gap-4 pr-4 pb-4">
              {/* Show error alert if GET request failed */}
              {endpoint.alert && <FormAlert alert={endpoint.alert} />}

              {/* Description */}
              <Div className="text-sm text-muted-foreground">
                {t("app.chat.permissions.thread.description")}
              </Div>

              {/* View Permissions */}
              <EndpointFormField
                name="rolesView"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.view.label",
                  description: "app.chat.permissions.view.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Edit Permissions */}
              <EndpointFormField
                name="rolesEdit"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.edit.label",
                  description: "app.chat.permissions.edit.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Post Permissions */}
              <EndpointFormField
                name="rolesPost"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.post.label",
                  description: "app.chat.permissions.post.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Moderate Permissions */}
              <EndpointFormField
                name="rolesModerate"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.moderate.label",
                  description: "app.chat.permissions.moderate.description",
                  options: UserRoleOptions,
                }}
                control={endpoint.create.form.control}
                theme={{ style: "none", showAllRequired: false }}
              />

              {/* Admin Permissions */}
              <EndpointFormField
                name="rolesAdmin"
                config={{
                  type: "multiselect",
                  label: "app.chat.permissions.admin.label",
                  description: "app.chat.permissions.admin.description",
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
