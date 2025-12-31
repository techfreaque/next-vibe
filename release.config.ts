/**
 * Release Configuration for next-vibe
 *
 * This configuration file defines how releases are managed for the next-vibe project.
 * It supports both local development releases and CI/CD automated releases.
 *
 * Usage:
 *   Local release:  vibe release
 *   CI release:     vibe release --ci
 *   Force update:   vibe release --force-update
 *   Dry run:        vibe release --dry-run
 *   Prerelease:     vibe release --versionIncrement prerelease --prereleaseId alpha
 */

import type { ReleaseFileConfig } from "./src/app/api/[locale]/system/release-tool/definition";

const releaseConfig: ReleaseFileConfig = {
  // Package manager to use for dependency operations
  packageManager: "bun",

  // Global version for synchronized releases (optional)
  // When set, all packages will use this version
  globalVersion: "1.0.28",

  // Branch configuration
  branch: {
    main: "vibe-check",
    develop: "dev",
    allowNonMain: true,
  },

  // Continue processing other packages if one fails
  continueOnError: false,

  // Package configurations
  packages: [
    // Main next-vibe package
    {
      directory: "./",
      updateDeps: true,
      clean: false,
      lint: false, // linter runs with typecheck
      // typecheck: "bun run vibe check",
      typecheck: false,
      build: true,
      test: false,
      snyk: false, // Enable when Snyk is configured
      release: {
        tagPrefix: "vibe-check-v",

        // Git operations configuration
        git: {
          skipPush: false,
          skipTag: false,
          // eslint-disable-next-line no-template-curly-in-string -- Intentional template for semantic-release
          commitMessage: "chore(release): ${version}",
          remote: "origin",
        },

        // NPM publishing with provenance support
        npm: {
          enabled: true,
          access: "public",
          provenance: true, // Enable provenance attestation in CI
        },

        // CI release command (alternative to npm config)
        ciReleaseCommand: {
          command: ["npm", "publish", "--access", "public"],
          env: {
            NPM_TOKEN: "NPM_TOKEN",
          },
        },

        // Changelog generation
        changelog: {
          enabled: false,
          file: "CHANGELOG.md",
          preset: "conventional-commits",
        },

        // GitHub/GitLab release
        gitRelease: {
          enabled: false,
          generateNotes: true,
          draft: false,
        },

        // Version bumper for additional files
        versionBumper: [
          {
            filePath:
              "./src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts",
            varName: "CLI_VERSION",
          },
        ],

        // Folders to zip for release assets
        foldersToZip: [],
      },
    },
  ],
};

export default releaseConfig;
