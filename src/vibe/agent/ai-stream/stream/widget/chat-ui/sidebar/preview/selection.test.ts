import { describe, expect, test } from "bun:test";
import { Environment } from "next-vibe/env/env-util";

import { selectSidebarVariant, type SidebarVariant } from "./selection";

describe("sidebar design previews", () => {
  const variants: SidebarVariant[] = ["A", "B", "C"];
  for (const variant of variants) {
    test(`only development accepts ${variant}`, () => {
      const search = `?sidebar=${variant}`;
      expect(selectSidebarVariant(Environment.PRODUCTION, search)).toBeNull();
      expect(selectSidebarVariant(Environment.TEST, search)).toBeNull();
      expect(selectSidebarVariant(Environment.DEVELOPMENT, search)).toBe(variant);
    });
  }

  test("default and unrecognized choices keep the current sidebar", () => {
    for (const search of ["", "?sidebar=", "?sidebar=invalid"]) {
      expect(selectSidebarVariant(Environment.DEVELOPMENT, search)).toBeNull();
    }
  });
});
