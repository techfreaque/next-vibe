import { getCurrentPathname } from "next-vibe/ui/lib/location";

import {
  type CountryLanguage,
  CountryLanguageValues,
  defaultLocale,
} from "../core/i18n/core/config";
import { createClientLogger } from "./client";
import { reportRenderError } from "./report-render-error";

export function getPageLocale(): CountryLanguage {
  const segment = getCurrentPathname().split("/")[1] ?? "";
  return (
    Object.values(CountryLanguageValues).find((value) => value === segment) ??
    defaultLocale
  );
}

/** Loaded independently of the client entry when its module graph fails. */
export function reportDevClientEntryError(error: Error): void {
  reportRenderError({
    logger: createClientLogger(false, getPageLocale()),
    boundary: "devClientEntry",
    error,
  });
}
