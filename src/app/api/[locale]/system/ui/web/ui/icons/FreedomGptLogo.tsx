import type { JSX } from "react";

import { envClient } from "@/config/env-client";

/* *
 * FreedomGPT Logo for Web
 */

export function FreedomGptLogo({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    // oxlint-disable-next-line nextjs/no-img-element, oxlint-plugin-i18n/no-literal-string
    <img
      src={`${envClient.NEXT_PUBLIC_APP_URL}/images/providers/freedomgpt-logo.png`}
      // oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string
      alt="FreedomGPT"
      className={className}
    />
  );
}
