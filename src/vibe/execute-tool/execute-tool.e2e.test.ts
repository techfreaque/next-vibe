/**
 * E2E: execute-tool page — pick a tool by name, confirm, the call runs
 * through execute-tool and the result renders.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import type { EndpointForm } from "next-vibe/tooling/testing/e2e/endpoint-form";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { scopedTranslation } from "../platforms/ai/i18n";
import { scopedTranslation as uiScopedTranslation } from "../ui/web/i18n";
import executeToolEndpoints from "./definition";

const endpoint = executeToolEndpoints.POST;
const { t: uiT } = uiScopedTranslation.scopedT(E2E_LOCALE);
const { t } = scopedTranslation.scopedT(E2E_LOCALE);

/**
 * The tool picker is an autocomplete combobox (no field driver): open it,
 * type the name and take the best match — a listed tool, or the typed name
 * as a custom value — exactly what a user does.
 */
async function pickTool(
  form: EndpointForm<typeof endpoint>,
  toolName: string,
): Promise<void> {
  const field = form.field("toolName");
  await field.locator('[role="combobox"]').click();
  await form.page.locator("[cmdk-input]").fill(toolName);
  const listed = form.page
    .locator("[cmdk-item]")
    .filter({ hasText: new RegExp(`^${toolName}`) })
    .first();
  const custom = form.page
    .locator("[cmdk-item]", {
      hasText: uiT("common.useCustomValue", { value: toolName }),
    })
    .first();
  await listed.or(custom).first().click();
  await field
    .locator('[role="combobox"]', { hasText: toolName })
    .waitFor({ state: "visible" });
}

/**
 * The Confirm action sits beside the tool-picker form (it also serves the
 * read-only tool-call view), so it is clicked directly rather than via
 * form.submit(), which only looks inside the picker form.
 */
function confirmButton(form: EndpointForm<typeof endpoint>): Locator {
  return form.page.locator('[data-testid="endpoint-submit"]', {
    hasText: t("executeTool.post.actions.confirm"),
  });
}

describe("E2E: execute-tool", () => {
  const e2e = useE2E("execute-tool");

  e2e.it(
    "runs a picked tool through execute-tool and returns its result",
    async ({ open, capture }) => {
      const form = await open(endpoint);
      await pickTool(form, "skills");

      const call = await capture(endpoint, async () => {
        await confirmButton(form).click();
      });
      // The listed option carries the canonical tool name behind the alias
      expect(String(call.requestBody["toolName"])).toContain("skills");
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) return;
      expect(call.response.data.result).toBeTruthy();
    },
  );

  e2e.it(
    "rejects an unknown tool name on the server",
    async ({ open, capture }) => {
      const form = await open(endpoint);
      await pickTool(form, "e2e-no-such-tool");

      const call = await capture(endpoint, async () => {
        await confirmButton(form).click();
      });
      expect(call.response.success).toBe(false);
    },
  );

  e2e.it(
    "blocks confirming without a tool name and says why",
    async ({ open }) => {
      const form = await open(endpoint);
      await confirmButton(form).click();

      await form
        .field("toolName")
        .locator("[data-field-error]")
        .waitFor({ state: "visible" });
      expect(Object.keys(await form.fieldErrors())).toEqual(["toolName"]);
      expect(form.calls).toHaveLength(0);
    },
  );
});
