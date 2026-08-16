/**
 * Server-mode detection — pure argv parsing, no side effects.
 * Imported by environment.ts (before dotenv) and env.ts (for defaults).
 */

import {
  BUILD_ALIAS,
  BUILD_SERVER_ALIAS,
} from "../platforms/web/build/constants";
import { REBUILD_ALIAS } from "../platforms/web/rebuild/constants";
import { START_ALIASES } from "../platforms/web/start/constants";

const _args =
  typeof process !== "undefined" && Array.isArray(process.argv)
    ? process.argv.slice(2)
    : [];
const _hasLocalFlag = _args.includes("--preview") || _args.includes("--hermes");
const _isProduction = process.env["NODE_ENV"] === "production";
const _isDevCommand = ["dev", "d"].some((a) => _args.includes(a));
const _isHermesDev = _isDevCommand && _hasLocalFlag;
const _isStartCommand =
  [...START_ALIASES, BUILD_ALIAS, BUILD_SERVER_ALIAS].some((a) =>
    _args.includes(a),
  ) || _args.includes(REBUILD_ALIAS);
const _isMcpCommand = _args.includes("mcp");

export const isPreviewMode =
  _hasLocalFlag || (!_isProduction && _isStartCommand);

export const isDevCommand = _isDevCommand;
export const isHermesDev = _isHermesDev;
export const isMcpCommand = _isMcpCommand;
export const isStartCommand = _isStartCommand;
export const cliArgs = _args;
