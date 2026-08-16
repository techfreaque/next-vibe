/**
 * Shared types for lead magnet providers
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";

import type { LeadMagnetT } from "../i18n";

export interface LeadData {
  firstName: string;
  email: string;
  listId?: string;
}

export type ForwardLeadFn = (
  credentials: Record<string, string>,
  lead: LeadData,
  t: LeadMagnetT,
  locale: CountryLanguage,
) => Promise<ResponseType<void>>;
