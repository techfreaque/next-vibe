"use client";

import type { EmptyBlockAction } from "next-vibe/ui/components/empty-block";
import { createContext } from "react";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";

/** The authenticated tools shell supplies navigation and localized recovery actions. */
export const AdminRecordContext = createContext<{
  browse: () => void;
  browseLabel: string;
  retryLabel: string;
  accessDeniedLabel: string;
  recordBack: (endpoint: CreateApiEndpointAny) => EmptyBlockAction | undefined;
  selectLabel: string;
  openLabel: string;
  loadingLabel: string;
} | null>(null);

/** HTTP states where fetching the same authorized record again can succeed. */
export function canRetryRecordRead(status: number): boolean {
  return status >= 500 || status === 408 || status === 429;
}
