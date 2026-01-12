import type {
  ChatFolder,
  ChatThread,
} from "@/app/api/[locale]/agent/chat/hooks/store";

// Time grouping constants
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

/**
 * Get the ancestry chain of a folder (all parent folders up to root)
 * Returns an array of folder IDs from root to the given folder
 */
export function getFolderAncestry(
  folderId: string,
  folders: Record<string, ChatFolder>,
): string[] {
  const ancestry: string[] = [];
  let currentId: string | null = folderId;

  while (currentId !== null) {
    ancestry.unshift(currentId);
    const folder: ChatFolder | undefined = folders[currentId];
    currentId = folder?.parentId ?? null;
  }

  return ancestry;
}

/**
 * Determine if a folder should be expanded based on active thread/folder
 * Pure function - no state, just computation
 */
export function shouldFolderBeExpanded(
  folderId: string,
  activeThreadId: string | null,
  activeFolderId: string | null,
  folders: Record<string, ChatFolder>,
  threads: Record<string, ChatThread>,
): boolean {
  // Determine which folder should be the "target" (the one containing the active item)
  let targetFolderId: string | null = null;

  if (activeFolderId) {
    // If there's an active folder, that's our target
    targetFolderId = activeFolderId;
  } else if (activeThreadId) {
    // If there's an active thread, find its folder
    const thread = threads[activeThreadId];
    targetFolderId = thread?.folderId ?? null;
  }

  // If no target, nothing should be expanded
  if (!targetFolderId) {
    return false;
  }

  // Get the ancestry chain of the target folder
  const targetAncestry = getFolderAncestry(targetFolderId, folders);

  // This folder should be expanded if it's in the ancestry chain (but not the target itself)
  // The target folder itself should also be expanded to show its contents
  return targetAncestry.includes(folderId);
}

/**
 * Get Tailwind color classes for folder hover effects based on root folder color
 */
export function getFolderColorClasses(color: string | null): {
  hover: string;
  active: string;
  border: string;
} {
  switch (color) {
    case "sky":
      return {
        hover: "hover:bg-sky-500/8",
        active: "bg-sky-500/12",
        border: "border-sky-400",
      };
    case "teal":
      return {
        hover: "hover:bg-teal-500/8",
        active: "bg-teal-500/12",
        border: "border-teal-400",
      };
    case "amber":
      return {
        hover: "hover:bg-amber-500/8",
        active: "bg-amber-500/12",
        border: "border-amber-400",
      };
    case "purple":
      return {
        hover: "hover:bg-purple-500/8",
        active: "bg-purple-500/12",
        border: "border-purple-400",
      };
    case "zinc":
      return {
        hover: "hover:bg-zinc-500/8",
        active: "bg-zinc-500/12",
        border: "border-zinc-400",
      };
    default:
      return {
        hover: "hover:bg-accent/50",
        active: "bg-accent",
        border: "border-primary",
      };
  }
}

/**
 * Sort threads by pinned status (pinned first) and then by updatedAt (newest first)
 */
function sortThreads(threads: ChatThread[]): ChatThread[] {
  return (threads || []).toSorted((a, b) => {
    // Pinned threads come first
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    // Then sort by updatedAt (newest first)
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}

export function groupThreadsByTime(threads: ChatThread[]): {
  today: ChatThread[];
  lastWeek: ChatThread[];
  lastMonth: ChatThread[];
} {
  const now = Date.now();
  const today: ChatThread[] = [];
  const lastWeek: ChatThread[] = [];
  const lastMonth: ChatThread[] = [];

  threads.forEach((thread) => {
    const age = now - thread.updatedAt.getTime();
    if (age < DAY_MS) {
      today.push(thread);
    } else if (age < WEEK_MS) {
      lastWeek.push(thread);
    } else if (age < MONTH_MS) {
      lastMonth.push(thread);
    }
  });

  // Sort each group by pinned status and updatedAt
  return {
    today: sortThreads(today),
    lastWeek: sortThreads(lastWeek),
    lastMonth: sortThreads(lastMonth),
  };
}
