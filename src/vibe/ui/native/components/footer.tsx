import type { JSX } from "react";

import type { FooterProps } from "../../web/components/footer";

export function Footer({ children }: FooterProps): JSX.Element {
  return <>{children}</>;
}
