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
        // eslint-disable-next-line i18next/no-literal-string
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
