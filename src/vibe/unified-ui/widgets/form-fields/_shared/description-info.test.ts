import { describe, expect, it } from "bun:test";

import { descriptionAddsInfo } from "./description-info";

describe("descriptionAddsInfo", () => {
  it("hides descriptions that restate the label", () => {
    expect(
      descriptionAddsInfo("The new name for this instance", "New Instance ID"),
    ).toBe(false);
    expect(descriptionAddsInfo("Account code", "Account Code")).toBe(false);
    expect(descriptionAddsInfo("", "Name")).toBe(false);
  });

  it("keeps descriptions that tell the user something new", () => {
    expect(
      descriptionAddsInfo(
        "Leave blank to keep your existing key",
        "Klaviyo API Key",
      ),
    ).toBe(true);
    expect(
      descriptionAddsInfo(
        "Only count opt-ins confirmed by email",
        "Confirmed only",
      ),
    ).toBe(true);
  });
});
