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
};
