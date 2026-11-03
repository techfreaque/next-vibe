/**
 * Web Icon component.
 *
 * Split out of icons.tsx so the terminal build can swap ONLY the component via
 * icon-component.cli.tsx, while the registry and category data in icons.tsx
 * stay shared. Widgets keep importing { Icon } from "./icons" and never branch
 * on platform themselves.
 */

import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { cn } from "../../../_shared/cn";
import type { IconComponent, IconKey, IconLibraryName } from "./icons";
import { ICON_REGISTRY, loadIcon } from "./icons";

/**
 * Fallback component shown while icons are loading
 */
const IconLoadingFallback: React.FC<{ className?: string }> = ({
  className,
}) => <Span className={cn("inline-block w-4 h-4", className)} />;

/** Shown when the library has no export for the registered component name */
const MissingIconFallback: IconComponent = ({
  className: cls,
}: {
  className?: string;
}): JSX.Element => (
  /* oxlint-disable-next-line i18n/no-literal-string -- Fallback indicator */
  <Span className={cls}>??</Span>
);

/** Shown when loading the icon library fails */
const ErrorIconFallback: IconComponent = ({
  className: cls,
}: {
  className?: string;
}): JSX.Element => (
  /* oxlint-disable-next-line i18n/no-literal-string -- Error indicator */
  <Span className={cls}>!</Span>
);

/**
 * THE Icon component - use this everywhere
 * Handles lazy loading automatically
 *
 * @example
 * ```tsx
 * <Icon icon="folder" className="w-4 h-4" />
 * <Icon icon="🎨" className="w-4 h-4" />
 * ```
 */
export const Icon: React.FC<{
  icon: IconKey;
  className?: string;
}> = ({ icon, className }) => {
  // Loaded component tagged with the registry name it was loaded for, so a
  // stale result is never shown after the icon prop changes.
  const [loaded, setLoaded] = useState<{
    name: string;
    Component: IconComponent;
  } | null>(null);

  const registryValue = ICON_REGISTRY[icon];

  // Load icon component from library
  useEffect(() => {
    // Only lazy load if it's a string component name from registry
    if (typeof registryValue !== "string") {
      return;
    }

    (async (): Promise<void> => {
      try {
        const iconModule = await loadIcon(registryValue);
        const IconComp = iconModule[registryValue as IconLibraryName];
        setLoaded({
          name: registryValue,
          Component: IconComp
            ? (IconComp as IconComponent)
            : MissingIconFallback,
        });
      } catch {
        setLoaded({ name: registryValue, Component: ErrorIconFallback });
      }
    })();
  }, [registryValue]);

  // Handle component from registry (emoji or special)
  if (registryValue && typeof registryValue !== "string") {
    const IconComponent = registryValue;
    return <IconComponent className={className} />;
  }

  // Handle lazy-loaded icon
  const LoadedIcon =
    loaded !== null && loaded.name === registryValue ? loaded.Component : null;
  if (LoadedIcon) {
    return <LoadedIcon className={className} />;
  }

  // Loading / fallback
  return <IconLoadingFallback className={className} />;
};
