export function logger(message: string): void {
  // eslint-disable-next-line no-console
  console.log(
    `%c[PWE-Launchpad][INFO] ${message}`,
    "color: green; font-size: larger;",
  );
}

export function loggerError(message: string, error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(
    `%c[PWE-Launchpad][ERROR] ${message}`,
    "color: red; font-size: larger;",
    error,
  );
}
