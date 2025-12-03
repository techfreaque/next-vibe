export const translations = {
  category: "Release Tool",
  config: {
    fileNotFound: "Config file not found: {{path}}",
    invalidFormat:
      "Invalid config format. Ensure the config exports a default object with a 'packages' array. Check the docs for more info.",
    errorLoading: "Error loading config",
  },
  packageJson: {
    notFound: "Package.json not found: {{path}}",
    invalidFormat: "Invalid package.json format: {{path}}",
    errorReading: "Error reading package.json",
    errorUpdatingDeps: "Error updating dependencies for {{directory}}",
    errorUpdatingVersion: "Error updating package version for {{directory}}",
  },
  scripts: {
    invalidPackageJson: "Invalid package.json format in {{path}}",
    testsFailed: "Tests failed in {{path}}",
    lintFailed: "Linting failed in {{path}}",
    typecheckFailed: "Type checking failed in {{path}}",
    buildFailed: "Build failed in {{path}}",
    packageJsonNotFound: "Package.json not found in {{path}}",
  },
  snyk: {
    cliNotFound: "Snyk CLI not found for {{packageName}}",
    testFailed: "Snyk vulnerability test failed for {{packageName}}",
    tokenRequired:
      "SNYK_TOKEN environment variable required for {{packageName}}",
    orgKeyRequired:
      "SNYK_ORG_KEY environment variable required for {{packageName}}",
    monitorFailed: "Snyk monitor failed for {{packageName}}",
  },
};
