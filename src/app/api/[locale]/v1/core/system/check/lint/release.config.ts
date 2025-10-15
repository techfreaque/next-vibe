import type { ReleaseConfig } from "release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      lint: true,
      typecheck: true,
      build: true,
      test: false,
      release: {
        // eslint-disable-next-line i18next/no-literal-string
        tagPrefix: "lint_",
      },
    },
  ],
};
export default releaseConfig;
