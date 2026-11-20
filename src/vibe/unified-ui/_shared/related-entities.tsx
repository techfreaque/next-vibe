"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import type { JSX, ReactNode } from "react";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { permissionsRegistry } from "../../core/permissions/registry";
import { parseError } from "../../core/utils/parse-error";
import {
  useWidgetDisabled,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetUser,
} from "./use-widget-context";

interface RelatedEntityOptions<TEndpoint extends CreateApiEndpointAny> {
  urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
  data?: Partial<TEndpoint["types"]["RequestOutput"]>;
  renderInModal?: boolean;
  popNavigationOnSuccess?: number;
}

export function useRelatedEntityNavigation(): <
  TEndpoint extends CreateApiEndpointAny,
>(
  loadEndpoint: () => Promise<TEndpoint>,
  options?: RelatedEntityOptions<NoInfer<TEndpoint>>,
) => void {
  const { push } = useWidgetNavigation();
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const logger = useWidgetLogger();

  return (loadEndpoint, options) => {
    void loadEndpoint()
      .then((endpoint) => {
        if (
          permissionsRegistry.validateEndpointAccess(endpoint, user, platform)
            .allowed
        ) {
          push(endpoint, options);
        }
        return undefined;
      })
      .catch((error) => {
        logger.error("Failed to load related endpoint", parseError(error));
      });
  };
}

export interface RelatedEntityItem {
  id: string;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  meta?: ReactNode;
  action?: { label: string; ariaLabel?: string; onClick: () => void };
}

export function RelatedEntitiesPanel({
  title,
  subtitle,
  emptyTitle,
  emptyMessage,
  items,
}: {
  title: string;
  subtitle?: string;
  emptyTitle: string;
  emptyMessage?: string;
  items: readonly RelatedEntityItem[];
}): JSX.Element {
  const isInteractive = useWidgetIsInteractive();
  const disabled = useWidgetDisabled();

  return (
    <SectionGroup title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyBlock
          title={emptyTitle}
          message={emptyMessage}
          className="py-3"
        />
      ) : (
        <Div className="flex flex-col gap-2">
          {items.map(
            ({
              id,
              title: itemTitle,
              subtitle: itemSubtitle,
              badges,
              meta,
              action,
            }) => (
              <ListItem
                key={id}
                title={itemTitle}
                subtitle={itemSubtitle}
                badges={badges}
                className="min-w-0 [&_.truncate]:whitespace-normal [&_.truncate]:[overflow-wrap:anywhere]"
                meta={
                  <>
                    {meta}
                    {isInteractive && !disabled && action && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={action.ariaLabel}
                        className="h-auto min-h-9 max-w-full whitespace-normal text-start"
                        onClick={action.onClick}
                      >
                        {action.label}
                      </Button>
                    )}
                  </>
                }
              />
            ),
          )}
        </Div>
      )}
    </SectionGroup>
  );
}
