/**
 * ESLint Plugin Type Declarations
 * These types are used by the lint package's local tsconfig
 * The main project uses types from the /types directory
 */

import type { ESLint } from "eslint";

declare module "eslint-plugin-node" {
  const plugin: ESLint.Plugin;
  export = plugin;
}

declare module "eslint-plugin-jsx-a11y" {
  const plugin: ESLint.Plugin;
  export = plugin;
}

declare module "eslint-plugin-promise" {
  const plugin: ESLint.Plugin;
  export = plugin;
}

declare module "@c-ehrlich/eslint-plugin-use-server" {
  const plugin: ESLint.Plugin;
  export = plugin;
}
