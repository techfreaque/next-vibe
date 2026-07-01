/**
 * SSH Connection Mounts Widget
 * Shared widget for list, create, and detail endpoints.
 */

"use client";

import { Methods } from "next-vibe/core/definition/enums";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { EmptyBlock } from "next-vibe/ui/web/ui/empty-block";
import { FolderOpen } from "next-vibe/ui/web/ui/icons/FolderOpen";
import { FolderPlus } from "next-vibe/ui/web/ui/icons/FolderPlus";
import { Pencil } from "next-vibe/ui/web/ui/icons/Pencil";
import { Trash2 } from "next-vibe/ui/web/ui/icons/Trash2";
import { ListItem } from "next-vibe/ui/web/ui/list-item";
import { LoadingBlock } from "next-vibe/ui/web/ui/loading-block";
import { Span } from "next-vibe/ui/web/ui/span";
import { WidgetHeader } from "next-vibe/ui/web/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/web/ui/widget-shell";
import {
  useWidgetEndpoint,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";
import { useCallback } from "react";

import type detailDefinition from "./[mountId]/definition";
import type createDefinition from "./create/definition";
import type listDefinition from "./list/definition";

// ─── Mounts List ──────────────────────────────────────────────────────────────

export function MountsListWidget(): JSX.Element {
  const data = useWidgetValue<typeof listDefinition.GET>();
  const t = useWidgetTranslation<typeof listDefinition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const form = useWidgetForm<typeof listDefinition.GET>();
  const connectionId = form.watch("id") as string | undefined;

  const handleAdd = useCallback(
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      void (async (): Promise<void> => {
        const def = await import("./create/definition");
        navigate(def.default.POST, {
          urlPathParams: { id: connectionId ?? "" },
        });
      })();
    },
    [navigate, connectionId],
  );

  const handleAddClick = useCallback((): void => {
    void (async (): Promise<void> => {
      const def = await import("./create/definition");
      navigate(def.default.POST, {
        urlPathParams: { id: connectionId ?? "" },
      });
    })();
  }, [navigate, connectionId]);

  const handleEdit = useCallback(
    (mountId: string) =>
      (e: ButtonMouseEvent): void => {
        e.stopPropagation();
        void (async (): Promise<void> => {
          const def = await import("./[mountId]/definition");
          navigate(def.default.PATCH, {
            urlPathParams: { id: connectionId ?? "", mountId },
          });
        })();
      },
    [navigate, connectionId],
  );

  const handleDelete = useCallback(
    (mountId: string) =>
      (e: ButtonMouseEvent): void => {
        e.stopPropagation();
        void (async (): Promise<void> => {
          const def = await import("./[mountId]/definition");
          navigate(def.default.DELETE, {
            urlPathParams: { id: connectionId ?? "", mountId },
            renderInModal: true,
            popNavigationOnSuccess: 1,
          });
        })();
      },
    [navigate, connectionId],
  );

  if (!data) {
    return (
      <WidgetShell>
        <LoadingBlock />
      </WidgetShell>
    );
  }

  const mounts = data.mounts ?? [];

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("list.title")}
        actions={
          <Button size="sm" variant="outline" onClick={handleAdd}>
            <FolderPlus className="mr-1 h-4 w-4" />
            {t("widget.addMount")}
          </Button>
        }
      />
      {mounts.length === 0 ? (
        <EmptyBlock
          icon={<FolderOpen className="h-8 w-8" />}
          title={t("widget.noMounts")}
          message={t("widget.noMountsHint")}
          action={{ label: t("widget.addMount"), onClick: handleAddClick }}
        />
      ) : (
        <Div className="flex flex-col gap-1">
          {mounts.map((mount) => (
            <ListItem
              key={mount.id}
              title={`${mount.name}/`}
              subtitle={mount.path}
              badges={
                mount.isDefault ? (
                  <Badge variant="secondary" className="text-xs">
                    {t("widget.defaultBadge")}
                  </Badge>
                ) : undefined
              }
              meta={
                <Span className="text-muted-foreground text-xs font-mono">
                  {t("widget.cortexPath")}: {t("widget.cortexPathPrefix")}
                  {mount.name}/
                </Span>
              }
              actions={
                <Div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleEdit(mount.id)}
                    title="Edit mount"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDelete(mount.id)}
                    title="Remove mount"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </Div>
              }
            />
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}

// ─── Mount Create ─────────────────────────────────────────────────────────────

export function MountCreateWidget(_props: {
  field: (typeof createDefinition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof createDefinition.POST>();
  const children = _props.field.children;

  return (
    <WidgetShell>
      <WidgetHeader title={t("create.title")} />
      <Div className="flex flex-col gap-4 px-6 py-4">
        <FormAlertWidget field={{}} />
        <TextFieldWidget fieldName="path" field={children.path} />
        <BooleanFieldWidget fieldName="isDefault" field={children.isDefault} />
        <SubmitButtonWidget field={{}} />
      </Div>
    </WidgetShell>
  );
}

// ─── Mount Detail (GET/PATCH/DELETE) ─────────────────────────────────────────

export function MountDetailWidget(_props: {
  field: (typeof detailDefinition.PATCH)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof detailDefinition.PATCH>();
  const children = _props.field.children;
  const endpoint = useWidgetEndpoint();
  const isDeleteMode = endpoint.method === Methods.DELETE;
  const data = useWidgetValue<typeof detailDefinition.GET>();
  const form = useWidgetForm<typeof detailDefinition.PATCH>();
  const watchedPath = form.watch("path") as string | undefined;
  const displayPath = data?.path ?? watchedPath;
  const displayName = displayPath
    ? displayPath.split("/").filter(Boolean).at(-1)
    : undefined;

  if (isDeleteMode) {
    return (
      <WidgetShell>
        <Div className="flex flex-col gap-4 px-6 py-6">
          <Span>{t("detail.widget.confirmDelete")}</Span>
          <FormAlertWidget field={{}} />
          <Div className="flex flex-row gap-2">
            <SubmitButtonWidget field={{ variant: "destructive" }} />
          </Div>
        </Div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell>
      <WidgetHeader title={t("detail.titlePatch")} />
      <Div className="flex flex-col gap-4 px-6 py-4">
        <FormAlertWidget field={{}} />
        {displayName && (
          <Div className="flex flex-col gap-1 rounded-md bg-muted/40 p-3 text-sm">
            <Span className="text-muted-foreground">
              {t("widget.cortexPath")}:{" "}
              <Span className="font-mono">
                {t("widget.cortexPathPrefix")}
                {displayName}/
              </Span>
            </Span>
            {displayPath && (
              <Span className="text-muted-foreground font-mono text-xs">
                {t("widget.pathArrow")} {displayPath}
              </Span>
            )}
          </Div>
        )}
        <TextFieldWidget fieldName="path" field={children.path} />
        <BooleanFieldWidget fieldName="isDefault" field={children.isDefault} />
        <SubmitButtonWidget field={{}} />
      </Div>
    </WidgetShell>
  );
}
