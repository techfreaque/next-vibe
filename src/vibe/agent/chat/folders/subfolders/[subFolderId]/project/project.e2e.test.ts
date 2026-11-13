/**
 * E2E: folder Project settings - real browser against the running server.
 * Open the folder menu, add instructions, attach a knowledge file.
 */

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import {
  createE2EUser,
  deleteE2EUser,
  seedFolder,
  signInAs,
  suppressWelcomeTour,
} from "../../../../testing/e2e-seed";
import foldersEndpoints from "../../../[rootFolderId]/definition";

describe("E2E: folder project settings", () => {
  const e2e = useE2E("agent/chat/folders/project");

  e2e.it("sets instructions and attaches a knowledge file from the folder menu", async (fixtures) => {
    const { open, page, context, uniqueEmail, cleanup } = fixtures;
    const account = await createE2EUser(uniqueEmail("project"));
    cleanup(() => deleteE2EUser(account));
    const folderName = `E2E Project ${Date.now()}`;
    await seedFolder(account, DefaultFolderId.PRIVATE, folderName);
    await signInAs(fixtures, account);
    await suppressWelcomeTour(context);

    await open(foldersEndpoints.GET, { path: "/threads/private" });
    const row = page.getByText(folderName, { exact: true }).first();
    await row.waitFor();
    await row.hover();
    const trigger = page.locator('[data-hydrated] button[aria-label="Folder actions"]').first();
    await trigger.waitFor();
    await trigger.click();
    await page.getByRole("menuitem", { name: "Project settings" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByText("No instructions yet").waitFor();
    await dialog.getByRole("button", { name: "Add instructions" }).click();
    await dialog.locator("textarea").fill("Always answer in haiku.");
    await dialog.getByRole("button", { name: "Save instructions" }).click();
    await dialog.getByText("Always answer in haiku.").waitFor();

    await dialog.getByRole("button", { name: "Add file" }).click();
    await dialog.getByPlaceholder("launch-brief").fill("brief");
    await dialog.locator("textarea").fill("Launch date is March 3rd.");
    await dialog.getByRole("button", { name: "Add file" }).click();
    await dialog.getByText("brief.md").waitFor();
    expect(await dialog.getByText("brief.md").count()).toBeGreaterThan(0);
    await page.screenshot({ path: ".tmp/project-dialog.png" });
  });
});
