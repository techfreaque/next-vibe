"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { usePathname } from "next-vibe/ui/hooks/use-navigation";
import { addDocumentListener, getVisibilityState } from "next-vibe/ui/lib/dom";
import { storage } from "next-vibe/ui/lib/storage";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useEffect, useState } from "react";

import definition from "./definition";
import { scopedTranslation } from "./i18n";

export function SessionEmailBanner({
  user,
  email,
  locale,
}: {
  user: JwtPrivatePayloadType;
  email: string;
  locale: CountryLanguage;
}): React.JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useLogger();
  const path = usePathname();
  const verifying = path.includes("/user/verify-email/");
  const key = `email-notice-dismissed:${user.id}`;
  const { mutateAsync, isPending, data, error } = useApiMutation(
    definition.POST,
    logger,
    user,
  );
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (verifying) {
      return;
    }
    let active = true;
    const showNotice = async (): Promise<void> => {
      const saved = await storage.getItem(key, logger);
      if (!active) {
        return;
      }
      if (saved === email) {
        setDismissed(true);
      } else {
        await mutateAsync({ requestData: { notice: true } });
      }
    };
    void showNotice();
    return (): void => {
      active = false;
    };
  }, [email, key, logger, mutateAsync, verifying]);
  useEffect(() => {
    if (dismissed || verifying || (data?.success && data.data.verified)) {
      return;
    }
    return addDocumentListener("visibilitychange", () => {
      if (getVisibilityState() === "visible") {
        void mutateAsync({ requestData: { notice: true } });
      }
    });
  }, [data, dismissed, mutateAsync, verifying]);
  if (dismissed || verifying || (data?.success && data.data.verified)) {
    return null;
  }
  return (
    <Div
      aria-label={t("widget.heroTitle")}
      data-testid="session-email-banner"
      className="fixed top-20 right-3 left-3 z-50 ml-auto max-w-sm sm:right-6 rounded-lg border bg-background p-4 shadow-md"
    >
      <P className="m-0 break-words text-sm font-medium">
        {t("accountChallenge.notice", { email })}
      </P>
      {(data || error) && (
        <P className="mt-1 text-sm">
          {error?.message ??
            (data?.success ? data.data.message : data?.message)}
        </P>
      )}
      <Div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => void mutateAsync({ requestData: {} })}
        >
          {t("widget.resend")}
        </Button>
        <Link
          className="text-sm underline underline-offset-2"
          href={`/${locale}/user/settings`}
        >
          {t("accountChallenge.settings")}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void storage.setItem(key, email, logger);
            setDismissed(true);
          }}
        >
          {t("accountChallenge.dismiss")}
        </Button>
      </Div>
    </Div>
  );
}
