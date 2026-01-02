import { NextResponse } from "next/server";

import { defaultLocaleConfig } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Use default locale for API error messages
const { t } = simpleT(`${defaultLocaleConfig.language}-${defaultLocaleConfig.country}`);

export function GET(): NextResponse {
  return new NextResponse(t("app.api.[...slug].not_found"), { status: 404 });
}

export function POST(): NextResponse {
  return new NextResponse(t("app.api.[...slug].not_found"), { status: 404 });
}

export function PUT(): NextResponse {
  return new NextResponse(t("app.api.[...slug].not_found"), { status: 404 });
}

export function DELETE(): NextResponse {
  return new NextResponse(t("app.api.[...slug].not_found"), { status: 404 });
}

export function PATCH(): NextResponse {
  return new NextResponse(t("app.api.[...slug].not_found"), { status: 404 });
}

export function OPTIONS(): NextResponse {
  return new NextResponse(t("app.api.[...slug].not_found"), { status: 404 });
}
