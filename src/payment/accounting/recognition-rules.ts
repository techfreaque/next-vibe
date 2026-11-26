const zero = BigInt(0);

export function creditAtoms(amount: string): bigint | undefined {
  const match = /^(\d{1,10})(?:\.(\d{1,6}))?$/u.exec(amount);
  if (!match?.[1]) {
    return undefined;
  }
  return BigInt(match[1] + (match[2] ?? "").padEnd(6, "0"));
}

/** Round cumulative value once. The last eligible movement releases the exact sale net. */
export function recognitionMinor(
  soldNet: number,
  granted: bigint,
  alreadyReleasedCredits: bigint,
  alreadyReleasedMinor: number,
  movement: bigint,
): number | undefined {
  const cumulative = alreadyReleasedCredits + movement;
  if (
    granted <= zero ||
    movement <= zero ||
    cumulative > granted ||
    alreadyReleasedCredits < zero ||
    !Number.isSafeInteger(soldNet) ||
    !Number.isSafeInteger(alreadyReleasedMinor) ||
    soldNet < 0 ||
    alreadyReleasedMinor < 0 ||
    alreadyReleasedMinor > soldNet
  ) {
    return undefined;
  }
  const target = Number(
    (BigInt(soldNet) * cumulative + granted / BigInt(2)) / granted,
  );
  const delta = target - alreadyReleasedMinor;
  return delta >= 0 ? delta : undefined;
}
