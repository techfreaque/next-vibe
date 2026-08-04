/**
 * Web Icon component.
 *
 * Split out of icons.tsx so the terminal build can swap ONLY the component via
 * icon-component.cli.tsx, while the registry and category data in icons.tsx
 * stay shared. Widgets keep importing { Icon } from "./icons" and never branch
 * on platform themselves.
 */

import { Span } from "next-vibe/ui/ui/span";
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
  const [LoadedIcon, setLoadedIcon] = useState<IconComponent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registryValue = ICON_REGISTRY[icon];

  // Load icon component from library
  useEffect(() => {
    // Only lazy load if it's a string component name from registry
    if (typeof registryValue !== "string") {
      setLoadedIcon(null);
      return;
    }

    setIsLoading(true);
    setLoadedIcon(null);

    (async (): Promise<void> => {
      try {
        const iconModule = await loadIcon(registryValue);
        const IconComp = iconModule[registryValue as IconLibraryName];

        if (!IconComp) {
          setLoadedIcon(
            () =>
              ({ className: cls }: { className?: string }): JSX.Element =>
                (
                  /* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Fallback indicator */
                  <Span className={cls}>??</Span>
                ),
          );
        } else {
          setLoadedIcon(() => IconComp as IconComponent);
        }
      } catch {
        // Error fallback
        setLoadedIcon(
          () =>
            ({ className: cls }: { className?: string }): JSX.Element =>
              (
                /* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Error indicator */
                <Span className={cls}>!</Span>
              ),
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [registryValue]);

  // Handle component from registry (emoji or special)
  if (registryValue && typeof registryValue !== "string") {
    const IconComponent = registryValue;
    return <IconComponent className={className} />;
  }

  // Handle lazy-loaded icon
  if (LoadedIcon) {
    return <LoadedIcon className={className} />;
  }

  // Loading state
  if (isLoading) {
    return <IconLoadingFallback className={className} />;
  }

  // Fallback
  return <IconLoadingFallback className={className} />;
};
