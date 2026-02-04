/**
 * Create Task Dialog Component
 * Dialog for creating new cron tasks
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { Plus, Save } from "next-vibe-ui/ui/icons";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import taskDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import { useCreateCronTask } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/hooks";
import { formatCronSchedule } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function CreateTaskDialog({
  open,
  onClose,
  onTaskCreated,
  locale,
  user,
}: CreateTaskDialogProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useCreateCronTask(user, logger);

  const handleSubmit = async (): Promise<void> => {
    await endpoint.create.onSubmit();
    if (endpoint.create.response?.success) {
      onTaskCreated();
      handleClose();
    }
  };

  const handleClose = (): void => {
    endpoint.create.form.reset();
    onClose();
  };

  const isSubmitting = endpoint.create?.isSubmitting || false;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t("app.admin.cron.createTask.title")}
          </DialogTitle>
          <DialogDescription>
            {t("app.admin.cron.createTask.description")}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create?.form}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <FormFieldGroup
                title={"app.admin.cron.createTask.form.taskName" as const}
                description={
                  "app.admin.cron.createTask.form.taskNameDescription" as const
                }
              >
                {/* Task Name and Priority */}
                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="name"
                    endpoint={taskDefinition.POST}
                    control={endpoint.create?.form.control}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                    locale={locale}
                  />

                  <EndpointFormField
                    name="priority"
                    endpoint={taskDefinition.POST}
                    control={endpoint.create?.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                    locale={locale}
                  />
                </Div>

                {/* Description */}
                <EndpointFormField
                  name="description"
                  endpoint={taskDefinition.POST}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"app.admin.cron.createTask.form.schedule" as const}
                description={
                  "app.admin.cron.createTask.form.scheduleDescription" as const
                }
              >
                {/* Schedule and Timezone */}
                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="schedule"
                    endpoint={taskDefinition.POST}
                    control={endpoint.create?.form.control}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                    locale={locale}
                  />
                </Div>

                {/* Schedule Preview */}
                <SchedulePreview
                  schedule={endpoint.create?.form.watch("schedule") || ""}
                  locale={locale}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"app.admin.cron.createTask.form.enabled" as const}
                description={
                  "app.admin.cron.createTask.form.enabledDescription" as const
                }
              >
                {/* Timeout and Retries */}
                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="timeout"
                    endpoint={taskDefinition.POST}
                    control={endpoint.create?.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                    locale={locale}
                  />

                  <EndpointFormField
                    name="retries"
                    endpoint={taskDefinition.POST}
                    control={endpoint.create?.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                    locale={locale}
                  />
                </Div>

                {/* Retry Delay */}
                <EndpointFormField
                  name="retryDelay"
                  endpoint={taskDefinition.POST}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                {/* Enabled Switch */}
                <EndpointFormField
                  name="enabled"
                  endpoint={taskDefinition.POST}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />
              </FormFieldGroup>

              {/* Form Alert for errors and success */}
              <FormAlert alert={endpoint.alert} />
            </Form>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("app.admin.cron.createTask.form.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <Div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t("app.admin.cron.createTask.form.creating")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("app.admin.cron.createTask.form.create")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SchedulePreviewProps {
  schedule: string;
  locale: CountryLanguage;
}

function SchedulePreview({
  schedule,
  locale,
}: SchedulePreviewProps): React.JSX.Element | null {
  const { t } = simpleT(locale);
  const timezone = getDefaultTimezone(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  if (!schedule || schedule.trim() === "") {
    return null;
  }

  try {
    const humanReadable = formatCronSchedule(
      schedule,
      timezone,
      locale,
      logger,
    );

    // Don't show preview if it's the same as the input (parsing failed)
    if (humanReadable === schedule) {
      return null;
    }

    return (
      <Div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <P className="text-sm text-blue-800 font-medium">
          {t("app.admin.cron.cronErrors.admin.interface.schedulePreview")}
        </P>
        <P className="text-sm text-blue-700">{humanReadable}</P>
      </Div>
    );
  } catch {
    return null;
  }
}
