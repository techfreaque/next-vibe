"use client";

import type { Route } from "next";
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

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";

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
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): {
  title: string;
  explanation: string;
  folderName: string;
} {
  switch (folderId) {
    case DefaultFolderId.PRIVATE:
      return {
        title: t("widget.accessModal.privateTitle"),
        explanation: t("widget.accessModal.privateExplanation"),
        folderName: t("widget.common.privateChats"),
      };
    case DefaultFolderId.SHARED:
      return {
        title: t("widget.accessModal.sharedTitle"),
        explanation: t("widget.accessModal.sharedExplanation"),
        folderName: t("widget.common.sharedChats"),
      };
    case DefaultFolderId.PUBLIC:
      return {
        title: t("widget.accessModal.publicTitle"),
        explanation: t("widget.accessModal.publicExplanation"),
        folderName: t("widget.common.publicChats"),
      };
    case DefaultFolderId.INCOGNITO:
      return {
        title: t("widget.accessModal.incognitoTitle"),
        explanation: t("widget.accessModal.incognitoExplanation"),
        folderName: t("widget.common.incognitoChats"),
      };
    default:
      return {
        title: t("widget.accessModal.title"),
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
  const { t } = scopedTranslation.scopedT(locale);
  const { title, explanation, folderName } = getFolderContent(folderId, t);

  // Construct proper locale-aware routes
  const loginUrl: Route<`/${CountryLanguage}/user/login`> = `/${locale}/user/login`;
  const signupUrl: Route<`/${CountryLanguage}/user/signup`> = `/${locale}/user/signup`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {t("widget.accessModal.requiresAccount", {
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
            {t("widget.accessModal.close")}
          </Button>
          <Div className="flex gap-2 w-full sm:w-auto">
            <Link href={loginUrl} className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full">
                {t("widget.accessModal.loginButton")}
              </Button>
            </Link>
            <Link href={signupUrl} className="flex-1 sm:flex-none">
              <Button className="w-full">
                {t("widget.accessModal.signupButton")}
              </Button>
            </Link>
          </Div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
