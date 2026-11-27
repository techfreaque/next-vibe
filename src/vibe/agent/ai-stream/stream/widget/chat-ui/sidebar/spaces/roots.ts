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
 * Keep the chat spaces in config order and include the signup gates for
 * Private and Shared.
 */
export function spaceEntries(user: JwtPayloadType): SpaceEntry[] {
  const open = visibleRoots(user);
  const lockedForGuests = user.isPublic
    ? [DefaultFolderId.PRIVATE, DefaultFolderId.SHARED]
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
