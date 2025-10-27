/**
 * Cron Tasks Client Component
 * Client component for managing cron tasks
 */

"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";
import { useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { useCronTasksList } from "@/app/api/[locale]/v1/core/system/unified-backend/tasks/cron/tasks/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CreateTaskDialog } from "./create-task-dialog";
import { CronTasksTable } from "./cron-tasks-table";

interface CronTasksClientProps {
  locale: CountryLanguage;
}

export function CronTasksClient({
  locale,
}: CronTasksClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const logger = createEndpointLogger(false, Date.now(), locale);
  const tasksEndpoint = useCronTasksList(logger);

  return (
    <div className="space-y-6">
      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("app.admin.cron.taskManagement")}</CardTitle>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.admin.cron.nav.tasks_description")}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={tasksEndpoint.read.refetch}
                disabled={tasksEndpoint.read.isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("app.admin.common.refresh")}
              </Button>
              <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("app.admin.cron.buttons.createTask")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CronTasksTable
            tasks={tasksEndpoint.read.data?.tasks || []}
            loading={tasksEndpoint.read.isLoading}
            locale={locale}
            onTaskUpdated={tasksEndpoint.read.refetch}
          />
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={tasksEndpoint.read.refetch}
        locale={locale}
      />
    </div>
  );
}
