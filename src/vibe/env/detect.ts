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
const _isStartCommand =
  [...START_ALIASES, BUILD_ALIAS, BUILD_SERVER_ALIAS].some((a) =>
    _args.includes(a),
  ) || _args.includes(REBUILD_ALIAS);
// "Hermes dev" is the Hermes *dev server* (:3002, the daily-driver + its live
// reverse-ws connectors to Thea), as opposed to Hermes *prod* (`vibe --hermes
// start/build/rebuild`, :3001). It is NOT limited to the literal `dev` command:
// a plain `--hermes` tool command (e.g. `vibe --hermes --thea ai-run`) targets
// the Hermes dev instance's DB and realtime hub, so its cross-process realtime
// (ResultSignals WS subscription for a remote tool's result) must resolve the
// :3002 hub too — otherwise a one-shot remote call subscribes to the wrong hub
// and hangs forever waiting for a result that was delivered on :3002. So:
// --hermes/--preview on anything EXCEPT a prod-server command is Hermes dev.
const _isHermesDev = _hasLocalFlag && !_isStartCommand;
const _isMcpCommand = _args.includes("mcp");

export const isPreviewMode =
  _hasLocalFlag || (!_isProduction && _isStartCommand);

export const isDevCommand = _isDevCommand;
export const isHermesDev = _isHermesDev;
export const isMcpCommand = _isMcpCommand;
export const isStartCommand = _isStartCommand;
export const cliArgs = _args;
