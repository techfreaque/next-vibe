import type { JSX } from "react";

import { coreClientEnv as envClient } from "../../../../core/env-client";

/**
 * Tay Logo for Web
 */

export function TayLogo({ className }: { className?: string }): JSX.Element {
  return (
    // oxlint-disable-next-line nextjs/no-img-element, i18n/no-literal-string
    <img
      src={`${envClient.NEXT_PUBLIC_APP_URL}/images/providers/tay.webp`}
      // oxlint-disable-next-line i18n/no-literal-string
      alt="Tay"
      className={className}
    />
  );
}
