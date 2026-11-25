"use client";

import { useSilentHistory } from "next-vibe/ui/hooks/use-navigation";
import {
  getCurrentPathname,
  getCurrentSearch,
} from "next-vibe/ui/lib/location";
import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";

import { scopedTranslation } from "./i18n";

export function useDocumentListCopy(): ReturnType<
  typeof scopedTranslation.scopedT
>["t"] {
  return scopedTranslation.scopedT(useWidgetLocale()).t;
}

export function useDocumentListHistory(
  alias: string,
): (params: Record<string, string | number | undefined>) => void {
  const history = useSilentHistory();
  return (params): void => {
    const pathname = getCurrentPathname();
    if (!pathname.endsWith(`/tools/${alias}`)) {
      return;
    }
    const search = new URLSearchParams(getCurrentSearch());
    for (const [field, value] of Object.entries(params)) {
      search.delete(field);
      search.delete(`arg.${field}`);
      if (value !== undefined) {
        search.set(`arg.${field}`, String(value));
      }
    }
    history.replaceState(`${pathname}?${search.toString()}`);
  };
}
