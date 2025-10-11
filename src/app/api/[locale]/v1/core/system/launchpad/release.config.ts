import type { ReleaseConfig } from "release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      lint: true,
      typecheck: true,
      build: true,
      test: false,
      updateDeps: true,
      release: {
        tagPrefix: "launchpad_",
        foldersToScanAndBumpThisPackage: [
          // scan the whole dev env folder
          { folder: "../../" },
        ],
      },
    },
  ],
};
export default releaseConfig;
