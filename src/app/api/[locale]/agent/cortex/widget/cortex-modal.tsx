"use client";

import { Dialog } from "next-vibe-ui/ui/dialog";
import type { JSX } from "react";
import { lazy, Suspense } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { useCortexModalStore } from "./store";

const CortexModalContent = lazy(() =>
  import("./cortex-modal-content").then((mod) => ({
    default: mod.CortexModalContent,
  })),
);

interface CortexModalProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * Cortex Modal (Lazy-loaded wrapper)
 * Displays the cortex browser for quick access from chat.
 */
export function CortexModal({ locale, user }: CortexModalProps): JSX.Element {
  const open = useCortexModalStore((state) => state.isOpen);
  const setOpen = useCortexModalStore((state) => state.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && (
        <Suspense fallback={null}>
          <CortexModalContent locale={locale} user={user} />
        </Suspense>
      )}
    </Dialog>
  );
}
