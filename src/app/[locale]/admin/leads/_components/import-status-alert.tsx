/**
 * Import Status Alert Component
 * Shows active import jobs status across all admin leads pages
 * Simplified version without hooks until import functionality is fully implemented
 */

"use client";

import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface ImportStatusAlertProps {
  locale: CountryLanguage;
}

export function ImportStatusAlert({
  locale: _locale, // eslint-disable-line @typescript-eslint/no-unused-vars -- Will be used when import functionality is implemented
}: ImportStatusAlertProps): React.JSX.Element | null {
  // TODO: Implement import status monitoring when import hooks are available
  // For now, return null to avoid TypeScript errors
  return null;
}
