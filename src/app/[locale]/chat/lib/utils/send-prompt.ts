import type { RefObject } from "react";

/**
 * Utility function to fill input with a suggested prompt
 * ONLY sets the input value - does NOT submit the form
 * User can review/edit the prompt before sending
 */
export function fillInputWithPrompt(
  prompt: string,
  setInput: (value: string) => void,
  inputRef: RefObject<HTMLTextAreaElement | null>,
): void {
  setInput(prompt);

  // Focus the input so user can immediately edit if needed
  setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end of text
      const length = prompt.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, 0);
}
