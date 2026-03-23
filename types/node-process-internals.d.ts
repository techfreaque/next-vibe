/**
 * Type augmentation for Node.js internal process APIs
 * These are undocumented internal APIs used for debugging and resource monitoring
 */

import "@types/node";

declare global {
  namespace NodeJS {
    interface Process {
      /**
       * Path to the resources directory - only defined when running inside
       * a packaged Electron app (electron-builder sets this at runtime).
       * @see https://www.electronjs.org/docs/latest/api/process#processresourcespath-readonly
       */
      resourcesPath?: string;
      /**
       * Internal Node.js API to get active handles
       * @internal
       */
      _getActiveHandles?: () => Array<{
        constructor: { name: string };
        close?: () => void;
        destroy?: () => void;
        end?: () => void;
      }>;

      /**
       * Internal Node.js API to get active requests
       * @internal
       */
      _getActiveRequests?: () => Array<Record<string, string | number>>;
    }
  }
}
