import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { describe, expect } from "vitest";

import { useE2E } from "./harness";

describe("E2E teardown with a closed tab", () => {
  const e2e = useE2E("testing/closed-admin-tab-cleanup");
  e2e.it(
    "runs registered cleanup in reverse order after a page closes",
    async (fixture) => {
      const id = randomUUID();
      fixture.cleanup(async () => {
        expect(
          await db.select({ id: users.id }).from(users).where(eq(users.id, id)),
        ).toEqual([]);
      });
      fixture.cleanup(async () => {
        await db.delete(users).where(eq(users.id, id));
      });
      await db.insert(users).values({
        id,
        email: id + "@example.invalid",
        locale: "en-US",
        publicName: "Closed admin tab fixture",
        privateName: "Closed admin tab fixture",
        password: "disabled",
      });
      await fixture.page.close();
    },
  );
});
