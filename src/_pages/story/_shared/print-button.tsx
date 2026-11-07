"use client";

import { Button } from "next-vibe/ui/components/button";
import { Printer } from "next-vibe/ui/components/icons/Printer";
import { triggerPrint } from "next-vibe/ui/lib/dom";
import type { JSX } from "react";

const handlePrint = (): void => {
  triggerPrint();
};

/** Small outline print action for legal documents; hidden in print output. */
export function PrintButton({
  label,
  ariaLabel,
}: {
  label: string;
  ariaLabel: string;
}): JSX.Element {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      aria-label={ariaLabel}
      className="h-11 gap-2 bg-card px-4 sm:h-9 print:hidden"
    >
      <Printer className="h-4 w-4" />
      {label}
    </Button>
  );
}
