"use client";
// error page has to stay a client component

import { Environment } from "next-vibe/shared/utils";
import { useParams } from "next-vibe-ui/hooks/use-navigation";
import { Div } from "next-vibe-ui/ui/div";
import { H2, P, } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Button } from "next-vibe-ui/ui/button";
import { Link } from "next-vibe-ui/ui/link";
import type { ReactElement } from "react";

import { envClient } from "@/config/env-client";
import useErrorHandler from "@/hooks/use-error-handler";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactElement {
  // In non-production environments, throw the error to let Next.js handle it with its awesome error page
  if (
    envClient.NODE_ENV !== Environment.PRODUCTION ||
    envClient.NEXT_PUBLIC_DEBUG_PRODUCTION
  ) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax
    throw error;
  }

  const { locale }: { locale: CountryLanguage } = useParams();
  const { t } = simpleT(locale);
  const digest = useErrorHandler(error);

  return (
    <Div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <H2 className="text-3xl font-bold mb-4">{t("app.pages.error.title")}</H2>
      <P className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {t("app.pages.error.message")}
        {digest && (
          <Span className="block mt-2 text-xs text-gray-500">
            {t("app.pages.error.errorId", { id: digest })}
          </Span>
        )}
        {error.message && (
          <Span className="block mt-2 text-xs text-gray-500">
            {t("app.pages.error.error_message", { message: error.message })}
          </Span>
        )}
        {error.stack && (
          <Span className="block mt-2 text-xs text-gray-500">
            {t("app.pages.error.stackTrace", { stack: error.stack })}
          </Span>
        )}
      </P>
      <Div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} variant="outline">
          {t("app.pages.error.tryAgain")}
        </Button>
        <Button asChild>
          <Link href={`/${locale}`}>{t("app.pages.error.backToHome")}</Link>
        </Button>
      </Div>
    </Div>
  );
}
