import { expect, it } from "bun:test";

import { claimSyncSlot, isSyncSlotBusy, releaseSyncSlot } from "./repository";

it("keeps a replacement sync slot when the previous connection releases it again", () => {
  const key = "sync-slot-test";
  const first = claimSyncSlot(key);
  expect(first).not.toBeNull();
  if (first === null) {
    return;
  }
  expect(claimSyncSlot(key)).toBeNull();

  releaseSyncSlot(key, first);
  const replacement = claimSyncSlot(key);
  expect(replacement).not.toBeNull();
  if (replacement === null) {
    return;
  }

  try {
    releaseSyncSlot(key, first);
    expect(isSyncSlotBusy(key)).toBe(true);
  } finally {
    releaseSyncSlot(key, replacement);
  }
  expect(isSyncSlotBusy(key)).toBe(false);
});
