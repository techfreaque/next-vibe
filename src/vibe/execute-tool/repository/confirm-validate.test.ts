/**
 * A gated call that cannot run is never parked for confirmation.
 *
 * CV-1: contact-form requires confirmation for a live (non-headless) caller
 * CV-2: invalid input fails validation before the dialog (prod 2026-11-27)
 * CV-3: valid input passes, so the gate still parks it
 * CV-4: preflight returns the validation error instead of the waiting status
 */

import "server-only";

import { describe, expect, it } from "bun:test";
import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";

import { defaultLocale } from "../../core/i18n/core/config";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { createEndpointLogger } from "../../logger/server";
import { scopedTranslation as aiTranslation } from "../../platforms/ai/i18n";
import { Platform } from "../../platforms/platforms";
import { validateBeforeConfirmation } from "./confirm-validate";
import { ExecuteToolGuards } from "./guards";
import type { RouteExecuteContext } from "./types";

const logger = createEndpointLogger(false, defaultLocale);

const user: JwtPrivatePayloadType = {
  id: "11111111-1111-4111-8111-111111111111",
  leadId: "22222222-2222-4222-8222-222222222222",
  isPublic: false,
  roles: [UserPermissionRole.CUSTOMER],
};

function liveContext(): ToolExecutionContext {
  return {
    ...makeHeadlessContext(undefined, undefined, "UTC"),
    headless: false,
  };
}

function ctx(): RouteExecuteContext {
  return {
    toolName: "contact-form",
    user,
    locale: defaultLocale,
    logger,
    t: aiTranslation.scopedT(defaultLocale).t,
    toolExecutionContext: liveContext(),
    platform: Platform.AI,
  };
}

const invalidInput = { subject: "Bug report", message: "The page is broken." };
const validInput = {
  name: "Ada Lovelace",
  message: "The page is broken after login.",
};

describe("validateBeforeConfirmation", () => {
  it("CV-1: contact-form is gated for a live caller", async () => {
    expect(
      await ExecuteToolGuards.isConfirmationRequired({
        toolName: "contact-form",
        data: { callbackMode: null },
        toolExecutionContext: liveContext(),
        logger,
      }),
    ).toBe(true);
  });

  it("CV-2: invalid input fails before the dialog", async () => {
    const invalid = await validateBeforeConfirmation({
      ctx: ctx(),
      input: invalidInput,
    });
    expect(invalid?.success).toBe(false);
    expect(invalid?.message).toContain("name");
  });

  it("CV-3: valid input passes", async () => {
    expect(
      await validateBeforeConfirmation({ ctx: ctx(), input: validInput }),
    ).toBeNull();
  });

  it("CV-4: preflight returns the error, not the waiting status", async () => {
    const context = ctx();
    const blocked = await ExecuteToolGuards.preflight({
      ctx: context,
      callbackMode: null,
      instanceId: undefined,
      input: invalidInput,
    });
    expect(blocked?.success).toBe(false);
    expect(context.toolExecutionContext.stepHasToolsAwaitingConfirmation).not.toBe(
      true,
    );
  });
});
