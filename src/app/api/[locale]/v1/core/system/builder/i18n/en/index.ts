export const translations = {
  category: "Builder",
  description: "Build and bundle tool for the project",
  cli: {
    build: {
      description: "Build type: build",
      configOption: "specify the config file path",
      defaultConfig: "build.config.ts",
    },
  },
  errors: {
    inputFileNotFound: "Input file {{filePath}} does not exist",
    invalidOutputFileName: "Output file name is invalid",
    invalidBuildConfig:
      "Invalid build config format. Ensure the config exports a default BuildConfig object.",
  },
};
