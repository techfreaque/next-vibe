export function getScreenWidth(): number {
  return process.stdout.columns ?? 80;
}

export function getScreenHeight(): number {
  return process.stdout.rows ?? 24;
}
