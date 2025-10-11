import type { ReleaseConfig } from "release-tool/types";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      lint: true,
      typecheck: true,
      build: true,
      test: true,
      release: {
        tagPrefix: "builder_",
        foldersToScanAndBumpThisPackage: [
          // scan whole dev env
          { folder: "../../" },
        ],
      },
    },
  ],
};
export default releaseConfig;
