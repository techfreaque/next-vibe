export const translations = {
  errors: {
    configNotLoaded: "Config has not been loaded yet. Call loadConfig first.",
    configFileNotFound: "Config file not found: {{path}}",
    configFileNotFoundInParents:
      "Config file {{filename}} not found in current or parent directories",
    invalidConfigFormat:
      "Invalid config format. Ensure the config exports a default object with a 'packages' object. Check the docs for more info.",
    errorLoadingConfig: "Error loading config:",
  },
  logs: {
    creatingTmpDir: "creating tmp dir {{dir}}",
    usingConfigFile: "Using config file: {{path}}",
    rootDirectorySet: "Root directory set to: {{dir}}",
  },
};
