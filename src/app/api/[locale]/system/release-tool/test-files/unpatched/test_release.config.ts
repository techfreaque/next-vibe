/* eslint-disable i18next/no-literal-string */
import type { ReleaseConfig } from "../../src/types";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      lint: false,
      typecheck: false,
      build: false,
      test: false,
      release: false,
    },
    {
      directory: "sub-package-1",
      updateDeps: true,
      lint: false,
      typecheck: false,
      build: false,
      test: false,
      release: {
        version: "1.0.0",
        tagPrefix: "test_",
        foldersToScanAndBumpThisPackage: [{ folder: "sub-package-2" }],
      },
    },
    {
      directory: "sub-package-2",
      updateDeps: true,
      lint: false,
      typecheck: false,
      build: false,
      test: false,
      release: {
        version: "1.0.0",
        tagPrefix: "test_",
      },
    },
  ],
};

export default releaseConfig;
