/**
 * Cron Tasks Client Component
 * Client component for managing cron tasks
 */

"use client";

import { Plus, RefreshCw } from 'next-vibe-ui/ui/icons';
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div} from "next-vibe-ui/ui/div";
import { P} from "next-vibe-ui/ui/typography";
import type React from "react";
import { useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useCronTasksList } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/tasks/hooks";
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
    <Div className="space-y-6">
      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <Div className="flex justify-between items-center">
            <Div>
              <CardTitle>{t("app.admin.cron.taskManagement")}</CardTitle>

              <P className="text-sm text-gray-600 dark:text-gray-400">
                {t("app.admin.cron.nav.tasks_description")}
              </P>
            </Div>
            <Div className="flex space-x-2">
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
            </Div>
          </Div>
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
    </Div>
  );
}
