import { NextResponse } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

const allLocales = Object.values(CountryLanguageValues) as CountryLanguage[];

function getLocaleFromRequest(request: Request): CountryLanguage {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  for (const lang of acceptLanguage.split(",")) {
    const tag = lang.split(";")[0]?.trim();
    if (!tag) {
      continue;
    }
    const normalized = tag.replace("_", "-");
    const exact = allLocales.find(
      (l) => l.toLowerCase() === normalized.toLowerCase(),
    );
    if (exact) {
      return exact;
    }
    const langCode = normalized.split("-")[0]?.toLowerCase();
    if (!langCode) {
      continue;
    }
    const globalLocale = `${langCode}-GLOBAL` as CountryLanguage;
    if (allLocales.includes(globalLocale)) {
      return globalLocale;
    }
    const match = allLocales.find(
      (l) => l.split("-")[0]?.toLowerCase() === langCode,
    );
    if (match) {
      return match;
    }
  }
  return allLocales[0];
}

function notFoundResponse(request: Request): NextResponse {
  const locale = getLocaleFromRequest(request);
  const { t } = scopedTranslation.scopedT(locale);
  return new NextResponse(t("not_found"), { status: 404 });
}

export function GET(request: Request): NextResponse {
  return notFoundResponse(request);
}

export function POST(request: Request): NextResponse {
  return notFoundResponse(request);
}

export function PUT(request: Request): NextResponse {
  return notFoundResponse(request);
}

export function DELETE(request: Request): NextResponse {
  return notFoundResponse(request);
}

export function PATCH(request: Request): NextResponse {
  return notFoundResponse(request);
}

export function OPTIONS(request: Request): NextResponse {
  return notFoundResponse(request);
}
