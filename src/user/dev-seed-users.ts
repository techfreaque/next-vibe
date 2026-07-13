/**
 * Dev seed user constants
 * Shared between seeds.ts (server) and login form (client) for dev quick-login
 */
import "server-only";

import { env } from "@/config/env";

// Defined HERE (not in users/seeds.ts) on purpose: the dev server's
// exclude-generator-seeds Vite plugin stubs every seeds.ts module to
// `export default {}` (seeds are CLI-only), so importing this constant from
// a seeds file yielded undefined at runtime — the dev quick-login rendered a
// blank user button. users/seeds.ts imports it from here instead.
export const DEV_SEED_DEMO_USER_EMAIL = "demo@example.com";

export const DEV_SEED_PASSWORD = env.VIBE_ADMIN_USER_PASSWORD;

export const DEV_SEED_USERS = [
  {
    email: env.VIBE_ADMIN_USER_EMAIL,
    privateName: "Admin User",
    publicName: "Admin Corp",
    role: "ADMIN",
  },
  {
    email: DEV_SEED_DEMO_USER_EMAIL,
    privateName: "Demo User",
    publicName: "Demo Company",
    role: "CUSTOMER",
  },
  {
    email: "user1@example.com",
    privateName: "Regular User1",
    publicName: "User1 Corp",
    role: "CUSTOMER",
  },
  {
    email: "user2@example.com",
    privateName: "Regular User2",
    publicName: "User2 Corp",
    role: "CUSTOMER",
  },
] as const;
