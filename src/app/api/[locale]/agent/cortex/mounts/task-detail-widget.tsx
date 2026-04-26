/**
 * Task Detail Widget - domain enrichment for /tasks/ paths
 *
 * Renders the actual cron task view using EndpointsPage.
 */

"use client";

import { useMemo } from "react";

import cronTaskDefinitions from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

interface TaskDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

function extractTaskId(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  // /tasks/<taskId>.md
  if (segments.length < 2) {
    return null;
  }
  return segments[1].replace(/\.md$/, "") || null;
}

export function TaskDetailWidget({
  path,
}: TaskDetailWidgetProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const user = useWidgetUser();

  const id = useMemo(() => extractTaskId(path), [path]);

  if (!id) {
    return null;
  }

  return (
    <EndpointsPage
      endpoint={cronTaskDefinitions}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          urlPathParams: { id },
        },
        create: {
          urlPathParams: { id },
        },
        delete: {
          urlPathParams: { id },
        },
      }}
    />
  );
}
