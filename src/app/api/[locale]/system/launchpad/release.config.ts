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
        // eslint-disable-next-line i18next/no-literal-string
        tagPrefix: "launchpad_",
      },
    },
  ],
};
export default releaseConfig;
