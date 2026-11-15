/**
 * Subscribe-denial diagnostics: a denied `user/{uid}/…` subscribe must say
 * whether the tab holds a stale guest identity (login in another tab) or asked
 * for an unrelated uid, so prod rows are diagnosable without guessing.
 */

import { describe, expect, it } from "bun:test";

import type {
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { describeSubscribeIdentity } from "./ws-channel-auth";

const LEAD = "04de8f9b-7bb7-43e9-acdc-a866e6178da9";
const USER = "f6e5cfb8-e5be-4ae2-a5e3-e907aed50985";
const OTHER = "11365fcc-f53a-41c9-b859-df5547ca4492";

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

  it("adds nothing for endpoint channels", () => {
    expect(describeSubscribeIdentity(guest, "ws-credits-GET")).toEqual({});
  });
});
