/**
 * Create Task Dialog Component
 * Dialog for creating new cron tasks
 */

"use client";

import { Plus, Save } from "lucide-react";
import { Form, FormAlert } from "next-vibe-ui/ui";
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
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";

import { cronTaskCreateRequestSchema } from "@/app/api/[locale]/v1/core/system/tasks/cron/tasks/definition";
import { useCreateCronTask } from "@/app/api/[locale]/v1/core/system/tasks/cron/tasks/hooks";
import { formatCronSchedule } from "@/app/api/[locale]/v1/core/system/tasks/cron-formatter";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  locale: CountryLanguage;
}

export function CreateTaskDialog({
  open,
  onClose,
  onTaskCreated,
  locale,
}: CreateTaskDialogProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const endpoint = useCreateCronTask();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (endpoint.create.onSubmit) {
      await endpoint.create.onSubmit(e);
      if (endpoint.create.response?.success) {
        onTaskCreated();
        handleClose();
      }
    }
  };

  const handleClose = (): void => {
    endpoint.create.form.reset();
    onClose();
  };

  const isSubmitting = endpoint.create.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t("admin.dashboard.cron.createTask.title")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.dashboard.cron.createTask.description")}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
            <Form
              form={endpoint.create.form}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FormFieldGroup
                title={"admin.dashboard.cron.createTask.form.taskName" as const}
                description={
                  "admin.dashboard.cron.createTask.form.taskNameDescription" as const
                }
              >
                {/* Task Name and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="name"
                    config={{
                      type: "text",
                      label: "admin.dashboard.cron.createTask.form.taskName",
                      placeholder:
                        "admin.dashboard.cron.createTask.form.taskNamePlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={cronTaskCreateRequestSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="priority"
                    config={{
                      type: "select",
                      label: "admin.dashboard.cron.createTask.form.priority",
                      placeholder:
                        "admin.dashboard.cron.createTask.form.priority",
                      options: [
                        {
                          value: CronTaskPriority.LOW,
                          label:
                            "admin.dashboard.cron.createTask.priorities.low",
                        },
                        {
                          value: CronTaskPriority.NORMAL,
                          label:
                            "admin.dashboard.cron.createTask.priorities.normal",
                        },
                        {
                          value: CronTaskPriority.HIGH,
                          label:
                            "admin.dashboard.cron.createTask.priorities.high",
                        },
                        {
                          value: CronTaskPriority.CRITICAL,
                          label:
                            "admin.dashboard.cron.createTask.priorities.critical",
                        },
                      ],
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Description */}
                <EndpointFormField
                  name="description"
                  config={{
                    type: "textarea",
                    label: "admin.dashboard.cron.createTask.form.description",
                    placeholder:
                      "admin.dashboard.cron.createTask.form.descriptionPlaceholder",
                    rows: 3,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"admin.dashboard.cron.createTask.form.schedule" as const}
                description={
                  "admin.dashboard.cron.createTask.form.scheduleDescription" as const
                }
              >
                {/* Schedule and Timezone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="schedule"
                    config={{
                      type: "text",
                      label: "admin.dashboard.cron.createTask.form.schedule",
                      placeholder:
                        "admin.dashboard.cron.createTask.form.scheduleDescription",
                    }}
                    control={endpoint.create.form.control}
                    schema={cronTaskCreateRequestSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                </div>

                {/* Schedule Preview */}
                <SchedulePreview
                  schedule={endpoint.create.form.watch("schedule")}
                  locale={locale}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"admin.dashboard.cron.createTask.form.enabled" as const}
                description={
                  "admin.dashboard.cron.createTask.form.enabledDescription" as const
                }
              >
                {/* Timeout and Retries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="timeout"
                    config={{
                      type: "text",
                      label: "admin.dashboard.cron.createTask.form.timeout",
                      placeholder:
                        "admin.dashboard.cron.createTask.form.taskNamePlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="retries"
                    config={{
                      type: "text",
                      label: "admin.dashboard.cron.createTask.form.retries",
                      placeholder:
                        "admin.dashboard.cron.createTask.form.taskNamePlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                {/* Retry Delay */}
                <EndpointFormField
                  name="retryDelay"
                  config={{
                    type: "text",
                    label: "admin.dashboard.cron.createTask.form.retryDelay",
                    placeholder:
                      "admin.dashboard.cron.createTask.form.taskNamePlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                {/* Enabled Switch */}
                <EndpointFormField
                  name="enabled"
                  config={{
                    type: "switch",
                    label: "admin.dashboard.cron.createTask.form.enabled",
                    description:
                      "admin.dashboard.cron.createTask.form.enabledDescription",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
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
            {t("admin.dashboard.cron.createTask.form.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t("admin.dashboard.cron.createTask.form.creating")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("admin.dashboard.cron.createTask.form.create")}
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

  if (!schedule || schedule.trim() === "") {
    return null;
  }

  try {
    const humanReadable = formatCronSchedule(schedule, timezone, locale);

    // Don't show preview if it's the same as the input (parsing failed)
    if (humanReadable === schedule) {
      return null;
    }

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800 font-medium">
          {t("cronErrors.admin.interface.schedulePreview")}
        </p>
        <p className="text-sm text-blue-700">{humanReadable}</p>
      </div>
    );
  } catch {
    return null;
  }
}
