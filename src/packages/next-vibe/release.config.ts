import type { ReleaseConfig } from "release-tool";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      test: false,
      lint: false,
      typecheck: false,
      build: true,
      release: {
        tagPrefix: "next-vibe_",
      },
    },
  ],
};
export default releaseConfig;
