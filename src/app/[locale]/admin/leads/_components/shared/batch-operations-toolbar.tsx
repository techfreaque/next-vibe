/**
 * Batch Operations Toolbar Component
 * Provides batch action controls for selected leads
 */

"use client";

import { Users } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import React from "react";

import type {
  BatchOperationScopeValues,
  EmailCampaignStageValues,
  LeadSourceValues,
  LeadStatusValues,
} from "@/app/api/[locale]/v1/core/leads/enum";
import {
  BatchOperationScope,
  EmailCampaignStageOptions,
  LeadSourceOptions,
  LeadStatusOptions,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface BatchOperationsToolbarProps {
  locale: CountryLanguage;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onBatchUpdate: (
    updates: {
      status?: typeof LeadStatusValues;
      currentCampaignStage?: typeof EmailCampaignStageValues;
      source?: typeof LeadSourceValues;
      notes?: string;
    },
    scope: typeof BatchOperationScopeValues,
  ) => void;
  onBatchDelete: (scope: typeof BatchOperationScopeValues) => void;
  isLoading?: boolean;
  resetTrigger?: number; // Used to trigger state reset
}

export function BatchOperationsToolbar({
  locale,
  totalCount,
  currentPage,
  pageSize,
  onBatchUpdate,
  onBatchDelete,
  isLoading = false,
  resetTrigger = 0,
}: BatchOperationsToolbarProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [selectedAction, setSelectedAction] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [operationScope, setOperationScope] = React.useState<
    typeof BatchOperationScopeValues
  >(BatchOperationScope.ALL_PAGES);

  // Reset state when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger > 0) {
      setSelectedAction("");
      setSelectedValue("");
      setOperationScope(BatchOperationScope.ALL_PAGES);
    }
  }, [resetTrigger]);

  const handleApplyAction = (): void => {
    if (!selectedAction) {
      return;
    }

    if (selectedAction === "delete") {
      onBatchDelete(operationScope);
      // Don't reset the action immediately - let the user see the result
      return;
    }

    if (!selectedValue) {
      return;
    }

    const updates: {
      status?: typeof LeadStatusValues | undefined;
      currentCampaignStage?: typeof EmailCampaignStageValues;
      source?: typeof LeadSourceValues;
      notes?: string;
    } = {};

    if (selectedAction === "status") {
      updates.status = selectedValue as typeof LeadStatusValues;
    } else if (selectedAction === "currentCampaignStage") {
      updates.currentCampaignStage =
        selectedValue as typeof EmailCampaignStageValues;
    } else if (selectedAction === "source") {
      updates.source = selectedValue as typeof LeadSourceValues;
    } else if (selectedAction === "notes") {
      updates.notes = selectedValue;
    }

    onBatchUpdate(updates, operationScope);
    // Don't reset the action immediately - let the user see the result
  };

  const getActionOptions = (): Array<{ value: string; label: string }> => {
    switch (selectedAction) {
      case "status":
        return LeadStatusOptions;
      case "currentCampaignStage":
        return EmailCampaignStageOptions;
      case "source":
        return LeadSourceOptions;
      default:
        return [];
    }
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Filter info and controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {operationScope === BatchOperationScope.CURRENT_PAGE
                  ? t("app.admin.leads.leads.admin.batch.current_page_count", {
                      count: Math.min(pageSize, totalCount),
                      page: currentPage,
                    })
                  : t("app.admin.leads.leads.admin.batch.filter_count", {
                      total: totalCount,
                    })}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={operationScope}
                onValueChange={(value: typeof BatchOperationScopeValues) =>
                  setOperationScope(value)
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BatchOperationScope.CURRENT_PAGE}>
                    {t("app.admin.leads.leads.admin.batch.scope_current_page")}
                  </SelectItem>
                  <SelectItem value={BatchOperationScope.ALL_PAGES}>
                    {t("app.admin.leads.leads.admin.batch.scope_all_pages")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Batch actions */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedAction}
              onValueChange={setSelectedAction}
              disabled={isLoading}
            >
              <SelectTrigger className="w-40">
                <SelectValue
                  placeholder={t(
                    "app.admin.leads.leads.admin.batch.select_action",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">
                  {t("app.admin.leads.leads.admin.batch.actions.update_status")}
                </SelectItem>
                <SelectItem value="currentCampaignStage">
                  {t("app.admin.leads.leads.admin.batch.actions.update_stage")}
                </SelectItem>
                <SelectItem value="source">
                  {t("app.admin.leads.leads.admin.batch.actions.update_source")}
                </SelectItem>
                <SelectItem value="delete">
                  {t("app.admin.leads.leads.admin.batch.actions.delete")}
                </SelectItem>
              </SelectContent>
            </Select>

            {selectedAction && selectedAction !== "delete" && (
              <Select
                value={selectedValue}
                onValueChange={setSelectedValue}
                disabled={isLoading}
              >
                <SelectTrigger className="w-40">
                  <SelectValue
                    placeholder={t(
                      "app.admin.leads.leads.admin.batch.select_value",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {getActionOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={handleApplyAction}
              disabled={
                !selectedAction ||
                (selectedAction !== "delete" && !selectedValue) ||
                isLoading
              }
              size="sm"
              variant={selectedAction === "delete" ? "destructive" : "default"}
            >
              {selectedAction === "delete"
                ? t("app.admin.leads.leads.admin.batch.delete")
                : t("app.admin.leads.leads.admin.batch.apply")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
