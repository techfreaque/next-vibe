/**
 * Type extensions for Node.js internal APIs
 * @types/node is already installed, so we only extend what's needed
 */

declare global {
  /**
   * Global garbage collection function (available when running with --expose-gc)
   */

  var gc: (() => void) | undefined;

  /**
   * Global process object
   */
  var process: NodeJS.Process;

  /**
   * Error constructor extensions
   */
  interface ErrorConstructor {
    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unsafe-function-type
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }

    interface Process {
      /**
       * Current working directory
       */
      cwd: () => string;

      /**
       * Exit the process
       */
      exit: (code?: number) => never;

      /**
       * Environment variables
       */
      env: ProcessEnv;

      /**
       * Register event listeners
       */
      on: (
        event: string,
        listener: (...args: string[] | number[] | boolean[]) => void,
      ) => this;

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

declare module "node:fs" {
  export * from "fs";
}

declare module "node:path" {
  export * from "path";
}

declare module "node:crypto" {
  export * from "crypto";
}


