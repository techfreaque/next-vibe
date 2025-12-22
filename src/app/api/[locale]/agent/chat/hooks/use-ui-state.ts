/**
 * UI State Hook
 * Manages UI-specific state like modals, dialogs, etc.
 */

import { useCallback, useState } from "react";

export interface UseUIStateReturn {
  // Tools Modal
  isToolsModalOpen: boolean;
  openToolsModal: () => void;
  closeToolsModal: () => void;
  setToolsModalOpen: (open: boolean) => void;
}

export function useUIState(): UseUIStateReturn {
  const [isToolsModalOpen, setToolsModalOpen] = useState(false);

  const openToolsModal = useCallback(() => {
    setToolsModalOpen(true);
  }, []);

  const closeToolsModal = useCallback(() => {
    setToolsModalOpen(false);
  }, []);

  return {
    isToolsModalOpen,
    openToolsModal,
    closeToolsModal,
    setToolsModalOpen,
  };
}
