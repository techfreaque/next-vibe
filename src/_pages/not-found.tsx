"use client";

import {
  CountryLanguageValues,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import { usePathname } from "next-vibe/ui/hooks/use-pathname";
import type { JSX } from "react";
import { z } from "zod";

import { NotFoundBackButton } from "./[...notFound]/not-found-client";

const routeLocaleSchema = z.enum(CountryLanguageValues);

export default function NotFound(): JSX.Element {
  const pathname = usePathname();
  const locale =
    routeLocaleSchema.safeParse(pathname?.split("/")[1]).data ?? defaultLocale;

  return <NotFoundBackButton locale={locale} />;
}
