"use client";

import { H3, P } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Info, RotateCcw } from "next-vibe-ui/ui/icons";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  locale: CountryLanguage;
}

interface FallbackProps {
  error: Error;
  reset: () => void;
  locale: CountryLanguage;
}

/**
 * Default error fallback component
 */
export function DefaultErrorFallback({
  error,
  reset,
  locale,
}: FallbackProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Card className="border-destructive">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <Info className="h-12 w-12 text-destructive mb-4" />
        <H3 className="text-xl font-semibold mb-2">
          {t("app.common.error.title")}
        </H3>
        <P className="text-muted-foreground mb-4">
          {t("app.common.error.message")}
        </P>
        <P className="text-sm text-muted-foreground mb-6">
          {error.message || t("app.common.errors.unknown")}
        </P>
        <Button
          onClick={reset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("app.common.error.tryAgain")}
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Error boundary component to catch errors in react components
 */
export function ErrorBoundary({
  children,
  fallback,
  locale,
}: ErrorBoundaryProps): JSX.Element {
  const [error, setError] = useState<Error | null>(null);

  // useEffect(() => {
  //   const errorHandler = (error: ErrorEvent): void => {
  //     errorLogger("Error caught by error boundary:", error);
  //     setError(parseError(error.error));
  //     throw error.error;
  //   };

  //   window.addEventListener("error", errorHandler);

  //   return (): void => {
  //     window.removeEventListener("error", errorHandler);
  //   };
  // }, []);

  if (error) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <DefaultErrorFallback
        locale={locale}
        error={error}
        reset={() => setError(null)}
      />
    );
  }

  return <>{children}</>;
}
