"use client";

import type { Route } from "next";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { isDefaultFolderId } from "../../../config";
import {
  type FolderByIdT,
  type FolderByIdTranslationKey,
  scopedTranslation,
} from "../i18n";

interface FolderAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  locale: CountryLanguage;
}

interface FolderAccessContentKeys {
  readonly title: FolderByIdTranslationKey;
  readonly explanation: FolderByIdTranslationKey;
  readonly folderName: FolderByIdTranslationKey;
}

/**
 * Exhaustive map from every root folder ID to its modal translation keys.
 * Adding a new DefaultFolderId without entries here fails the type check.
 */
export const FOLDER_ACCESS_CONTENT = {
  [DefaultFolderId.PRIVATE]: {
    title: "widget.accessModal.privateTitle",
    explanation: "widget.accessModal.privateExplanation",
    folderName: "widget.common.privateChats",
  },
  [DefaultFolderId.SHARED]: {
    title: "widget.accessModal.sharedTitle",
    explanation: "widget.accessModal.sharedExplanation",
    folderName: "widget.common.sharedChats",
  },
  [DefaultFolderId.PUBLIC]: {
    title: "widget.accessModal.publicTitle",
    explanation: "widget.accessModal.publicExplanation",
    folderName: "widget.common.publicChats",
  },
  [DefaultFolderId.INCOGNITO]: {
    title: "widget.accessModal.incognitoTitle",
    explanation: "widget.accessModal.incognitoExplanation",
    folderName: "widget.common.incognitoChats",
  },
  [DefaultFolderId.BACKGROUND]: {
    title: "widget.accessModal.backgroundTitle",
    explanation: "widget.accessModal.backgroundExplanation",
    folderName: "widget.common.backgroundChats",
  },
  [DefaultFolderId.REMOTE]: {
    title: "widget.accessModal.remoteTitle",
    explanation: "widget.accessModal.remoteExplanation",
    folderName: "widget.common.remoteChats",
  },
} as const satisfies Record<DefaultFolderId, FolderAccessContentKeys>;

/**
 * Resolve localized modal copy for a root folder.
 */
export function getFolderAccessContent(
  folderId: DefaultFolderId,
  t: FolderByIdT,
): {
  title: string;
  explanation: string;
  folderName: string;
} {
  const keys = FOLDER_ACCESS_CONTENT[folderId];
  return {
    title: t(keys.title),
    explanation: t(keys.explanation),
    folderName: t(keys.folderName),
  };
}

export function FolderAccessModal({
  open,
  onOpenChange,
  folderId,
  locale,
}: FolderAccessModalProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { title, explanation, folderName } = isDefaultFolderId(folderId)
    ? getFolderAccessContent(folderId, t)
    : {
        title: t("widget.accessModal.title"),
        explanation: "",
        folderName: t("widget.accessModal.title"),
      };

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
