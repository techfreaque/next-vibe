/**
 * Call Mode Hook
 * Manages call mode state per model+character combination
 */

import { useCallback } from "react";

import { useVoiceModeStore } from "@/app/api/[locale]/agent/chat/voice-mode/store";
import { getCallModeKey } from "@/app/api/[locale]/agent/chat/voice-mode/types";

interface UseCallModeOptions {
  /** Current model ID */
  modelId: string;
  /** Current character ID */
  characterId: string;
}

export interface UseCallModeReturn {
  /** Whether call mode is enabled for current model+character */
  isCallMode: boolean;
  /** Toggle call mode for current model+character */
  toggleCallMode: () => void;
  /** Set call mode to specific value */
  setCallMode: (enabled: boolean) => void;
}

/**
 * Hook for managing call mode state
 * Call mode is stored per model+character combination
 */
export function useCallMode({
  modelId,
  characterId,
}: UseCallModeOptions): UseCallModeReturn {
  const callModeKey = getCallModeKey(modelId, characterId);
  const isCallMode = useVoiceModeStore(
    (s) => s.settings.callModeByConfig?.[callModeKey] ?? false,
  );
  const setCallModeStore = useVoiceModeStore((s) => s.setCallMode);

  const toggleCallMode = useCallback((): void => {
    setCallModeStore(modelId, characterId, !isCallMode);
  }, [setCallModeStore, modelId, characterId, isCallMode]);

  const setCallMode = useCallback(
    (enabled: boolean): void => {
      setCallModeStore(modelId, characterId, enabled);
    },
    [setCallModeStore, modelId, characterId],
  );

  return {
    isCallMode,
    toggleCallMode,
    setCallMode,
  };
}
