/**
 * Call Mode Hook
 * Manages call mode state per model+persona combination
 */

import { useCallback } from "react";

import { useVoiceModeStore } from "@/app/api/[locale]/agent/chat/voice-mode/store";
import { getCallModeKey } from "@/app/api/[locale]/agent/chat/voice-mode/types";

interface UseCallModeOptions {
  /** Current model ID */
  modelId: string;
  /** Current persona ID */
  personaId: string;
}

export interface UseCallModeReturn {
  /** Whether call mode is enabled for current model+persona */
  isCallMode: boolean;
  /** Toggle call mode for current model+persona */
  toggleCallMode: () => void;
  /** Set call mode to specific value */
  setCallMode: (enabled: boolean) => void;
}

/**
 * Hook for managing call mode state
 * Call mode is stored per model+persona combination
 */
export function useCallMode({
  modelId,
  personaId,
}: UseCallModeOptions): UseCallModeReturn {
  const callModeKey = getCallModeKey(modelId, personaId);
  const isCallMode = useVoiceModeStore(
    (s) => s.settings.callModeByConfig?.[callModeKey] ?? false,
  );
  const setCallModeStore = useVoiceModeStore((s) => s.setCallMode);

  const toggleCallMode = useCallback((): void => {
    setCallModeStore(modelId, personaId, !isCallMode);
  }, [setCallModeStore, modelId, personaId, isCallMode]);

  const setCallMode = useCallback(
    (enabled: boolean): void => {
      setCallModeStore(modelId, personaId, enabled);
    },
    [setCallModeStore, modelId, personaId],
  );

  return {
    isCallMode,
    toggleCallMode,
    setCallMode,
  };
}
