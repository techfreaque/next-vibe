import type { BuildConfig } from "builder";

const buildConfig: BuildConfig = {
  foldersToClean: [".dist"],
  filesToCompile: [
    {
      options: {
        input: "src/scripts/launchpad.ts",
        output: ".dist/launchpad",
        type: "vanilla",
        packageConfig: {
          dtsEntryRoot: "src",
          dtsInclude: ["src/**/*"],
          isPackage: true,
        },
        modulesToExternalize: [
          "inquirer",
          "chalk",
          "vite",
          "simple-git",
          "spawn",
        ],
      },
    },
    {
      options: {
        input: "src/scripts/update-all.ts",
        output: ".dist/index",
        type: "vanilla",
        packageConfig: {
          dtsEntryRoot: "src",
          dtsInclude: ["src/**/*"],
          isPackage: true,
        },
        modulesToExternalize: [
          "inquirer",
          "chalk",
          "vite",
          "simple-git",
          "spawn",
        ],
      },
    },
  ],
};

export default buildConfig;
