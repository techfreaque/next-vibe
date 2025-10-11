/**
 * Campaign Starter Configuration Form
 * Form component for editing campaign starter settings
 */

"use client";

import { Save } from "lucide-react";
import { Form, FormAlert, FormSection } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import { useCampaignStarterConfigEndpoint } from "@/app/api/[locale]/v1/core/leads/campaigns/campaign-starter/campaign-starter-config/hooks";
import { CronTaskPriority } from "@/app/api/[locale]/v1/core/system/tasks/enum";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function CampaignStarterForm({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(false, Date.now(), locale);

  const endpoint = useCampaignStarterConfigEndpoint(logger, {
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const isSuccess = endpoint.create.isSuccess;

  if (isLoading) {
    return <CampaignStarterFormSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Form
        form={endpoint.create.form}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <FormSection
          title={"leads.admin.campaignStarter.settings.title"}
          description={"leads.admin.campaignStarter.settings.description"}
        >
          <Card>
            <CardContent className="pt-6">
              <FormFieldGroup
                title={"leads.admin.campaignStarter.form.sections.basic.title"}
                description={
                  "leads.admin.campaignStarter.form.sections.basic.description"
                }
              >
                {/* Dry Run Toggle */}
                <EndpointFormField
                  name="dryRun"
                  config={{
                    type: "switch",
                    label: "leads.admin.campaignStarter.form.dryRun.label",
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Minimum Age Hours */}
                <EndpointFormField
                  name="minAgeHours"
                  config={{
                    type: "number",
                    label: "leads.admin.campaignStarter.form.minAgeHours.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.minAgeHours.placeholder",
                    min: 0,
                    max: 168,
                    step: 1,
                  }}
                  control={endpoint.create.form.control}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"leads.admin.campaignStarter.form.enabledDays.label"}
                description={
                  "leads.admin.campaignStarter.form.enabledDays.description"
                }
              >
                {/* Enabled Days - Custom checkbox group */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 1, key: "monday" },
                      { value: 2, key: "tuesday" },
                      { value: 3, key: "wednesday" },
                      { value: 4, key: "thursday" },
                      { value: 5, key: "friday" },
                      { value: 6, key: "saturday" },
                      { value: 7, key: "sunday" },
                    ].map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={
                            endpoint.create.form
                              .watch("enabledDays")
                              ?.includes(day.value) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentDays =
                              endpoint.create.form.getValues("enabledDays") ||
                              [];
                            const newDays = checked
                              ? [...currentDays, day.value].sort()
                              : currentDays.filter(
                                  (d: number) => d !== day.value,
                                );
                            endpoint.create.form.setValue(
                              "enabledDays",
                              newDays,
                            );
                          }}
                        />
                        <Label
                          // eslint-disable-next-line i18next/no-literal-string
                          htmlFor={`day-${day.value}`}
                        >
                          {day.key.charAt(0).toUpperCase() + day.key.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </FormFieldGroup>

              <FormFieldGroup
                title={"leads.admin.campaignStarter.form.enabledHours.label"}
                description={
                  "leads.admin.campaignStarter.form.enabledHours.description"
                }
              >
                {/* Start Hour */}
                <EndpointFormField
                  name="enabledHours.start"
                  config={{
                    type: "number",
                    label:
                      "leads.admin.campaignStarter.form.enabledHours.startHour.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.enabledHours.startHour.placeholder",
                    min: 0,
                    max: 23,
                    step: 1,
                  }}
                  control={endpoint.create.form.control}
                />

                {/* End Hour */}
                <EndpointFormField
                  name="enabledHours.end"
                  config={{
                    type: "number",
                    label:
                      "leads.admin.campaignStarter.form.enabledHours.endHour.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.enabledHours.endHour.placeholder",
                    min: 0,
                    max: 23,
                    step: 1,
                  }}
                  control={endpoint.create.form.control}
                />
              </FormFieldGroup>

              <FormFieldGroup
                title={"leads.admin.campaignStarter.form.leadsPerWeek.label"}
                description={
                  "leads.admin.campaignStarter.form.leadsPerWeek.description"
                }
              >
                {/* Leads Per Week - Custom inputs for each locale */}
                <div className="space-y-4">
                  {Object.values(CountryLanguageValues).map((locale) => (
                    <div key={locale} className="flex items-center space-x-4">
                      <Label className="w-24 font-medium">{locale}:</Label>
                      <Input
                        type="number"
                        min="1"
                        value={
                          endpoint.create.form.watch("leadsPerWeek")?.[
                            locale
                          ] || ""
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!Number.isNaN(value) && value >= 1) {
                            const currentLeadsPerWeek =
                              endpoint.create.form.getValues("leadsPerWeek") ||
                              {};
                            endpoint.create.form.setValue("leadsPerWeek", {
                              ...currentLeadsPerWeek,
                              [locale]: value,
                            });
                          }
                        }}
                        className="w-32"
                      />
                    </div>
                  ))}
                </div>
              </FormFieldGroup>

              <FormFieldGroup
                title={"leads.admin.campaignStarter.form.cronSettings.label"}
                description={
                  "leads.admin.campaignStarter.form.cronSettings.description"
                }
              >
                {/* Schedule */}
                <EndpointFormField
                  name="schedule"
                  config={{
                    type: "text",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.schedule.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.cronSettings.schedule.placeholder",
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Timezone */}
                <EndpointFormField
                  name="timezone"
                  config={{
                    type: "text",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.timezone.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.cronSettings.timezone.placeholder",
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Enabled */}
                <EndpointFormField
                  name="enabled"
                  config={{
                    type: "switch",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.enabled.label",
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Priority */}
                <EndpointFormField
                  name="priority"
                  config={{
                    type: "select",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.priority.label",
                    options: [
                      {
                        value: CronTaskPriority.LOW,
                        label:
                          "leads.admin.campaignStarter.form.cronSettings.priority.options.low",
                      },
                      {
                        value: CronTaskPriority.NORMAL,
                        label:
                          "leads.admin.campaignStarter.form.cronSettings.priority.options.normal",
                      },
                      {
                        value: CronTaskPriority.HIGH,
                        label:
                          "leads.admin.campaignStarter.form.cronSettings.priority.options.high",
                      },
                      {
                        value: CronTaskPriority.CRITICAL,
                        label:
                          "leads.admin.campaignStarter.form.cronSettings.priority.options.critical",
                      },
                    ],
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Timeout */}
                <EndpointFormField
                  name="timeout"
                  config={{
                    type: "number",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.timeout.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.cronSettings.timeout.placeholder",
                    min: 1000,
                    max: 3600000,
                    step: 1000,
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Retries */}
                <EndpointFormField
                  name="retries"
                  config={{
                    type: "number",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.retries.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.cronSettings.retries.placeholder",
                    min: 0,
                    max: 10,
                    step: 1,
                  }}
                  control={endpoint.create.form.control}
                />

                {/* Retry Delay */}
                <EndpointFormField
                  name="retryDelay"
                  config={{
                    type: "number",
                    label:
                      "leads.admin.campaignStarter.form.cronSettings.retryDelay.label",
                    placeholder:
                      "leads.admin.campaignStarter.form.cronSettings.retryDelay.placeholder",
                    min: 1000,
                    max: 300000,
                    step: 1000,
                  }}
                  control={endpoint.create.form.control}
                />
              </FormFieldGroup>

              {/* Form Alert for errors and success */}
              <FormAlert alert={endpoint.alert} />

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t("common.saving")}
                    </>
                  ) : isSuccess ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("leads.admin.campaignStarter.form.success")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("leads.admin.campaignStarter.form.save")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FormSection>
      </Form>
    </div>
  );
}

function CampaignStarterFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
