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

import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";
import React, { Suspense, useMemo } from "react";

import { scopedTranslation } from "../i18n";
import type { MountWidgetConfig } from "../mounts/widget-registry";
import {
  findMountWidget,
  MOUNT_WIDGET_REGISTRY,
} from "../mounts/widget-registry";

/**
 * Lazy widget per mount config, created once at module scope.
 * React.lazy only fetches the chunk on first render, so this is free until used.
 */
type MountWidgetComponent = Awaited<
  ReturnType<MountWidgetConfig["loadWidget"]>
>["default"];

const LAZY_MOUNT_WIDGETS = new Map<
  MountWidgetConfig,
  React.LazyExoticComponent<MountWidgetComponent>
>(
  Object.values(MOUNT_WIDGET_REGISTRY).map((config) => [
    config,
    React.lazy(config.loadWidget),
  ]),
);

interface DomainEnrichmentProps {
  responsePath: string | undefined;
}

export function DomainEnrichment({
  responsePath,
}: DomainEnrichmentProps): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const match = useMemo(
    () => (responsePath ? findMountWidget(responsePath) : null),
    [responsePath],
  );
  const LazyWidget = match ? LAZY_MOUNT_WIDGETS.get(match.config) : undefined;

  if (!match || !LazyWidget || !responsePath) {
    return null;
  }

  const { t } = scopedTranslation.scopedT(locale);
  const mountLabel = t(match.config.translationKey);

  return (
    <Suspense fallback={null}>
      {React.createElement(LazyWidget, {
        path: responsePath,
        label: match.label,
        mountLabel,
      })}
    </Suspense>
  );
}
