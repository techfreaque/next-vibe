/**
 * Execution History Component
 * Displays cron task execution history with filtering and pagination
 */

"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div, Span } from "next-vibe-ui/ui";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { H4, P } from "next-vibe-ui/ui";
import type React from "react";

import type { CronHistoryResponseOutput } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/history/definition";
import type { CronHistoryEndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/history/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ExecutionHistoryProps {
  historyEndpoint: CronHistoryEndpointReturn;
  isLoading: boolean;
  locale: CountryLanguage;
}

type CronExecutionType = CronHistoryResponseOutput["executions"][number];
type CronTaskStatusType = CronExecutionType["status"];

const getStatusIcon = (status: CronTaskStatusType): React.ReactElement => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "TIMEOUT":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "RUNNING":
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case "SKIPPED":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

const STATUS_COLORS: Record<CronTaskStatusType, string> = {
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  TIMEOUT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  RUNNING: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  CANCELLED:
    "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
  SKIPPED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  STOPPED: "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
  ERROR: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  BLOCKED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  SCHEDULED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
};

const getStatusColor = (status: CronTaskStatusType): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.PENDING;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export function ExecutionHistory({
  historyEndpoint,
  isLoading,
  locale,
}: ExecutionHistoryProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const apiResponse = historyEndpoint.read.response;
  const history: CronExecutionType[] = apiResponse?.success
    ? apiResponse.data.executions
    : [];
  const totalExecutions = apiResponse?.success
    ? apiResponse.data.totalCount
    : 0;

  const queryLoading = historyEndpoint.read.isLoading || false;

  // Get current form values for pagination display
  const currentOffset = parseInt(
    historyEndpoint.read.form?.getValues("offset") || "0",
  );
  const currentLimit = parseInt(
    historyEndpoint.read.form?.getValues("limit") || "20",
  );

  const getDuration = (execution: CronExecutionType): string => {
    if (execution.durationMs) {
      return `${execution.durationMs}ms`;
    }
    if (execution.startedAt && execution.completedAt) {
      const start = new Date(execution.startedAt);
      const end = new Date(execution.completedAt);
      return `${end.getTime() - start.getTime()}ms`;
    }
    return t("app.admin.cron.cronErrors.admin.interface.noResults");
  };

  const handleSubmit = (): void => {
    historyEndpoint.read.refetch();
  };

  const handleClearFilters = (): void => {
    historyEndpoint.read.form?.reset({
      taskId: undefined,
      taskName: undefined,
      status: undefined,
      priority: undefined,
      startDate: undefined,
      endDate: undefined,
      limit: "20",
      offset: "0",
    });
  };

  return (
    <Card>
      <CardHeader>
        <Div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t("app.admin.cron.executionHistory.titleWithCount", {
              count: history.length,
            })}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={historyEndpoint.read.refetch}
            disabled={isLoading || queryLoading}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4",
                (isLoading || queryLoading) && "animate-spin",
              )}
            />
          </Button>
        </Div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <Div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("app.admin.cron.cronErrors.admin.interface.filter")}:
            </Span>
          </Div>

          <Form
            form={historyEndpoint.read.form}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Task Name Search */}
              <EndpointFormField
                name="taskName"
                config={{
                  type: "text",
                  label: undefined,
                  placeholder:
                    "app.admin.cron.cronErrors.admin.interface.executionHistory.searchPlaceholder",
                }}
                control={historyEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Status Filter */}
              <EndpointFormField
                name="status"
                config={{
                  type: "text",
                  label: undefined,
                  placeholder:
                    "app.admin.cron.cronErrors.admin.interface.executionHistory.statusFilter",
                }}
                control={historyEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Start Date */}
              <EndpointFormField
                name="startDate"
                config={{
                  type: "date",
                  label: undefined,
                  placeholder:
                    "app.admin.cron.cronErrors.admin.interface.executionHistory.startDate",
                }}
                control={historyEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* End Date */}
              <EndpointFormField
                name="endDate"
                config={{
                  type: "date",
                  label: undefined,
                  placeholder:
                    "app.admin.cron.cronErrors.admin.interface.executionHistory.endDate",
                }}
                control={historyEndpoint.read.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </Div>

            <Div className="flex items-center justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                {t("app.admin.cron.cronErrors.admin.interface.clear")}
              </Button>
            </Div>

            {/* Form Alert for any filter errors */}
            <FormAlert alert={historyEndpoint.alert} />
          </Form>
        </Div>

        {/* Execution List */}
        <Div className="space-y-3">
          {history.length === 0 ? (
            <Div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {queryLoading ? (
                <Div className="flex items-center justify-center">
                  <Div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 mr-2" />
                  {t(
                    "app.admin.cron.cronErrors.admin.interface.executionHistory.loadingHistory",
                  )}
                </Div>
              ) : (
                t(
                  "app.admin.cron.cronErrors.admin.interface.executionHistory.noHistory",
                )
              )}
            </Div>
          ) : (
            history.map((execution) => (
              <Div
                key={execution.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Div className="flex items-center justify-between">
                  <Div className="flex items-center space-x-4">
                    {getStatusIcon(execution.status)}
                    <Div>
                      <H4 className="font-medium text-gray-900 dark:text-gray-100">
                        {execution.taskName}
                      </H4>
                      <P className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "app.admin.cron.cronErrors.admin.interface.executionHistory.started",
                        )}
                        : {formatDate(execution.startedAt)}
                      </P>
                    </Div>
                  </Div>

                  <Div className="flex items-center space-x-4">
                    <Div className="text-right">
                      <Badge className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                      <P className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t(
                          "app.admin.cron.cronErrors.admin.interface.executionHistory.duration",
                        )}
                        : {getDuration(execution)}
                      </P>
                    </Div>
                  </Div>
                </Div>

                {execution.completedAt && (
                  <Div className="mt-2">
                    <P className="text-sm text-gray-500 dark:text-gray-400">
                      {t(
                        "app.admin.cron.cronErrors.admin.interface.executionHistory.completed",
                      )}
                      : {formatDate(execution.completedAt)}
                    </P>
                  </Div>
                )}

                {execution.error && (
                  <Div className="mt-3">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        {t(
                          "app.admin.cron.cronErrors.admin.interface.executionHistory.errorDetails",
                        )}
                      </summary>
                      <Div className="text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 mt-2 overflow-x-auto max-h-40 text-red-800 dark:text-red-300">
                        <Div className="mb-2 font-medium">
                          {execution.error.message}
                        </Div>
                        {execution.error.errorType && (
                          <Div className="text-xs opacity-75">
                            {t("app.admin.cron.executionHistory.errorType")}:{" "}
                            {execution.error.errorType}
                          </Div>
                        )}
                      </Div>
                    </details>
                  </Div>
                )}
              </Div>
            ))
          )}
        </Div>

        {/* Pagination */}
        {totalExecutions > currentLimit && (
          <Div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <P className="text-sm text-gray-500 dark:text-gray-400">
              {t("app.admin.cron.executionHistory.pagination", {
                from: currentOffset + 1,
                to: Math.min(currentOffset + currentLimit, totalExecutions),
                total: totalExecutions,
              })}
            </P>
            <Div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOffset = Math.max(0, currentOffset - currentLimit);
                  historyEndpoint.read.form?.setValue(
                    "offset",
                    newOffset.toString(),
                  );
                }}
                disabled={currentOffset === 0}
              >
                {t("app.admin.cron.buttons.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOffset = currentOffset + currentLimit;
                  historyEndpoint.read.form?.setValue(
                    "offset",
                    newOffset.toString(),
                  );
                }}
                disabled={!(apiResponse?.success && apiResponse.data.hasMore)}
              >
                {t("app.admin.cron.buttons.next")}
              </Button>
            </Div>
          </Div>
        )}
      </CardContent>
    </Card>
  );
}
