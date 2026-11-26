import "server-only";

import { createPrivateKey } from "node:crypto";
import { readFileSync, statSync } from "node:fs";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

export const {
  env: bankConnectionEnv,
  schema: bankConnectionEnvSchema,
  examples: bankConnectionEnvExamples,
} = defineEnv({
  ENABLE_BANKING_APP_ID: {
    schema: z.string().trim().min(1).optional(),
    commented: true,
    example: "",
    comment:
      "Enable Banking application identifier for read-only account information.",
  },
  ENABLE_BANKING_PRIVATE_KEY: {
    schema: z.string().trim().min(1).optional(),
    commented: true,
    example: "",
    comment:
      "Private RSA signing key, encoded as one-line base64 PEM or inline PEM.",
  },
  ENABLE_BANKING_PRIVATE_KEY_FILE: {
    schema: z.string().trim().min(1).optional(),
    commented: true,
    example: "",
    comment:
      "Optional local path to an Enable Banking RSA PEM file when an inline key is unavailable.",
  },
  ENABLE_BANKING_DAILY_SYNC: {
    schema: z.enum(["true", "false"]).optional().default("false"),
    example: "false",
    comment:
      "Opt in to the daily production pull that saves matched bank transactions for feeds marked daily. Leave disabled until a dry run has been reviewed.",
    commented: true,
  },
});

/** Resolve only the operator-provided signing material. Errors never expose it. */
export function readBankSigningKey(
  inline: string | undefined,
  path: string | undefined,
): string | null {
  try {
    let source = inline?.trim();
    if (!source && path) {
      const file = statSync(path);
      if (!file.isFile() || file.size > 65536) {
        return null;
      }
      source = readFileSync(path, "utf8").trim();
    }
    if (!source || source.length > 65536) {
      return null;
    }
    if (!source.startsWith("-----BEGIN ")) {
      if (!/^[A-Za-z0-9+/]+={0,2}$/u.test(source)) {
        return null;
      }
      const decoded = Buffer.from(source, "base64");
      if (
        decoded.toString("base64").replace(/=+$/u, "") !==
        source.replace(/=+$/u, "")
      ) {
        return null;
      }
      source = decoded.toString("utf8").trim();
    }
    source = source.replaceAll("\\n", "\n").trim();
    if (!/^-----BEGIN (?:RSA )?PRIVATE KEY-----/u.test(source)) {
      return null;
    }
    return createPrivateKey(source).asymmetricKeyType === "rsa" ? source : null;
  } catch {
    return null;
  }
}

export function configuredEnableBanking(): {
  appId: string;
  privateKey: string;
} | null {
  const appId = bankConnectionEnv.ENABLE_BANKING_APP_ID;
  if (!appId) {
    return null;
  }
  const privateKey = readBankSigningKey(
    bankConnectionEnv.ENABLE_BANKING_PRIVATE_KEY,
    bankConnectionEnv.ENABLE_BANKING_PRIVATE_KEY_FILE,
  );
  return privateKey ? { appId, privateKey } : null;
}
