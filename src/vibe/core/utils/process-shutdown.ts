declare global {
  var __vibeProcessManagesShutdown: boolean | undefined;
}

/** The process owner is responsible for handling termination signals and exiting. */
export function claimProcessShutdown(): void {
  globalThis.__vibeProcessManagesShutdown = true;
}

export function processManagesShutdown(): boolean {
  return globalThis.__vibeProcessManagesShutdown === true;
}
