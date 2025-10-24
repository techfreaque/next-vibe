import { Div, H1, P } from "next-vibe-ui/ui";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  locale: CountryLanguage;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  locale,
}: AuthLayoutProps): JSX.Element {
  const { t } = simpleT(locale);
  const appName = t("app.user.common.appName");
  const year = new Date().getFullYear();
  return (
    <Div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <Div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={`/${locale}`} className="flex justify-center">
          <Image
            src="/images/placeholder-logo.svg"
            alt={appName}
            width={180}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <H1 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          {title}
        </H1>

        {subtitle && (
          <P className="mt-2 text-center text-sm text-muted-foreground">
            {subtitle}
          </P>
        )}
      </Div>

      <Div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-8">
          {children}
        </Div>
      </Div>

      <Div className="mt-8 text-center text-sm text-muted-foreground">
        <P>{t("app.user.common.footer.copyright", { year, appName })}</P>
      </Div>
    </Div>
  );
}
