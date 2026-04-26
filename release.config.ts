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
 *
 * Deployment:
 *   After a successful release on main, the postPublish hook deploys to the VPS
 *   via SSH. Required GitHub Actions secrets:
 *     - VPS_HOST:     Server IP or hostname
 *     - VPS_USER:     SSH username (e.g. "root" or a deploy user)
 *     - VPS_SSH_KEY:  Private SSH key for passwordless login
 *     - VPS_APP_DIR:  App directory on VPS (e.g. "/root/next-vibe")
 */

import type { ReleaseFileConfig } from "./src/app/api/[locale]/system/release-tool/definition";

const releaseConfig: ReleaseFileConfig = {
  // Package manager to use for dependency operations
  packageManager: "bun",

  // Global version for synchronized releases (optional)
  // When set, all packages will use this version
  globalVersion: "3.3.0",

  // Branch configuration
  branch: {
    main: "main",
    develop: "dev",
    allowNonMain: false,
  },

  // Continue processing other packages if one fails
  continueOnError: false,

  // Package configurations
  packages: [
    // Main next-vibe package - runs first so its build (which cleans .dist/) runs before checker
    {
      directory: "./",
      updateDeps: true,
      clean: false,
      lint: false, // linter runs with typecheck
      typecheck: "vibe check",
      build: true,
      // test: "vibe test",
      test: false,
      snyk: false, // Enable when Snyk is configured
      release: {
        tagPrefix: "v",

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
              "./src/app/api/[locale]/system/unified-interface/cli/run-cli.ts",
            varName: "CLI_VERSION",
          },
        ],

        // Folders to zip for release assets
        foldersToZip: [],
      },

      // Deploy to VPS after successful publish (CI only)
      // SSHs into the VPS and runs the existing install-docker.sh deploy script.
      // Required GitHub Actions secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_APP_DIR
      // Skips gracefully when not in CI (local `vibe pub` won't have the env vars).
      hooks: {
        postPublish: {
          command:
            // Guard: skip deploy when VPS_HOST is not set (local release)
            'if [ -z "$VPS_HOST" ]; then echo "No VPS_HOST set - skipping deploy (local mode)"; exit 0; fi && ' +
            // Write SSH key to temp file, SSH in, run the deploy script, clean up key
            'KEY=$(mktemp) && echo "$VPS_SSH_KEY" > "$KEY" && chmod 600 "$KEY" && ' +
            'ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i "$KEY" ' +
            '"$VPS_USER@$VPS_HOST" "cd $VPS_APP_DIR && bash scripts/install-docker.sh" ; ' +
            'EXIT=$? ; rm -f "$KEY" ; exit $EXIT',
          timeout: 300000, // 5 minutes
          continueOnError: false,
        },
      },
    },

    // @next-vibe/checker - runs after main so .dist/ is already cleaned before checker builds into .dist/checker/
    {
      directory: ".dist/checker",
      updateDeps: false,
      clean: false,
      lint: false,
      typecheck: false,
      build:
        "vibe builder --configPath=src/app/api/[locale]/system/check/build.config.ts",
      test: false,
      snyk: false,
      release: {
        tagPrefix: "checker-v",
        git: {
          skipPush: false,
          skipTag: false,
          // eslint-disable-next-line no-template-curly-in-string -- Intentional template for semantic-release
          commitMessage: "chore(release): @next-vibe/checker@${version}",
          remote: "origin",
        },
        npm: {
          enabled: true,
          access: "public",
          provenance: true,
        },
        ciReleaseCommand: {
          command: ["npm", "publish", "--access", "public"],
          env: {
            NPM_TOKEN: "NPM_TOKEN",
          },
        },
        changelog: {
          enabled: false,
          file: "CHANGELOG.md",
          preset: "conventional-commits",
        },
        gitRelease: {
          enabled: false,
          generateNotes: true,
          draft: false,
        },
        versionBumper: [],
        foldersToZip: [],
      },
    },
  ],
};

export default releaseConfig;
