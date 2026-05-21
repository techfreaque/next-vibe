"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { BarChart2 } from "next-vibe-ui/ui/icons/BarChart2";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { PlusCircle } from "next-vibe-ui/ui/icons/PlusCircle";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";

import definition from "./definition";
import type {
  LimitsCreateResponseOutput,
  LimitsListResponseOutput,
  LimitsUpdateResponseOutput,
} from "./definition";
import type { LimitsListT } from "./i18n";

type LimitItem = LimitsListResponseOutput["limits"][number];

function LimitRow({
  limit,
  compact,
  t,
}: {
  limit: LimitItem;
  compact: boolean;
  t: LimitsListT;
}): React.JSX.Element {
  const usagePercent =
    limit.quantity > 0
      ? Math.round((limit.used / limit.quantity) * 100)
      : 0;

  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        <Span className="font-semibold">{limit.resourceType}</Span>
        <Span className="ml-2">{`used:${limit.used}/${limit.quantity}`}</Span>
        {limit.orgResourceId !== null && limit.orgResourceId !== undefined && (
          <Span className="text-muted-foreground ml-2">{`org:${limit.orgResourceId}`}</Span>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <BarChart2 className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{limit.resourceType}</Span>
          {limit.orgResourceId !== null && limit.orgResourceId !== undefined && (
            <Span className="text-xs text-muted-foreground font-mono">
              {limit.orgResourceId}
            </Span>
          )}
        </Div>
        <Div className="mt-1 flex items-center gap-2">
          <Span
            className={
              usagePercent >= 90
                ? "text-xs font-mono text-destructive font-semibold"
                : usagePercent >= 70
                  ? "text-xs font-mono text-warning font-semibold"
                  : "text-xs font-mono text-muted-foreground"
            }
          >
            {limit.used}/{limit.quantity} ({usagePercent}%)
          </Span>
        </Div>
      </Div>

      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        {limit.targetOrganization !== null &&
          limit.targetOrganization !== undefined && (
            <Span className="text-xs text-muted-foreground font-mono">
              {limit.targetOrganization}
            </Span>
          )}
        {limit.grantingOrganization !== null &&
          limit.grantingOrganization !== undefined && (
            <Span className="text-xs text-muted-foreground/60 font-mono">
              {`via ${limit.grantingOrganization}`}
            </Span>
          )}
      </Div>
    </Div>
  );
}

function LimitResultRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span className="text-sm font-medium font-mono">{value}</Span>
    </Div>
  );
}

export function LimitsListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop, push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const limits = data?.limits ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      navigate(definition.POST, {});
    })();
  }, [navigate]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({limits.length}/{total})
          {isMcp && ` — use page/pageSize to paginate`}
        </Div>
        {limits.length === 0 ? (
          <Div className="text-muted-foreground">{t("get.widget.noItemsFound")}</Div>
        ) : (
          limits.map((limit, idx) => (
            <LimitRow key={idx} limit={limit} compact={true} t={t} />
          ))
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <BarChart2 className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCreate}
          title={t("post.title")}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("get.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : limits.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <BarChart2 className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noItemsFound")}</Span>
          </Div>
        ) : (
          limits.map((limit, idx) => (
            <LimitRow key={idx} limit={limit} compact={false} t={t} />
          ))
        )}
      </Div>
    </Div>
  );
}

