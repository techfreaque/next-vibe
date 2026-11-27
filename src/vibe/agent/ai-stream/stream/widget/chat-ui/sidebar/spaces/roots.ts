import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";

import { DEFAULT_FOLDER_CONFIGS } from "../../../../../../chat/config";

export function visibleRoots(user: JwtPayloadType): DefaultFolderId[] {
  return Object.values(DEFAULT_FOLDER_CONFIGS)
    .toSorted((a, b) => a.order - b.order)
    .filter((folder) => {
      if (folder.id === DefaultFolderId.INCOGNITO) {
        return true;
      }
      if (
        folder.id === DefaultFolderId.PRIVATE ||
        folder.id === DefaultFolderId.SHARED
      ) {
        return !user.isPublic;
      }
      return user.roles.some((role) =>
        folder.rolesView.some((allowed) => allowed === role),
      );
    })
    .map((folder) => folder.id);
}

export interface SpaceEntry {
  id: DefaultFolderId;
  /** Guests see account-only spaces too. Selecting one explains signup. */
  locked: boolean;
}

/**
 * Every space shown in the switcher, in config order. Guests also get the
 * account-only spaces (private, shared, background, remote) as locked entries,
 * exactly like the committed root picker, so the full model is visible before signup.
 */
export function spaceEntries(user: JwtPayloadType): SpaceEntry[] {
  const open = visibleRoots(user);
  const lockedForGuests = user.isPublic
    ? [
        DefaultFolderId.PRIVATE,
        DefaultFolderId.SHARED,
        DefaultFolderId.BACKGROUND,
        DefaultFolderId.REMOTE,
      ]
    : [];
  return Object.values(DEFAULT_FOLDER_CONFIGS)
    .toSorted((a, b) => a.order - b.order)
    .filter(
      (folder) =>
        open.includes(folder.id) || lockedForGuests.includes(folder.id),
    )
    .map((folder) => ({
      id: folder.id,
      locked: !open.includes(folder.id),
    }));
}
