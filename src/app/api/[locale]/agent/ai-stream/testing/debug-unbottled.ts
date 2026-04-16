import "server-only";
import {
  installFetchCache,
  addLocalhostPort,
  setFetchCacheContext,
} from "@/app/api/[locale]/agent/ai-stream/testing/fetch-cache";
installFetchCache();
import { installWsFixture } from "@/app/api/[locale]/agent/ai-stream/testing/ws-fixture";
installWsFixture();
import { agentEnv } from "@/app/api/[locale]/agent/env";
import { env } from "@/config/env";
import { db } from "@/app/api/[locale]/system/db";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { defaultLocale } from "@/i18n/core/config";
import { eq } from "drizzle-orm";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { runTestStream } from "@/app/api/[locale]/agent/ai-stream/testing/headless-test-runner";

async function main(): Promise<void> {
  addLocalhostPort(3001);
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const userResult = await UserRepository.getUserByEmail(
    env.VIBE_ADMIN_USER_EMAIL,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!userResult.success || !userResult.data) {
    // oxlint-disable-next-line no-console
    console.error("User not found:", env.VIBE_ADMIN_USER_EMAIL);
    process.exit(1);
  }
  const user = userResult.data;
  const link = await db.query.userLeadLinks.findFirst({
    where: (ul, { eq: eql }) => eql(ul.userId, user.id),
  });
  const roleRows = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, user.id));
  const roles = roleRows
    .map((r) => r.role)
    .filter((r) =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    ) as (typeof UserRoleDB)[number][];
  const testUser = {
    id: user.id,
    leadId: link!.leadId,
    roles,
    isPublic: false as const,
  };
  // oxlint-disable-next-line no-console
  console.log(
    "testUser:",
    testUser.id.slice(0, 8),
    "roles:",
    roles.slice(0, 2),
  );

  setFetchCacheContext("debug-setup");
  const resp = await fetch(
    "http://localhost:3001/api/en-US/user/public/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: env.VIBE_ADMIN_USER_EMAIL,
        password: env.VIBE_ADMIN_USER_PASSWORD,
      }),
    },
  );
  const json = (await resp.json()) as {
    success: boolean;
    data?: { token?: string; leadId?: string };
  };
  // oxlint-disable-next-line no-console
  console.log(
    "hermes login:",
    json.success,
    "leadId:",
    json.data?.leadId?.slice(0, 8),
  );
  if (!json.success || !json.data?.token) {
    // oxlint-disable-next-line no-console
    console.error("Login failed");
    process.exit(1);
  }

  Object.assign(agentEnv, {
    UNBOTTLED_CLOUD_CREDENTIALS: `${json.data.leadId}:${json.data.token}:http://localhost:3001`,
  });

  setFetchCacheContext("debug-u1");
  const result = await runTestStream({
    prompt: "Say: OK",
    user: testUser,
    providerOverride: ApiProvider.UNBOTTLED,
  });
  // oxlint-disable-next-line no-console
  console.log("stream result:", JSON.stringify(result.result).slice(0, 800));
  process.exit(0);
}

void main();
