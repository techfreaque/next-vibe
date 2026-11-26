/**
 * Browser session access to resource channels and diagnostics for denied
 * subscriptions.
 */

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";
import { eq, getTableColumns, type SQL, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";

import { chatThreads } from "../../agent/chat/db";
import { ThreadModerationStatus } from "../../agent/chat/enum";
import folderContentsEndpoints from "../../agent/chat/folder-contents/[rootFolderId]/definition";
import messagesEndpoints from "../../agent/chat/threads/[threadId]/messages/definition";
import { DefaultFolderId } from "../../core/execution-context";
import { defaultLocale } from "../../core/i18n/core/config";
import type {
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "../../identity/auth/types";
import { leads, userLeadLinks } from "../../identity/lead/db";
import { UserPermissionRole } from "../../identity/roles/enum";
import { sessions } from "../../identity/session/db";
import { userRoles, users } from "../../identity/user/db";
import { createEndpointLogger } from "../../logger/server";
import { buildUserWsChannel, buildWsChannel } from "../core/channel";
import {
  authenticateWsRequest,
  authorizeWsChannel,
  describeGuestLeadMismatch,
  describeSubscribeIdentity,
} from "./ws-channel-auth";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("../../database", () => ({
  db,
  describeAppPoolCheckouts: (): undefined => undefined,
  getLivePgliteClient: (): PGlite => pg,
  getLongRunningDb: (): typeof db => db,
  isPglite: true,
  jsonbBool: (): SQL => sql.raw("false"),
  pgliteClient: pg,
  rawPool: undefined,
  supportsAdvancedSql: false,
  trackPendingDbWork: (): void => undefined,
}));

const LEAD = "04de8f9b-7bb7-43e9-acdc-a866e6178da9";
const USER = "f6e5cfb8-e5be-4ae2-a5e3-e907aed50985";
const OTHER = "11365fcc-f53a-41c9-b859-df5547ca4492";
const THREAD = "66c0aeae-f051-459c-8c19-9e3155fd24c8";

const loggedIn: JwtPrivatePayloadType = {
  isPublic: false,
  id: USER,
  leadId: LEAD,
  roles: [UserPermissionRole.CUSTOMER],
};
const guest: JWTPublicPayloadType = {
  isPublic: true,
  leadId: LEAD,
  roles: [UserPermissionRole.PUBLIC],
};

describe("WebSocket guest authentication", () => {
  it("identifies an upgrade carrying only a lead cookie as a guest", async () => {
    const request = new Request("http://localhost/ws", {
      headers: { cookie: `${LEAD_ID_COOKIE_NAME}=${LEAD}` },
    });
    const result = await authenticateWsRequest(
      request,
      createEndpointLogger(false, defaultLocale),
    );
    expect(result).toEqual({ user: guest, source: "guest" });
  });
});

describe("WebSocket browser session authorization", () => {
  const logger = createEndpointLogger(false, defaultLocale);
  const endpoint = folderContentsEndpoints.GET;
  const urlPathParams = { rootFolderId: DefaultFolderId.PUBLIC };
  const rootRequestData = { subFolderId: undefined, threadIds: undefined };
  const channel = buildWsChannel(
    endpoint,
    urlPathParams,
    rootRequestData,
    logger,
  );
  const descriptor = {
    endpointPath: endpoint.path,
    method: endpoint.method,
    urlPathParams,
    requestData: {},
  };

  beforeAll(async () => {
    const threadColumns = Object.values(getTableColumns(chatThreads))
      .map((column) => `${column.name} ${column.getSQLType()}`)
      .join(", ");
    const leadColumns = Object.values(getTableColumns(leads))
      .map((column) => `${column.name} ${column.getSQLType()}`)
      .join(", ");
    await pg.exec(`
      CREATE TABLE users (id uuid PRIMARY KEY, is_active boolean DEFAULT true, is_banned boolean DEFAULT false);
      CREATE TABLE sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, token text,
        name text, expires_at timestamp, created_at timestamp DEFAULT now()
      );
      CREATE TABLE user_lead_links (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, lead_id uuid,
        link_reason text, linked_at timestamp DEFAULT now(), created_at timestamp DEFAULT now()
      );
      CREATE TABLE user_roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, role text,
        assigned_by uuid, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
      );
      CREATE TABLE chat_threads (${threadColumns});
      CREATE TABLE leads (${leadColumns});
    `);
    await pg.query("INSERT INTO users (id) VALUES ($1)", [USER]);
    await db.insert(userLeadLinks).values({
      userId: USER,
      leadId: LEAD,
      linkReason: "signup",
    });
    await pg.query(
      "INSERT INTO chat_threads (id, user_id, root_folder_id, moderation_status) VALUES ($1, $2, $3, $4)",
      [THREAD, OTHER, DefaultFolderId.PUBLIC, ThreadModerationStatus.VISIBLE],
    );
  });

  afterAll(async () => {
    await pg.close();
  });

  it("admits live sessions without a stored customer role to public chat channels", async () => {
    const { AuthRepository } = await import("../../identity/auth/repository");
    const signed = await AuthRepository.signJwt(
      { ...loggedIn, roles: [UserPermissionRole.ADMIN] },
      logger,
      defaultLocale,
    );
    expect(signed.success).toBe(true);
    if (!signed.success) {
      return;
    }
    await db.insert(sessions).values({
      userId: USER,
      token: signed.data,
      expiresAt: new Date(Date.now() + 60_000),
    });
    const request = new Request("http://localhost/ws", {
      headers: {
        cookie: `${AUTH_TOKEN_COOKIE_NAME}=${signed.data}; ${LEAD_ID_COOKIE_NAME}=${LEAD}`,
      },
    });

    const roleless = await authenticateWsRequest(request, logger);
    expect(roleless).toEqual({ user: loggedIn, source: "browser-session" });
    if (!roleless) {
      return;
    }
    expect(
      await authorizeWsChannel(
        roleless.user,
        channel,
        descriptor,
        logger,
        defaultLocale,
      ),
    ).toEqual({ allowed: true });
    const messages = messagesEndpoints.GET;
    const messageParams = { threadId: THREAD };
    const messageRequest = { rootFolderId: DefaultFolderId.PUBLIC };
    const messageChannel = buildWsChannel(
      messages,
      messageParams,
      messageRequest,
      logger,
    );
    const messageDescriptor = {
      endpointPath: messages.path,
      method: messages.method,
      urlPathParams: messageParams,
      requestData: messageRequest,
    };
    expect(
      await authorizeWsChannel(
        roleless.user,
        messageChannel,
        messageDescriptor,
        logger,
        defaultLocale,
      ),
    ).toEqual({ allowed: true });
    await db
      .update(chatThreads)
      .set({ moderationStatus: ThreadModerationStatus.REMOVED })
      .where(eq(chatThreads.id, THREAD));
    expect(
      await authorizeWsChannel(
        roleless.user,
        messageChannel,
        messageDescriptor,
        logger,
        defaultLocale,
      ),
    ).toEqual({ allowed: false, reason: "resource-denied" });

    await db.insert(userRoles).values({
      userId: USER,
      role: UserPermissionRole.PARTNER_EMPLOYEE,
    });
    const partner = await authenticateWsRequest(request, logger);
    expect(partner?.user.roles).toEqual([
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.PARTNER_EMPLOYEE,
    ]);

    await db.update(users).set({ isBanned: true }).where(eq(users.id, USER));
    expect(await authenticateWsRequest(request, logger)).toEqual({
      user: guest,
      source: "rejected-cookie",
    });
  });

  it("preserves allow and deny decisions for each channel scope", async () => {
    const ownerChannel = buildUserWsChannel(
      endpoint,
      USER,
      urlPathParams,
      rootRequestData,
      logger,
    );
    const guestChannel = buildUserWsChannel(
      endpoint,
      LEAD,
      urlPathParams,
      rootRequestData,
      logger,
    );
    const privateParams = { rootFolderId: DefaultFolderId.PRIVATE };
    const privateChannel = buildWsChannel(
      endpoint,
      privateParams,
      rootRequestData,
      logger,
    );
    const privateDescriptor = { ...descriptor, urlPathParams: privateParams };

    // The same matrix runs against the previous boolean authorizer.
    const decisions = await Promise.all([
      authorizeWsChannel(
        loggedIn,
        ownerChannel,
        undefined,
        logger,
        defaultLocale,
      ),
      authorizeWsChannel(guest, ownerChannel, undefined, logger, defaultLocale),
      authorizeWsChannel(guest, guestChannel, undefined, logger, defaultLocale),
      authorizeWsChannel(
        loggedIn,
        guestChannel,
        undefined,
        logger,
        defaultLocale,
      ),
      authorizeWsChannel(guest, channel, descriptor, logger, defaultLocale),
      authorizeWsChannel(
        guest,
        channel,
        privateDescriptor,
        logger,
        defaultLocale,
      ),
      authorizeWsChannel(
        loggedIn,
        privateChannel,
        privateDescriptor,
        logger,
        defaultLocale,
      ),
      authorizeWsChannel(
        guest,
        privateChannel,
        privateDescriptor,
        logger,
        defaultLocale,
      ),
    ]);
    expect(
      JSON.stringify(
        decisions.map((decision) =>
          typeof decision === "boolean" ? decision : decision.allowed,
        ),
      ),
    ).toBe("[true,false,true,false,true,false,true,false]");
  });

  it("describes a guest socket whose lead differs from the rendered one without logging the IP", async () => {
    const BOT_LEAD = "2b0f7c1e-5d0e-4c55-9d43-0f5a8e7b6a10";
    const RENDERED_LEAD = "9a3c1f2e-7b44-4c1a-8f6e-2d5b9c0e1a77";
    const createdAt = new Date(Date.now() - 30 * 60_000);
    await pg.query(
      "INSERT INTO leads (id, status, device_type, ip_address, user_agent, created_at, updated_at) VALUES ($1, 'new', 'enums.deviceType.bot', '198.51.100.7', 'ua-a', now(), now()), ($2, 'new', 'enums.deviceType.bot', '203.0.113.9', 'ua-b', $3, $3)",
      [BOT_LEAD, RENDERED_LEAD, createdAt],
    );
    const facts = await describeGuestLeadMismatch(
      BOT_LEAD,
      `user/${RENDERED_LEAD}/ws-credits-GET`,
    );
    expect(facts).toEqual({
      socketLeadDeviceType: "enums.deviceType.bot",
      requestedLeadDeviceType: "enums.deviceType.bot",
      requestedLeadFound: true,
      requestedLeadAgeMin: 30,
      leadsShareIp: false,
      leadsShareUserAgent: false,
    });
    expect(JSON.stringify(facts)).not.toContain("198.51.100.7");
    expect(
      await describeGuestLeadMismatch(BOT_LEAD, `user/${OTHER}/ws-credits-GET`),
    ).toMatchObject({ requestedLeadFound: false, leadsShareIp: undefined });
    expect(await describeGuestLeadMismatch(BOT_LEAD, "ws-credits-GET")).toEqual(
      {},
    );
  });

  it("reports which authorization gate denied the subscription", async () => {
    expect(
      await authorizeWsChannel(
        { ...loggedIn, roles: [] },
        channel,
        descriptor,
        logger,
        defaultLocale,
      ),
    ).toMatchObject({
      allowed: false,
      reason: "endpoint-permission",
      permission: { cause: "insufficientRoles" },
    });

    const privateParams = { rootFolderId: DefaultFolderId.PRIVATE };
    const privateChannel = buildWsChannel(
      endpoint,
      privateParams,
      rootRequestData,
      logger,
    );
    expect(
      await authorizeWsChannel(
        guest,
        privateChannel,
        { ...descriptor, urlPathParams: privateParams },
        logger,
        defaultLocale,
      ),
    ).toEqual({ allowed: false, reason: "resource-denied" });
  });
});

describe("describeSubscribeIdentity", () => {
  it("flags a guest-state tab whose socket is logged in", () => {
    expect(
      describeSubscribeIdentity(loggedIn, `user/${LEAD}/ws-credits-GET`),
    ).toEqual({
      requestedUid: LEAD,
      socketUid: USER,
      identityMismatch: "client-guest-socket-user",
    });
  });

  it("flags a logged-in socket asking for an unrelated uid", () => {
    expect(
      describeSubscribeIdentity(loggedIn, `user/${OTHER}/ws-credits-GET`)
        .identityMismatch,
    ).toBe("foreign");
  });

  it("flags a guest-state tab whose lead rotated on signup (linked lead)", () => {
    const rotated: JwtPrivatePayloadType = { ...loggedIn, leadId: OTHER };
    expect(
      describeSubscribeIdentity(rotated, `user/${LEAD}/ws-credits-GET`, true)
        .identityMismatch,
    ).toBe("client-guest-socket-user");
    expect(
      describeSubscribeIdentity(rotated, `user/${LEAD}/ws-credits-GET`, false)
        .identityMismatch,
    ).toBe("foreign");
  });

  it("flags a guest socket asking for another uid", () => {
    expect(
      describeSubscribeIdentity(guest, `user/${USER}/ws-credits-GET`),
    ).toEqual({
      requestedUid: USER,
      socketUid: LEAD,
      identityMismatch: "socket-guest-other-uid",
    });
  });

  it("names only the socket identity for endpoint channels", () => {
    expect(describeSubscribeIdentity(guest, "ws-credits-GET")).toEqual({
      socketUid: LEAD,
    });
  });
});
