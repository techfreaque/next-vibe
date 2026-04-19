import type { JSX } from "react";

import { type IconComponent } from "../../lib/helper";

/** Tribe (tribe.so / Bettermode) — stylised "T" mark */
export const SiTribe: IconComponent = ({
  className,
}: {
  className?: string;
}): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    width="24"
    height="24"
  >
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 5h7a1 1 0 110 2h-2.25v7.5a1.25 1.25 0 11-2.5 0V9H8.5a1 1 0 110-2z"
    />
  </svg>
);
