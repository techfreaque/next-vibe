interface EslintPlugin {
  rules: Record<string, unknown>;
  configs?: Record<string, unknown>;
  processors?: Record<string, unknown>;
}

declare module "eslint-plugin-node" {
  const plugin: EslintPlugin;
  export default plugin;
}

declare module "eslint-plugin-jsx-a11y" {
  const plugin: EslintPlugin;
  export default plugin;
}

declare module "eslint-plugin-promise" {
  const plugin: EslintPlugin;
  export default plugin;
}

declare module "@c-ehrlich/eslint-plugin-use-server" {
  const plugin: EslintPlugin;
  export default plugin;
}
