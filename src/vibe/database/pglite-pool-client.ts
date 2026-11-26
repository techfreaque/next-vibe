import "server-only";

import { Client, type ClientConfig } from "pg";
import type { ParameterStatusMessage } from "pg-protocol/dist/messages";

export const PGLITE_OWNER_PID_PARAMETER = "vibe_pglite_owner_pid";

/** Read the host process ID during startup without issuing a database query. */
export class PglitePoolClient extends Client {
  loopbackOwnerPid: number | undefined;

  constructor(config?: string | ClientConfig) {
    super(config);
    this.connection.on(
      "parameterStatus",
      ({ parameterName, parameterValue }: ParameterStatusMessage) => {
        if (parameterName === PGLITE_OWNER_PID_PARAMETER) {
          const pid = Number(parameterValue);
          if (Number.isSafeInteger(pid) && pid > 0) {
            this.loopbackOwnerPid = pid;
          }
        }
      },
    );
  }
}
