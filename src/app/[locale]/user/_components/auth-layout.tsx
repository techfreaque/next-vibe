import Image from "next/image";
import Link from "next/link";
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
  const appName = t("common.appName");
  const year = new Date().getFullYear();
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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

        <h1 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-8">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>{t("common.footer.copyright", { year, appName })}</p>
      </div>
    </div>
  );
}
