import type { NextRequest, NextResponse } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

/**
 * API handler return type
 * Supports both standard JSON responses (NextResponse) and streaming responses (Response)
 */
export type NextHandlerReturnType<TResponseOutput, TUrlVariablesInput> = (
  request: NextRequest,
  {
    params,
  }: { params: Promise<TUrlVariablesInput & { locale: CountryLanguage }> });
) => Promise<NextResponse<ResponseType<TResponseOutput>> | Response>;
