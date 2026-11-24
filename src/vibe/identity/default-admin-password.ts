/**
 * Default admin passwords a fresh install ships with.
 *
 * "change-me-now" is the schema default when VIBE_ADMIN_USER_PASSWORD is unset;
 * "your-admin-password" is the value a fresh clone gets from .env.example.
 * Either one means first run: the admin login goes to the setup wizard and the
 * wizard opens on its own. Client-safe (no env imports).
 */

export const DEFAULT_ADMIN_PASSWORD = "change-me-now" as const;

/** Placeholder admin email a fresh install ships with. */
export const DEFAULT_ADMIN_EMAIL = "admin@please.change.me" as const;

export const DEFAULT_ADMIN_PASSWORDS: readonly string[] = [
  DEFAULT_ADMIN_PASSWORD,
  "your-admin-password",
];

export function isDefaultAdminPassword(
  password: string | null | undefined,
): boolean {
  return password !== null && password !== undefined
    ? DEFAULT_ADMIN_PASSWORDS.includes(password)
    : false;
}
