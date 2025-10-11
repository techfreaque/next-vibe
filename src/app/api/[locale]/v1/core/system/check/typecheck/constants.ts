/**
 * Constants for TypeScript type checking functionality
 */

export const TYPECHECK_PATTERNS = {
  TSC_COMMAND:
    'NODE_OPTIONS="--max-old-space-size=32768 --max-semi-space-size=1024" npx tsc ',
  TSGO_COMMAND: "npx tsgo ",
  ERROR_TS: "error TS",
  WARNING_KEYWORD: "warning",
  TS_EXTENSION: ".ts",
  TSX_EXTENSION: ".tsx",
  FULL_ERROR_PATTERN:
    /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s*(.+)$/,
  TSGO_ERROR_PATTERN:
    /^(.+?):(\d+):(\d+)\s+-\s+(error|warning)\s+(TS\d+):\s*(.+)$/,
} as const;

export const TYPECHECK_CONFIG = {
  TIMEOUT_MS: 900000, // 15 minutes
} as const;

export const TYPECHECK_MESSAGES = {
  RUNNING_COMMAND: "Running command:",
} as const;
