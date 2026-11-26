/**
 * Delete-account confirmation shared by the user record and the full profile.
 * The DELETE request only fires from the explicit confirm button.
 */

"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import type React from "react";
import { useCallback } from "react";

import definition from "./definition";
import { scopedTranslation } from "./i18n";

export function UserDeleteDialog({
  userId,
  name,
  open,
  onOpenChange,
  onDeleted,
}: {
  userId: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const { t } = scopedTranslation.scopedT(locale);
  const endpoint = useEndpoint(
    { DELETE: definition.DELETE },
    {
      delete: {
        urlPathParams: { id: userId },
        mutationOptions: {
          onSuccess: () => {
            onOpenChange(false);
            onDeleted();
          },
        },
      },
    },
    logger,
    user,
  );
  const mutation = endpoint.delete;
  const isSubmitting = mutation?.isSubmitting ?? false;
  const error = mutation?.submitError;

  const confirm = useCallback((): void => {
    void mutation?.submit();
  }, [mutation]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) {
          onOpenChange(next);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("id.widget.deleteDialogTitle", { name })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("id.widget.confirmDeletionMessage")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <P role="alert" className="text-sm text-destructive">
            {error.message}
          </P>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            {t("id.widget.cancelDeletion")}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={confirm}
          >
            {t(
              isSubmitting
                ? "id.delete.submitButton.loadingText"
                : "id.delete.submitButton.label",
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
