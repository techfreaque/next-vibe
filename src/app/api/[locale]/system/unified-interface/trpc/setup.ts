/**
 * tRPC Setup
 * Initializes tRPC with context and creates router builder
 */

import { initTRPC } from "@trpc/server";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../shared/logger/endpoint";

/**
 * tRPC Context - minimal context passed to all procedures
 */
export interface TRPCContext<TUrlParams> {
  locale: CountryLanguage;
  t: TFunction;
  request: NextRequest;
  urlPathParams: TUrlParams;
  logger: EndpointLogger;
}

/**
 * Create tRPC context from Next.js request
 */
export async function createTRPCContext<TUrlParams>(opts: {
  req: NextRequest;
  urlPathParams?: TUrlParams;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): Promise<TRPCContext<TUrlParams>> {
  const { req, urlPathParams = {} as TUrlParams, logger, locale } = opts;
  const { t } = simpleT(locale);

  return {
    locale,
    t,
    request: req,
    urlPathParams,
    logger,
  };
}

/**
 * Initialize tRPC
 */
const t = initTRPC.context<TRPCContext<Record<string, string>>>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.format() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
