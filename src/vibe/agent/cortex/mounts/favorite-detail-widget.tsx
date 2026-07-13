/**
 * Favorite Detail Widget - domain enrichment for /favorites/ paths
 *
 * Renders the actual favorite view using EndpointsPage.
 */

"use client";

import favoriteDefinitions from "next-vibe/agent/skills/favorites/[id]/definition";
import {
  useWidgetLocale,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import { useMemo } from "react";

interface FavoriteDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

function extractFavoriteId(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  // /favorites/<slug-or-id>.md
  if (segments.length < 2) {
    return null;
  }
  return segments[1].replace(/\.md$/, "") || null;
}

export function FavoriteDetailWidget({
  path,
}: FavoriteDetailWidgetProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const user = useWidgetUser();

  const id = useMemo(() => extractFavoriteId(path), [path]);

  if (!id) {
    return null;
  }

  return (
    <EndpointsPage
      endpoint={favoriteDefinitions}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          urlPathParams: { id },
        },
        update: {
          urlPathParams: { id },
        },
        delete: {
          urlPathParams: { id },
        },
      }}
    />
  );
}
