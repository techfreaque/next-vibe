import type { JSX } from "react";
import { Image } from "react-native";

import { envClient } from "@/config/env-client";

/**
 * Uncensored AI Logo for React Native
 */

export function UncensoredAILogo({
  width = 48,
  height = 48,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}): JSX.Element {
  // className is accepted for compatibility but not used in React Native
  void className;

  return (
    <Image
      source={{
        uri: `${envClient.NEXT_PUBLIC_APP_URL}/images/providers/uncensored.ai.png`,
      }}
      style={{ width, height }}
      // oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Non-translatable string
      accessibilityLabel="Uncensored AI"
    />
  );
}
