import { Img } from "@react-email/img";
import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import type { JSX } from "react";

interface EmailImageProps {
  src: string; // Relative path like "/images/unbottled-icon.png"
  alt: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function EmailImage({
  src,
  alt,
  width,
  height,
  style,
}: EmailImageProps): JSX.Element {
  // Serving the image separately keeps its bytes out of the email HTML.
  const imageSrc = new URL(src, envClient.NEXT_PUBLIC_APP_URL).href;

  return (
    <Img src={imageSrc} alt={alt} width={width} height={height} style={style} />
  );
}