export function LimitsCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const [resourceType, setResourceType] = useState("");
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [orgResourceId, setOrgResourceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.create
      ?.submit({
        resourceType: resourceType !== "" ? resourceType : undefined,
        quantity,
        orgResourceId: orgResourceId !== "" ? orgResourceId : undefined,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [endpointMutations, resourceType, quantity, orgResourceId]);

  if (isCompact && result) {
    const r = result as LimitsCreateResponseOutput;
    return (
      <Div className="font-mono text-sm p-2">
        {`created limit: ${r.resourceType} qty:${r.quantity} used:${r.used}`}
        {r.orgResourceId !== null && r.orgResourceId !== undefined
          ? ` org:${r.orgResourceId}`
          : ""}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PlusCircle className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">{t("post.title")}</Span>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <Label htmlFor="limit-resource-type">
              {t("post.resourceType.label")}
            </Label>
            <Input
              id="limit-resource-type"
              type="text"
              value={resourceType}
              onChange={(e) => {
                setResourceType(e.target.value);
              }}
              placeholder="DEVICE"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.resourceType.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="limit-quantity">{t("post.quantity.label")}</Label>
            <Input
              id="limit-quantity"
              type="number"
              value={quantity ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setQuantity(v !== "" ? Number(v) : undefined);
              }}
              placeholder="100"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.quantity.description")}
            </Span>
          </Div>

          <Div className="col-span-2 space-y-1.5">
            <Label htmlFor="limit-org-resource-id">
              {t("post.orgResourceId.label")}
            </Label>
            <Input
              id="limit-org-resource-id"
              type="text"
              value={orgResourceId}
              onChange={(e) => {
                setOrgResourceId(e.target.value);
              }}
              placeholder="exorde.connex.connectika"
            />
            <Span className="text-xs text-muted-foreground">
              {t("post.orgResourceId.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("post.submitButton.loadingText")}
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              {t("post.submitButton.label")}
            </>
          )}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success">
              {t("post.success.title")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <LimitResultRow
                label={t("get.response.limits.resourceType")}
                value={(result as LimitsCreateResponseOutput).resourceType}
              />
              <LimitResultRow
                label={t("get.response.limits.quantity")}
                value={String((result as LimitsCreateResponseOutput).quantity)}
              />
              {(result as LimitsCreateResponseOutput).orgResourceId !== null &&
                (result as LimitsCreateResponseOutput).orgResourceId !==
                  undefined && (
                  <LimitResultRow
                    label={t("get.response.limits.orgResourceId")}
                    value={
                      (result as LimitsCreateResponseOutput).orgResourceId ?? ""
                    }
                  />
                )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function LimitsUpdateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const result = useWidgetValue<typeof definition.PUT>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const [resourceType, setResourceType] = useState("");
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [orgResourceId, setOrgResourceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.update
      ?.submit({
        resourceType: resourceType !== "" ? resourceType : undefined,
        quantity,
        orgResourceId: orgResourceId !== "" ? orgResourceId : undefined,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [endpointMutations, resourceType, quantity, orgResourceId]);

  if (isCompact && result) {
    const r = result as LimitsUpdateResponseOutput;
    return (
      <Div className="font-mono text-sm p-2">
        {`updated limit: ${r.resourceType} qty:${r.quantity} used:${r.used}`}
        {r.orgResourceId !== null && r.orgResourceId !== undefined
          ? ` org:${r.orgResourceId}`
          : ""}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Save className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">{t("put.title")}</Span>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <Label htmlFor="update-resource-type">
              {t("put.resourceType.label")}
            </Label>
            <Input
              id="update-resource-type"
              type="text"
              value={resourceType}
              onChange={(e) => {
                setResourceType(e.target.value);
              }}
              placeholder="DEVICE"
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.resourceType.description")}
            </Span>
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="update-quantity">{t("put.quantity.label")}</Label>
            <Input
              id="update-quantity"
              type="number"
              value={quantity ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setQuantity(v !== "" ? Number(v) : undefined);
              }}
              placeholder="200"
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.quantity.description")}
            </Span>
          </Div>

          <Div className="col-span-2 space-y-1.5">
            <Label htmlFor="update-org-resource-id">
              {t("put.orgResourceId.label")}
            </Label>
            <Input
              id="update-org-resource-id"
              type="text"
              value={orgResourceId}
              onChange={(e) => {
                setOrgResourceId(e.target.value);
              }}
              placeholder="exorde.connex.connectika"
            />
            <Span className="text-xs text-muted-foreground">
              {t("put.orgResourceId.description")}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("put.submitButton.loadingText")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t("put.submitButton.label")}
            </>
          )}
        </Button>

        {result !== null && result !== undefined && (
          <Div className="rounded-xl border bg-card p-4 space-y-3">
            <Span className="font-semibold text-sm text-success">
              {t("put.success.title")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <LimitResultRow
                label={t("get.response.limits.resourceType")}
                value={(result as LimitsUpdateResponseOutput).resourceType}
              />
              <LimitResultRow
                label={t("get.response.limits.quantity")}
                value={String((result as LimitsUpdateResponseOutput).quantity)}
              />
              <LimitResultRow
                label={t("get.response.limits.used")}
                value={String((result as LimitsUpdateResponseOutput).used)}
              />
              {(result as LimitsUpdateResponseOutput).orgResourceId !== null &&
                (result as LimitsUpdateResponseOutput).orgResourceId !==
                  undefined && (
                  <LimitResultRow
                    label={t("get.response.limits.orgResourceId")}
                    value={
                      (result as LimitsUpdateResponseOutput).orgResourceId ?? ""
                    }
                  />
                )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
