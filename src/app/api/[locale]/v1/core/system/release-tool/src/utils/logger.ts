export function logger(message: string): void {
  // eslint-disable-next-line no-console
  console.log(
    `%c[release-tool][INFO] ${message}`,
    "color: green; font-size: larger;",
  );
}

// eslint-disable-next-line no-restricted-syntax
export function loggerError(message: string, error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(
    `%c[release-tool][ERROR] ${message}`,
    "color: red; font-size: larger;",
    error,
  );
}
