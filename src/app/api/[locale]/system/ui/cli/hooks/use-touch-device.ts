// CLI is keyboard-only — no touch, no hover. Return false so components
// don't apply touch-specific behavior (e.g. always-visible action buttons).
export function useTouchDevice(): boolean {
  return false;
}
