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
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type React from "react";

import type { CronExecutionType } from "@/app/api/[locale]/v1/core/system/tasks/cron/history/definition";
import { cronExecutionHistoryRequestSchema } from "@/app/api/[locale]/v1/core/system/tasks/cron/history/definition";
import type { CronHistoryEndpointReturn } from "@/app/api/[locale]/v1/core/system/tasks/cron/history/hooks";
import {
  CronTaskStatus,
  CronTaskStatusFilter,
  SortOrder,
} from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ExecutionHistoryProps {
  historyEndpoint: CronHistoryEndpointReturn;
  isLoading: boolean;
  locale: CountryLanguage;
}

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
  const totalExecutions =
    apiResponse && "totalExecutions" in apiResponse
      ? (apiResponse.totalExecutions as number)
      : 0;

  const totalPages =
    apiResponse && "totalPages" in apiResponse
      ? (apiResponse.totalPages as number)
      : 0;

  const queryLoading = historyEndpoint.read.isLoading || false;

  // Get current form values for pagination display
  const currentPage = historyEndpoint.read.form?.getValues("page") || 1;
  const currentLimit = historyEndpoint.read.form?.getValues("limit") || 20;

  const getStatusIcon = (status: CronTaskStatus): React.ReactElement => {
    switch (status) {
      case CronTaskStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case CronTaskStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case CronTaskStatus.TIMEOUT:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case CronTaskStatus.RUNNING:
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case CronTaskStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case CronTaskStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case CronTaskStatus.SKIPPED:
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const STATUS_COLORS = {
    [CronTaskStatus.COMPLETED]:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    [CronTaskStatus.FAILED]:
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    [CronTaskStatus.TIMEOUT]:
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    [CronTaskStatus.RUNNING]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    [CronTaskStatus.PENDING]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    [CronTaskStatus.CANCELLED]:
      "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
    [CronTaskStatus.SKIPPED]:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400",
  } as const;

  const getStatusColor = (status: CronTaskStatus): string => {
    return STATUS_COLORS[status] || STATUS_COLORS.default;
  };

  const getDuration = (execution: CronExecutionType): string => {
    if (execution.durationMs) {
      return `${execution.durationMs}ms`;
    }
    if (execution.startedAt && execution.completedAt) {
      const start = new Date(execution.startedAt);
      const end = new Date(execution.completedAt);
      return `${end.getTime() - start.getTime()}ms`;
    }
    return t("cronErrors.admin.interface.noResults");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleClearFilters = (): void => {
    historyEndpoint.read.form?.reset({
      taskId: undefined,
      taskName: undefined,
      status: CronTaskStatusFilter.ALL,
      isManual: undefined,
      isDryRun: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
      limit: 20,
      sortBy: CronExecutionSortBy.STARTED_AT,
      sortOrder: SortOrder.DESC,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t("admin.dashboard.cron.executionHistory.titleWithCount", {
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
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Form */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("cronErrors.admin.interface.filter")}:
            </span>
          </div>

          <Form
            form={historyEndpoint.read.form}
            onSubmit={() => {}}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Task Name Search */}
              <EndpointFormField
                name="taskName"
                config={{
                  type: "text",
                  label: undefined,
                  placeholder:
                    "cronErrors.admin.interface.executionHistory.searchPlaceholder",
                }}
                control={historyEndpoint.read.form.control}
                schema={cronExecutionHistoryRequestSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* Status Filter */}
              <EndpointFormField
                name="status"
                config={{
                  type: "select",
                  label: undefined,
                  placeholder:
                    "cronErrors.admin.interface.executionHistory.statusFilter",
                  options: [
                    {
                      value: CronTaskStatusFilter.ALL,
                      label: "cronErrors.admin.interface.all",
                    },
                    {
                      value: CronTaskStatusFilter.PENDING,
                      label: "cronErrors.admin.interface.pending",
                    },
                    {
                      value: CronTaskStatusFilter.RUNNING,
                      label: "cronErrors.admin.interface.running",
                    },
                    {
                      value: CronTaskStatusFilter.COMPLETED,
                      label: "cronErrors.admin.interface.completed",
                    },
                    {
                      value: CronTaskStatusFilter.FAILED,
                      label: "cronErrors.admin.interface.failed",
                    },
                    {
                      value: CronTaskStatusFilter.TIMEOUT,
                      label: "cronErrors.admin.interface.failed",
                    },
                    {
                      value: CronTaskStatusFilter.CANCELLED,
                      label: "cronErrors.admin.interface.cancelled",
                    },
                    {
                      value: CronTaskStatusFilter.SKIPPED,
                      label: "cronErrors.admin.interface.cancelled",
                    },
                  ],
                }}
                control={historyEndpoint.read.form.control}
                schema={cronExecutionHistoryRequestSchema}
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
                    "cronErrors.admin.interface.executionHistory.startDate",
                }}
                control={historyEndpoint.read.form.control}
                schema={cronExecutionHistoryRequestSchema}
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
                    "cronErrors.admin.interface.executionHistory.endDate",
                }}
                control={historyEndpoint.read.form.control}
                schema={cronExecutionHistoryRequestSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Sort By */}
                <EndpointFormField
                  name="sortBy"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "cronErrors.admin.interface.filter",
                    options: [
                      {
                        value: CronExecutionSortBy.STARTED_AT,
                        label:
                          "cronErrors.admin.interface.executionHistory.started",
                      },
                      {
                        value: CronExecutionSortBy.COMPLETED_AT,
                        label: "cronErrors.admin.interface.completed",
                      },
                      {
                        value: CronExecutionSortBy.DURATION_MS,
                        label:
                          "cronErrors.admin.interface.executionHistory.duration",
                      },
                    ],
                  }}
                  control={historyEndpoint.read.form.control}
                  schema={cronExecutionHistoryRequestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Sort Order */}
                <EndpointFormField
                  name="sortOrder"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "cronErrors.admin.interface.filter",
                    options: [
                      {
                        value: SortOrder.DESC,
                        label: "cronErrors.admin.interface.next",
                      },
                      {
                        value: SortOrder.ASC,
                        label: "cronErrors.admin.interface.previous",
                      },
                    ],
                  }}
                  control={historyEndpoint.read.form.control}
                  schema={cronExecutionHistoryRequestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                {t("cronErrors.admin.interface.clear")}
              </Button>
            </div>

            {/* Form Alert for any filter errors */}
            <FormAlert alert={historyEndpoint.alert} />
          </Form>
        </div>

        {/* Execution List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {queryLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 mr-2" />
                  {t(
                    "cronErrors.admin.interface.executionHistory.loadingHistory",
                  )}
                </div>
              ) : (
                t("cronErrors.admin.interface.executionHistory.noHistory")
              )}
            </div>
          ) : (
            history.map((execution) => (
              <div
                key={execution.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(execution.status)}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {execution.taskName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "cronErrors.admin.interface.executionHistory.started",
                        )}
                        : {formatDate(execution.startedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t(
                          "cronErrors.admin.interface.executionHistory.duration",
                        )}
                        : {getDuration(execution)}
                      </p>
                    </div>

                    {execution.retryAttempt > 0 && (
                      <Badge variant="outline" className="text-orange-600">
                        {execution.retryAttempt}{" "}
                        {t(
                          "cronErrors.admin.interface.executionHistory.retries",
                        )}
                      </Badge>
                    )}
                  </div>
                </div>

                {execution.completedAt && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t(
                        "cronErrors.admin.interface.executionHistory.completed",
                      )}
                      : {formatDate(execution.completedAt)}
                    </p>
                  </div>
                )}

                {execution.result && (
                  <div className="mt-3">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                        {t(
                          "cronErrors.admin.interface.executionHistory.output",
                        )}
                      </summary>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded border border-gray-200 dark:border-gray-700 mt-2 overflow-x-auto max-h-40">
                        {JSON.stringify(execution.result, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                {execution.error && (
                  <div className="mt-3">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        {t(
                          "cronErrors.admin.interface.executionHistory.errorDetails",
                        )}
                      </summary>
                      <div className="text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 mt-2 overflow-x-auto max-h-40 text-red-800 dark:text-red-300">
                        <div className="mb-2 font-medium">
                          {t(
                            execution.error.message,
                            execution.error.messageParams,
                          )}
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalExecutions > currentLimit && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("cronErrors.admin.interface.executionHistory.showingResults", {
                from: (currentPage - 1) * currentLimit + 1,
                to: Math.min(currentPage * currentLimit, totalExecutions),
              })}
            </p>
            <div className="flex space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                {t("leads.pagination.page_info_with_count", {
                  current: currentPage,
                  total: totalPages,
                  count: totalExecutions,
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  historyEndpoint.read.form?.setValue("page", newPage);
                }}
                disabled={currentPage === 1}
              >
                {t("cronErrors.admin.interface.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = currentPage + 1;
                  historyEndpoint.read.form?.setValue("page", newPage);
                }}
                disabled={currentPage >= totalPages}
              >
                {t("cronErrors.admin.interface.next")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
