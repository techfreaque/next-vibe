/**
 * Favorite Detail Widget — domain enrichment for /favorites/ paths
 *
 * Renders the actual favorite view using EndpointsPage.
 */

"use client";

import { useMemo } from "react";

import favoriteDefinitions from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
