/**
 * Image Push / Deploy Environment
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "../../env/define-env";

export const {
  env: imagePushEnv,
  schema: imagePushEnvSchema,
  examples: imagePushEnvExamples,
} = defineEnv({
  DOCKER_IMAGE_NAME: {
    schema: z.string().default("ghcr.io/techfreaque/next-vibe-app"),
    example: "ghcr.io/techfreaque/next-vibe-app",
    comment:
      "Registry + image name the prod Docker image is built and pushed to (see: vibe image-push). install-docker.sh pulls this same image on the deploy server instead of building it there.",
    commented: true,
  },
  SSH_SERVER: {
    schema: z.string().optional(),
    example: "root@203.0.113.5",
    comment:
      "Default SSH target for `vibe image-push` when --sshTarget isn't passed explicitly. Format: user@host or user@host:port.",
    commented: true,
  },
  SSH_SERVER_PWD: {
    schema: z.string().optional(),
    example: "REPLACE_WITH_your_ssh_password",
    comment:
      "Password for SSH_SERVER (or an explicit --sshTarget). If unset, `vibe image-push` falls back to the system ssh client (key/agent auth). Only used for the image transfer - never logged.",
    commented: true,
    sensitive: true,
  },
  SSH_SERVER2: {
    schema: z.string().optional(),
    example: "root@203.0.113.6",
    comment:
      "Second HA node. When set, `vibe image-push` rolls it AFTER SSH_SERVER is live and healthy (image under SSH_SERVER2_IMAGE_TAG, Server 1's .env synced, recreate, health-check, auto-rollback). Skipped with --secondary=false or an explicit --sshTarget.",
    commented: true,
  },
  SSH_SERVER2_PWD: {
    schema: z.string().optional(),
    example: "REPLACE_WITH_your_ssh_password",
    comment:
      "Password for SSH_SERVER2. If unset, the system ssh client's key/agent auth is used. Never logged.",
    commented: true,
    sensitive: true,
  },
  SSH_SERVER2_IMAGE_TAG: {
    schema: z.string().default("unbottled"),
    example: "unbottled",
    comment:
      "Tag the app image gets on SSH_SERVER2. Never `latest`: Server 2 co-hosts another site that runs :latest. The previous image moves to :<tag>-rollback.",
    commented: true,
  },
  SSH_SERVER2_DEPLOY_SCRIPT: {
    schema: z.string().default("/root/unbottled/scripts/deploy-ha-node.sh"),
    example: "/root/unbottled/scripts/deploy-ha-node.sh",
    comment:
      "Script run on SSH_SERVER2 after the image is loaded (synced from the deployed commit first). Set to empty string to transfer only.",
    commented: true,
  },
  SSH_SERVER2_RELAY_ADDR: {
    schema: z.string().default("10.88.0.2:7799"),
    example: "10.88.0.2:7799",
    comment:
      "Private (WireGuard) host:port on SSH_SERVER2 for the box-to-box image relay from SSH_SERVER. Empty = upload to SSH_SERVER2 from this machine instead (much slower).",
    commented: true,
  },
  SSH_SERVER_ENV_PATH: {
    schema: z.string().default("/unbottled/.env"),
    example: "/unbottled/.env",
    comment:
      "Path of the prod .env on SSH_SERVER. image-push copies it to SSH_SERVER2 (server to server through this process, never written locally or logged) so both nodes share identity and keys.",
    commented: true,
  },
  SSH_DEPLOY_SCRIPT: {
    schema: z.string().default("/unbottled/scripts/install-docker.sh"),
    example: "/unbottled/scripts/install-docker.sh",
    comment:
      "Script to run on SSH_SERVER after a successful image push to trigger the deploy (docker compose pull + up). Set to empty string to skip.",
    commented: true,
  },
});
