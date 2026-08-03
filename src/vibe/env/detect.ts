/**
 * Server-mode detection — pure argv parsing, no imports, no side effects.
 * Imported by environment.ts (before dotenv) and env.ts (for defaults).
 */

const _args = process.argv.slice(2);
const _hasLocalFlag = _args.includes("--preview") || _args.includes("--hermes");
const _isProduction = process.env["NODE_ENV"] === "production";
const _isDevCommand = ["dev", "d"].some((a) => _args.includes(a));
const _isHermesDev = _isDevCommand && _hasLocalFlag;
const _isStartCommand =
  ["start", "s", "build", "b"].some((a) => _args.includes(a)) ||
  _args.includes("rebuild");
const _isMcpCommand = _args.includes("mcp");

export const isPreviewMode =
  _hasLocalFlag || (!_isProduction && _isStartCommand);

export const isDevCommand = _isDevCommand;
export const isHermesDev = _isHermesDev;
export const isMcpCommand = _isMcpCommand;
export const isStartCommand = _isStartCommand;
export const cliArgs = _args;
