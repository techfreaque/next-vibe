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
  locale,
}: ImportStatusAlertProps): React.JSX.Element | null {
  // TODO: Implement import status monitoring
  return null;
}
