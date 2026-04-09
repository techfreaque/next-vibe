/**
 * Shared types for lead magnet providers
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
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
) => Promise<ResponseType<void>>;
