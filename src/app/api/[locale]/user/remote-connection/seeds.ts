/**
 * Remote Connection Seeds
 * Dev seed: creates a fully-authenticated local-to-local connection
 * (localhost:3000 → localhost:3001) so developers can test the remote
 * connection flow without a real cloud instance.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { users } from "../db";
import loginEndpoints, {
  type LoginPostResponseOutput,
} from "../public/login/definition";
import { UserPermissionRole } from "../user-roles/enum";
import { scopedTranslation } from "./connect/i18n";
import { connectRemote } from "./connect/repository";
import { userRemoteConnections } from "./db";

function getSelfInstanceId(): string {
  try {
    const parsed = new URL(env.NEXT_PUBLIC_APP_URL);
    return parsed.port === "3001" ? "hermes" : "hermes-dev";
  } catch {
    return "hermes-dev";
  }
}

function buildPreviewUrl(): string | null {
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  const previewPort = env.PREVIEW_PORT;
  if (!appUrl || !previewPort) {
    return null;
  }
  try {
    const parsed = new URL(appUrl);
    parsed.port = String(previewPort);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  const selfInstanceId = getSelfInstanceId();

  // ── Port 3001 (preview / "hermes"): self-record handled by prod seed ─────
  if (selfInstanceId === "hermes") {
    return;
  }

  // ── Port 3000 (main dev / "hermes-dev"): connect out to port 3001 ────────

  const devRemoteUrl = buildPreviewUrl();
  if (!devRemoteUrl) {
    logger.debug("PREVIEW_PORT not set, skipping remote-connection seed");
    return;
  }

  const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
  const adminPassword = env.VIBE_ADMIN_USER_PASSWORD;
  if (!adminEmail || !adminPassword) {
    logger.debug(
      "Missing admin credentials env vars, skipping remote-connection seed",
    );
    return;
  }

  const adminRows = await db
    .select({ id: users.id, leadId: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  const adminUser = adminRows[0];
  if (!adminUser) {
    logger.debug("Admin user not found, skipping remote-connection seed");
    return;
  }

  // Check specifically for the outbound connection (token is a real JWT, not "self")
  const existing = await db
    .select({ id: userRemoteConnections.id })
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.instanceId, selfInstanceId),
        ne(userRemoteConnections.token, "self"),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    logger.debug("Dev remote connection already exists, skipping");
    return;
  }

  // Login to the remote instance to get a token (server-side fetch, no CORS)
  let token: string;
  let remoteLeadId: string;
  try {
    const loginResp = await fetch(
      `${devRemoteUrl}/api/${defaultLocale}/${loginEndpoints.POST.path.join("/")}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          rememberMe: true,
        }),
      },
    );
    if (!loginResp.ok) {
      logger.warn(
        `Remote login failed (${loginResp.status.toString()}), skipping remote-connection seed`,
      );
      return;
    }
    const json = (await loginResp.json()) as {
      success?: boolean;
      data?: LoginPostResponseOutput;
    };
    if (!json.data?.token) {
      logger.warn(
        "Remote login returned no token, skipping remote-connection seed",
      );
      return;
    }
    token = json.data.token;
    remoteLeadId = json.data.leadId ?? "";
  } catch {
    logger.warn(
      `Could not reach ${devRemoteUrl}, skipping remote-connection seed`,
    );
    return;
  }

  const userPayload = {
    id: adminUser.id,
    leadId: remoteLeadId,
    isPublic: false as const,
    roles: [UserPermissionRole.ADMIN],
  };

  const { t } = scopedTranslation.scopedT(locale);
  const result = await connectRemote(
    {
      instanceId: selfInstanceId,
      friendlyName: "Local Preview",
      remoteUrl: devRemoteUrl,
      token,
      leadId: remoteLeadId,
    },
    userPayload,
    logger,
    t,
  );

  if (result.success) {
    logger.debug("Dev remote connection seeded successfully");
  } else {
    logger.warn("Dev remote connection seed failed", { error: result.message });
  }
}
