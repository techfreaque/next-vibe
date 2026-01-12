"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface FolderAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  locale: CountryLanguage;
}

/**
 * Get the folder-specific content based on folder ID
 */
function getFolderContent(
  folderId: string,
  t: ReturnType<typeof simpleT>["t"],
): {
  title: string;
  explanation: string;
  folderName: string;
} {
  switch (folderId) {
    case DefaultFolderId.PRIVATE:
      return {
        title: t("app.chat.folders.accessModal.privateTitle"),
        explanation: t("app.chat.folders.accessModal.privateExplanation"),
        folderName: t("app.chat.common.privateChats"),
      };
    case DefaultFolderId.SHARED:
      return {
        title: t("app.chat.folders.accessModal.sharedTitle"),
        explanation: t("app.chat.folders.accessModal.sharedExplanation"),
        folderName: t("app.chat.common.sharedChats"),
      };
    case DefaultFolderId.PUBLIC:
      return {
        title: t("app.chat.folders.accessModal.publicTitle"),
        explanation: t("app.chat.folders.accessModal.publicExplanation"),
        folderName: t("app.chat.common.publicChats"),
      };
    case DefaultFolderId.INCOGNITO:
      return {
        title: t("app.chat.folders.accessModal.incognitoTitle"),
        explanation: t("app.chat.folders.accessModal.incognitoExplanation"),
        folderName: t("app.chat.common.incognitoChats"),
      };
    default:
      return {
        title: t("app.chat.folders.accessModal.title"),
        explanation: "",
        folderName: "",
      };
  }
}

export function FolderAccessModal({
  open,
  onOpenChange,
  folderId,
  locale,
}: FolderAccessModalProps): JSX.Element {
  const { t } = simpleT(locale);
  const { title, explanation, folderName } = getFolderContent(folderId, t);

  // Construct proper locale-aware routes
  const loginUrl = `/${locale}/user/login`;
  const signupUrl = `/${locale}/user/signup`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {t("app.chat.folders.accessModal.requiresAccount", {
              folderName,
            })}
          </DialogDescription>
        </DialogHeader>

        <Div className="py-4">
          <P className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </P>
        </Div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t("app.chat.folders.accessModal.close")}
          </Button>
          <Div className="flex gap-2 w-full sm:w-auto">
            <Link href={loginUrl} className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full">
                {t("app.chat.folders.accessModal.loginButton")}
              </Button>
            </Link>
            <Link href={signupUrl} className="flex-1 sm:flex-none">
              <Button className="w-full">
                {t("app.chat.folders.accessModal.signupButton")}
              </Button>
            </Link>
          </Div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
