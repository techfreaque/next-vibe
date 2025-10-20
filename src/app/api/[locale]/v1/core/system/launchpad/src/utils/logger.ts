import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

// Create a logger instance for launchpad CLI operations
const endpointLogger = createEndpointLogger(true, Date.now(), "en-GLOBAL");

export function logger(message: string): void {
  endpointLogger.info(`[PWE-Launchpad] ${message}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loggerError(message: string, error: any): void {
  endpointLogger.error(`[PWE-Launchpad] ${message}`, error);
}
