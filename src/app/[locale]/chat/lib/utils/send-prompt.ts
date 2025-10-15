import type { RefObject } from "react";

import { TIMING } from "../config/constants";

/**
 * Utility function to send a suggested prompt
 * Sets the input value and triggers form submission
 */
export function sendSuggestedPrompt(
  prompt: string,
  setInput: (value: string) => void,
  inputRef: RefObject<HTMLTextAreaElement | null>,
): void {
  setInput(prompt);

  // Trigger send after a short delay to allow state to update
  setTimeout(() => {
    if (inputRef.current) {
      const form = inputRef.current.form;
      if (form) {
        form.requestSubmit();
      }
    }
  }, TIMING.SUGGESTED_PROMPT_SUBMIT_DELAY);
}
