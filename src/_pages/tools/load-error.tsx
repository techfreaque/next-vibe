"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

/** Shown when the tools page could not resolve the session on the server. */
export function ToolsLoadError({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const router = useRouter();
  return (
    <Div className="flex min-h-dvh w-full items-start justify-center bg-background px-4 pt-[15vh]">
      <EmptyBlock
        size="page"
        className="w-full max-w-lg rounded-xl border bg-card"
        icon={<AlertCircle className="h-5 w-5" />}
        title={t("loadError.title")}
        message={t("loadError.message")}
        action={{
          label: t("loadError.reload"),
          onClick: () => globalThis.location?.reload(),
        }}
        secondaryAction={{
          label: t("loadError.signIn"),
          onClick: () => router.push(`/${locale}/user/login`),
        }}
      />
    </Div>
  );
}
