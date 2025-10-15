/**
 * Type extensions for Node.js internal APIs
 */

declare global {
  /**
   * Global garbage collection function (available when running with --expose-gc)
   */

  var gc: (() => void) | undefined;

  namespace NodeJS {
    interface Process {
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

export {};
