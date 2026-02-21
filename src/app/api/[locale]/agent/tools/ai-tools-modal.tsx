"use client";

import { Dialog } from "next-vibe-ui/ui/dialog";
import type { JSX } from "react";
import { lazy, Suspense } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { useToolsModalStore } from "./store";

// Lazy load the modal content
const AIToolsModalContent = lazy(() =>
  import("./ai-tools-modal-content").then((mod) => ({
    default: mod.AIToolsModalContent,
  })),
);

interface AIToolsModalProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * AI Tools Modal (Lazy-loaded wrapper)
 * Displays all available AI tools and allows user to toggle them on/off
 */
export function AIToolsModal({ locale, user }: AIToolsModalProps): JSX.Element {
  const open = useToolsModalStore((state) => state.isOpen);
  const setOpen = useToolsModalStore((state) => state.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && (
        <Suspense fallback={null}>
          <AIToolsModalContent locale={locale} user={user} />
        </Suspense>
      )}
    </Dialog>
  );
}
