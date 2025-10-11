/**
 * Auto-generated CLI Routes Index
 * Generated from route files with CLI exports
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

import cliRoute0 from "../../../../app/api/[locale]/v1/core/system/check/lint/route";
import cliRoute1 from "../../../../app/api/[locale]/v1/core/system/check/test/route";
import cliRoute2 from "../../../../app/api/[locale]/v1/core/system/check/typecheck/route";
import cliRoute3 from "../../../../app/api/[locale]/v1/core/system/check/vibe-check/route";
import cliRoute4 from "../../../../app/api/[locale]/v1/core/system/db/migrate/route";
import cliRoute5 from "../../../../app/api/[locale]/v1/core/system/db/ping/route";
import cliRoute6 from "../../../../app/api/[locale]/v1/core/system/db/seed/route";
import cliRoute7 from "../../../../app/api/[locale]/v1/core/system/generators/endpoints/route";
import cliRoute8 from "../../../../app/api/[locale]/v1/core/system/generators/generate-all/route";
import cliRoute9 from "../../../../app/api/[locale]/v1/core/system/generators/generate-routes/route";
import cliRoute10 from "../../../../app/api/[locale]/v1/core/system/generators/generate-trpc-router/route";
import cliRoute11 from "../../../../app/api/[locale]/v1/core/system/generators/seeds/route";
import cliRoute12 from "../../../../app/api/[locale]/v1/core/system/generators/task-index/route";
import cliRoute13 from "../../../../app/api/[locale]/v1/core/system/server/build/route";
import cliRoute14 from "../../../../app/api/[locale]/v1/core/system/server/start/route";
import cliRoute15 from "../../../../app/api/[locale]/v1/core/system/server/start-next-server/route";

/**
 * CLI Route information
 */
export interface CLIRouteMetadata {
  path?: string;
  alias?: string;
  description: string;
  methods: string[];
  handler: Record<
    string,
    (
      data: unknown,
      urlVariables: unknown,
      user: unknown,
      locale?: string,
    ) => Promise<unknown>
  >;
}

/**
 * Route aliases for easy CLI access
 */
export const CLI_ROUTE_ALIASES: Record<string, CLIRouteMetadata> = {};

/**
 * All available CLI routes by path
 */
export const CLI_ROUTES: Record<string, CLIRouteMetadata> = {
  "v1/core/system/check/lint": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute0.tools?.cli ||
      (cliRoute0.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/check/test": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute1.tools?.cli ||
      (cliRoute1.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/check/typecheck": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute2.tools?.cli ||
      (cliRoute2.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/check/vibe-check": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute3.tools?.cli ||
      (cliRoute3.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/db/migrate": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute4.tools?.cli ||
      (cliRoute4.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/db/ping": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute5.tools?.cli ||
      (cliRoute5.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/db/seed": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute6.tools?.cli ||
      (cliRoute6.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/generators/endpoints": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute7.tools?.cli ||
      (cliRoute7.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/generators/generate-all": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute8.tools?.cli ||
      (cliRoute8.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/generators/generate-routes": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute9.tools?.cli ||
      (cliRoute9.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/generators/generate-trpc-router": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute10.tools?.cli ||
      (cliRoute10.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/generators/seeds": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute11.tools?.cli ||
      (cliRoute11.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/generators/task-index": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute12.tools?.cli ||
      (cliRoute12.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/server/build": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute13.tools?.cli ||
      (cliRoute13.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/server/start": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute14.tools?.cli ||
      (cliRoute14.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
  "v1/core/system/server/start-next-server": {
    alias: undefined,
    description: "No description available",
    methods: ["POST"],
    handler:
      cliRoute15.tools?.cli ||
      (cliRoute15.cli as Record<
        string,
        (
          data: unknown,
          urlVariables: unknown,
          user: unknown,
          locale?: string,
        ) => Promise<unknown>
      >),
  },
};

/**
 * Get all available CLI route aliases
 */
export function getAllCLIAliases(): string[] {
  return Object.keys(CLI_ROUTE_ALIASES);
}

/**
 * Get CLI route by alias
 */
export function getCLIRouteByAlias(
  alias: string,
): CLIRouteMetadata | undefined {
  return CLI_ROUTE_ALIASES[alias];
}

/**
 * Get CLI route by path
 */
export function getCLIRouteByPath(path: string): CLIRouteMetadata | undefined {
  return CLI_ROUTES[path];
}

/**
 * Get all CLI routes
 */
export function getAllCLIRoutes(): Record<string, CLIRouteMetadata> {
  return CLI_ROUTES;
}
