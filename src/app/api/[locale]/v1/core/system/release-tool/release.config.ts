import type { ReleaseConfig } from "./src/types/index.js";

const releaseConfig: ReleaseConfig = {
  packages: [
    {
      directory: "./",
      updateDeps: true,
      lint: true,
      typecheck: true,
      build: true,
      test: true,
      snyk: true,
      release: {
        tagPrefix: "release-tool_",
        ciReleaseCommand: {
          command: ["npm", "publish", "--access", "public"],
          env: {
            NPM_TOKEN: "NPM_TOKEN", // Maps to process.env.NPM_TOKEN
          },
        },
      },
    },
  ],
};
export default releaseConfig;
