import { Img } from "@react-email/img";
import type { JSX } from "react";

import { EMAIL_LOGO_SRC } from "../email-logo";

export function EmailLogo({ alt }: { alt: string }): JSX.Element {
  return (
    <Img
      src={EMAIL_LOGO_SRC}
      alt={alt}
      width="28"
      height="28"
      fetchPriority="low"
    />
  );
}
