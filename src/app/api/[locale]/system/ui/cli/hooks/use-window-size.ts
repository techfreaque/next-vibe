import { useStdout } from "ink";

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * CLI: returns terminal columns/rows via Ink's useStdout.
 */
export function useWindowSize(): WindowSize {
  const { stdout } = useStdout();
  return {
    width: stdout.columns ?? 80,
    height: stdout.rows ?? 24,
  };
}
