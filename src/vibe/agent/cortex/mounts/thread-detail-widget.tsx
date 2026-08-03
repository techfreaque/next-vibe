/**
 * Thread Detail Widget - domain enrichment for /threads/ paths
 *
 * Renders the actual messages widget for the thread using EndpointsPage,
 * so the full thread view (read-only) appears below the Cortex file content.
 */

"use client";

import { isDefaultFolderId } from "../../chat/config";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import messagesDefinitions from "../../chat/threads/[threadId]/messages/definition";
import {
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { useMemo } from "react";

interface ThreadDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

interface ThreadPathInfo {
  threadId: string;
  rootFolderId: DefaultFolderId;
}

/**
 * Extract thread info from a cortex path like:
 *   /threads/private/abc123-uuid.md
 *   /threads/private/folder-id/abc123-uuid.md
 * segments: ["threads", rootFolder, ...rest, threadId.md]
 */
function extractThreadInfo(path: string): ThreadPathInfo | null {
  const segments = path.split("/").filter(Boolean);
  // Need at least: threads / rootFolder / threadId.md
  if (segments.length < 3) {
    return null;
  }
  const rootFolderSegment = segments[1];
  const last = segments[segments.length - 1];
  if (!last) {
    return null;
  }
  // Filenames are "<slug>-<threadId>.md" (see mounts/threads.ts's slugify) -
  // the UUID is the tail, not the whole segment. Anchor to the tail (before
  // the optional .md) the same way readThreadPath does server-side, so a
  // slugified title (e.g. "Neuer Chat" -> "neuer-chat") never leaks into the
  // extracted threadId.
  const uuidMatch = last.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\.md)?$/i,
  );
  const threadId = uuidMatch?.[1];
  if (!threadId) {
    return null;
  }
  // Validate rootFolder is a known DefaultFolderId
  const rootFolderId = isDefaultFolderId(rootFolderSegment)
    ? rootFolderSegment
    : DefaultFolderId.PRIVATE;

  return { threadId, rootFolderId };
}

export function ThreadDetailWidget({
  path,
}: ThreadDetailWidgetProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();

  const info = useMemo(() => extractThreadInfo(path), [path]);

  if (!info) {
    return null;
  }

  return (
    <EndpointsPage
      endpoint={messagesDefinitions}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={{
        read: {
          urlPathParams: { threadId: info.threadId },
          initialState: { rootFolderId: info.rootFolderId },
        },
        create: {
          urlPathParams: { threadId: info.threadId },
        },
      }}
    />
  );
}
