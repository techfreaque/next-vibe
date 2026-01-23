import type { JSX } from "react";

import { envClient } from "@/config/env-client";

/**
 * Uncensored AI Logo for Web
 */

export function UncensoredAILogo({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    // oxlint-disable-next-line nextjs/no-img-element
    <img
      src={`${envClient.NEXT_PUBLIC_APP_URL}/images/providers/uncensored.ai.png`}
      alt="Uncensored AI"
      className={className}
    />
  );
}
