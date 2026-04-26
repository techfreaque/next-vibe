/**
 * Domain Enrichment - renders a domain-specific widget for known Cortex mounts
 *
 * When a Cortex operation targets a path under a known mount (e.g., /memories/,
 * /skills/), this component renders a domain-aware detail card below the
 * generic Cortex operation summary.
 *
 * Uses the mount widget registry to discover which widget to render.
 * Falls back to nothing for unknown paths (e.g., /documents/).
 */

"use client";

import React, { Suspense, useMemo } from "react";

import { useWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { scopedTranslation } from "../i18n";
import { findMountWidget } from "../mounts/widget-registry";

interface DomainEnrichmentProps {
  responsePath: string;
}

export function DomainEnrichment({
  responsePath,
}: DomainEnrichmentProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const match = useMemo(() => findMountWidget(responsePath), [responsePath]);

  if (!match) {
    return null;
  }

  const { t } = scopedTranslation.scopedT(locale);
  const mountLabel = t(match.config.translationKey);

  const LazyWidget = useMemo(
    () => React.lazy(match.config.loadWidget),
    [match.config],
  );

  return (
    <Suspense fallback={null}>
      <LazyWidget
        path={responsePath}
        label={match.label}
        mountLabel={mountLabel}
      />
    </Suspense>
  );
}
