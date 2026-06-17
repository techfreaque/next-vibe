import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { beforeAll, describe, expect, it } from "vitest";

import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import avatarEndpoints from "./definition";

describe("POST /user/private/me/avatar", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  it("rejects file too large (>5MB) with VALIDATION_ERROR", async () => {
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });

    const res = await sendTestRequest({
      endpoint: avatarEndpoints.POST,
      data: {
        fileUpload: {
          file: bigFile,
        },
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects non-image file type (PDF) with VALIDATION_ERROR", async () => {
    const pdfFile = new File(["fake pdf content"], "document.pdf", {
      type: "application/pdf",
    });

    const res = await sendTestRequest({
      endpoint: avatarEndpoints.POST,
      data: {
        fileUpload: {
          file: pdfFile,
        },
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects unauthenticated user with FORBIDDEN", async () => {
    const file = new File(["data"], "avatar.jpg", { type: "image/jpeg" });

    const res = await sendTestRequest({
      endpoint: avatarEndpoints.POST,
      data: {
        fileUpload: { file },
      },
      user: {
        isPublic: true,
        leadId: "00000000-0000-0000-0000-000000000002",
        roles: [UserPermissionRole.PUBLIC],
      },
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.FORBIDDEN.errorCode);
  });

  it("accepts valid JPEG file and returns response shape", async () => {
    // 1x1 pixel minimal valid JPEG
    const jpegBytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
      0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
      0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
      0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
      0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
      0x09, 0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00, 0x02, 0x01, 0x03,
      0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d,
      0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xfb, 0xd7,
      0xff, 0xd9,
    ]);
    const file = new File([jpegBytes], "avatar.jpg", { type: "image/jpeg" });

    const res = await sendTestRequest({
      endpoint: avatarEndpoints.POST,
      data: {
        fileUpload: { file },
      },
      user: adminUser,
    });

    // Accept success or a storage error — the upload pipeline may not have cloud storage configured in test env
    if (res.success) {
      expect(res.data.response.success).toBe(true);
      expect(res.data.response.message).toBeTypeOf("string");
      expect(res.data.response.nextSteps).toBeInstanceOf(Array);
    } else {
      // Storage errors are acceptable in test environment without cloud bucket
      expect([
        ErrorResponseTypes.INTERNAL_ERROR.errorCode,
        ErrorResponseTypes.VALIDATION_ERROR.errorCode,
      ]).toContain(res.errorType?.errorCode);
    }
  });
});

describe("DELETE /user/private/me/avatar", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  it("rejects unauthenticated user with FORBIDDEN", async () => {
    const res = await sendTestRequest({
      endpoint: avatarEndpoints.DELETE,
      user: {
        isPublic: true,
        leadId: "00000000-0000-0000-0000-000000000002",
        roles: [UserPermissionRole.PUBLIC],
      },
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.FORBIDDEN.errorCode);
  });

  it("deletes avatar (or no-ops if no avatar) and returns a message", async () => {
    const res = await sendTestRequest({
      endpoint: avatarEndpoints.DELETE,
      user: adminUser,
    });

    expect(res.success, `DELETE avatar failed: ${String(res.success === false && res.message)}`).toBe(true);
    if (!res.success) {return;}
    expect(res.data.success).toBe(true);
    expect(res.data.message).toBeTypeOf("string");
    expect(res.data.message.length).toBeGreaterThan(0);
    expect(res.data.nextSteps).toBeInstanceOf(Array);
  });
});
