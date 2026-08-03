/**
 * Image Push / Deploy Environment
 */

import "server-only";

import { defineEnv } from "../../env/define-env";
import { z } from "zod";

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
});
