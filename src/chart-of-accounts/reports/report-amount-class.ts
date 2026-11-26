export function reportAmountClass(value: number): string {
  return Math.abs(value) < 0.005
    ? "tabular-nums text-muted-foreground"
    : "tabular-nums text-foreground";
}
