/**
 * Dev seed user constants
 * Shared between seeds.ts (server) and login form (client) for dev quick-login
 */
import "server-only";

import { env } from "@/config/env";
import { DEV_SEED_DEMO_USER_EMAIL } from "../users/seeds";

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
