import { useEffect, useState } from "react";

import type { DivRefObject } from "next-vibe-ui/ui/div";
import { envClient } from "@/config/env-client";

import { LAYOUT } from "@/app/[locale]/chat/lib/config/constants";

/**
 * Hook to dynamically measure input container height using ResizeObserver.
 * This is used to calculate proper spacing for the messages area.
 *
 * @param inputContainerRef - Ref to the input container element
 * @returns Current height of the input container
 */
export function useInputHeight(
  inputContainerRef: React.RefObject<DivRefObject | null>,
): number {
  const [inputHeight, setInputHeight] = useState<number>(
    LAYOUT.DEFAULT_INPUT_HEIGHT,
  );

  useEffect(() => {
    if (envClient.platform.isReactNative) {
      // TODO: Handle dynamic input height on native
      return;
    }
    if (!inputContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInputHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(inputContainerRef.current);

    return (): void => {
      resizeObserver.disconnect();
    };
  }, [inputContainerRef]);

  return inputHeight;
}
