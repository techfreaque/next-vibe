/**
 * Skill Detail Widget — domain enrichment for /skills/ paths
 *
 * Renders the actual skill view widget using EndpointsPage,
 * so the full skill detail appears below the Cortex file content.
 */

"use client";

import { useMemo } from "react";

import skillDefinitions from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

interface SkillDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

/**
 * Extract the skill id from a cortex path like:
 *   /skills/my-skill-slug
 *   /skills/abc123-uuid.md
 * Returns null if the path doesn't contain a valid skill segment.
 */
function extractSkillId(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  // segments[0] = "skills", segments[1] = skillId or slug
  if (segments.length < 2) {
    return null;
  }
  return segments[1].replace(/\.md$/, "") || null;
}

export function SkillDetailWidget({
  path,
}: SkillDetailWidgetProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const user = useWidgetUser();

  const id = useMemo(() => extractSkillId(path), [path]);

  if (!id) {
    return null;
  }

  return (
    <EndpointsPage
      endpoint={skillDefinitions}
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
