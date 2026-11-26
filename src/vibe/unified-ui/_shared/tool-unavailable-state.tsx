"use client";

import {
  EmptyBlock,
  type EmptyBlockAction,
} from "next-vibe/ui/components/empty-block";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Search } from "next-vibe/ui/components/icons/Search";
import type { JSX } from "react";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { scopedTranslation } from "../hooks/i18n";

/** Why a tool cannot open, so the page can say it and offer the right exit. */
export type ToolUnavailableReason =
  | "permission"
  | "instance"
  | "setup"
  | "unknown";

/**
 * The one "tool unavailable" state for the tools shell: says why, sends the
 * user back to the parent landing (primary), and offers the fix when one
 * exists (secondary). Never "Browse tools" as the only exit.
 */
export function ToolUnavailableState({
  reason,
  locale,
  back,
  fix,
  className,
}: {
  reason: ToolUnavailableReason;
  locale: CountryLanguage;
  /** Parent landing or list, e.g. "Back to Invoices". */
  back: EmptyBlockAction;
  /** The fix for `setup`/`instance` (e.g. "Finish setup"). */
  fix?: EmptyBlockAction;
  className?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const copy = {
    permission: {
      title: t("widgets.toolUnavailable.permissionTitle"),
      message: t("widgets.toolUnavailable.permissionMessage"),
    },
    instance: {
      title: t("widgets.toolUnavailable.instanceTitle"),
      message: t("widgets.toolUnavailable.instanceMessage"),
    },
    setup: {
      title: t("widgets.toolUnavailable.setupTitle"),
      message: t("widgets.toolUnavailable.setupMessage"),
    },
    unknown: {
      title: t("widgets.toolUnavailable.unknownTitle"),
      message: t("widgets.toolUnavailable.unknownMessage"),
    },
  }[reason];
  return (
    <EmptyBlock
      size="page"
      className={
        className ?? "mx-4 mt-6 rounded-xl border bg-card px-4 py-10 sm:mx-8"
      }
      icon={
        reason === "unknown" ? (
          <Search className="size-5" />
        ) : (
          <Lock className="size-5" />
        )
      }
      title={copy.title}
      message={copy.message}
      action={fix ?? back}
      secondaryAction={fix ? back : undefined}
    />
  );
}
