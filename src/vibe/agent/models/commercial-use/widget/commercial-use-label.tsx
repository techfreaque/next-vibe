/**
 * Small, honest commercial-use labels for media models. Rendered only for
 * restricted and unclear models; allowed models stay unlabeled in pickers.
 * Translated at display time in the viewer's locale.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import {
  CommercialUse,
  type CommercialUseInfo,
  commercialUseTermsHref,
  needsCommercialUseNotice,
} from "../enum";
import { scopedTranslation } from "../i18n";

function toneClass(info: CommercialUseInfo): string {
  return info.status === CommercialUse.RESTRICTED
    ? "border-amber-400 text-amber-700 dark:text-amber-400"
    : "border-muted-foreground/40 text-muted-foreground";
}

/** Compact badge for list rows (model picker cards). Null when allowed. */
export function CommercialUseBadge({
  info,
  locale,
  className,
}: {
  info: CommercialUseInfo | undefined;
  locale: CountryLanguage;
  className?: string;
}): JSX.Element | null {
  if (!needsCommercialUseNotice(info)) {
    return null;
  }
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-4 shrink-0 px-1.5 text-[9px] font-medium",
        toneClass(info),
        className,
      )}
    >
      {t(info.status)}
    </Badge>
  );
}

/**
 * Full notice for the selected model: status, reason, what to check and a
 * link to the AI-output section of the terms. Null when allowed.
 */
export function CommercialUseNotice({
  info,
  locale,
  className,
}: {
  info: CommercialUseInfo | undefined;
  locale: CountryLanguage;
  className?: string;
}): JSX.Element | null {
  if (!needsCommercialUseNotice(info)) {
    return null;
  }
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Span
      data-testid="commercial-use-notice"
      data-commercial-use={info.status}
      className={cn(
        "block text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Span
        className={cn(
          "font-medium",
          info.status === CommercialUse.RESTRICTED
            ? "text-amber-700 dark:text-amber-400"
            : "text-foreground",
        )}
      >
        {t(info.status)}.
      </Span>{" "}
      {t(info.reason)} {t("checkLicense")}{" "}
      <Link
        href={commercialUseTermsHref(locale)}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("termsLink")}
      </Link>
    </Span>
  );
}

/** Text parts for a fact row (model detail pages). Covers every status. */
export function commercialUseText(
  info: CommercialUseInfo,
  locale: CountryLanguage,
): {
  label: string;
  status: string;
  reason: string;
  check: string;
  termsLink: string;
} {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    label: t("label"),
    status: t(info.status),
    reason: t(info.reason),
    check: t("checkLicense"),
    termsLink: t("termsLink"),
  };
}
