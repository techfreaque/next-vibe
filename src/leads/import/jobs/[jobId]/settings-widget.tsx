"use client";

import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useRef } from "react";

import definition from "./definition";

function useImportJob(
  jobId: string | undefined,
): (typeof definition.GET)["types"]["ResponseOutput"]["job"] | undefined {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  return useEndpoint(
    { GET: definition.GET },
    {
      read: {
        urlPathParams: { jobId: jobId ?? "" },
        queryOptions: { enabled: Boolean(jobId) },
      },
    },
    logger,
    user,
  ).read?.data?.job;
}

export function ImportJobSettingsContainer({
  field,
}: {
  field: (typeof definition.PATCH)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const job = useImportJob(form.watch("jobId"));
  const saved = useWidgetValue<typeof definition.PATCH>();
  const initializedJobId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!job || job.info.id === initializedJobId.current) {
      return;
    }

    initializedJobId.current = job.info.id;
    form.setValue("settings.batchSize", job.configuration.batchSize);
    form.setValue("settings.maxRetries", job.configuration.maxRetries);
  }, [form, job]);

  return (
    <AdminForm
      title={t("patch.title")}
      description={t("patch.form.description")}
      backButton={<NavigateButtonWidget field={field.children.backButton} />}
      primaryAction={<SubmitButtonWidget<typeof definition.PATCH> field={{}} />}
      result={
        saved?.job && (
          <ResultBanner
            variant="success"
            title={t("patch.success.description")}
          />
        )
      }
    >
      <AdminFormSection title={job?.info.fileName ?? t("patch.settings.title")}>
        <EntityPickerFieldWidget
          fieldName="jobId"
          field={withValue(field.children.jobId, undefined, null)}
        />
        <Div className="grid gap-4 @md:grid-cols-2">
          <NumberFieldWidget
            fieldName="settings.batchSize"
            field={withValue(
              field.children.settings.children.batchSize,
              undefined,
              null,
            )}
          />
          <NumberFieldWidget
            fieldName="settings.maxRetries"
            field={withValue(
              field.children.settings.children.maxRetries,
              undefined,
              null,
            )}
          />
        </Div>
      </AdminFormSection>
    </AdminForm>
  );
}

export function ImportJobRemoveContainer({
  field,
}: {
  field: (typeof definition.DELETE)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const form = useWidgetForm<typeof definition.DELETE>();
  const job = useImportJob(form.watch("jobId"));
  const removed = useWidgetValue<typeof definition.DELETE>();

  return (
    <AdminForm
      title={t("delete.title")}
      description={t("delete.form.description")}
      backButton={<NavigateButtonWidget field={field.children.backButton} />}
      primaryAction={
        removed?.result.success ? null : (
          <SubmitButtonWidget<typeof definition.DELETE> field={{}} />
        )
      }
    >
      {removed?.result.success ? (
        <ResultBanner
          variant="success"
          title={t("delete.success.description")}
        />
      ) : (
        <AdminFormSection title={job?.info.fileName ?? t("delete.form.title")}>
          <EntityPickerFieldWidget
            fieldName="jobId"
            field={withValue(field.children.jobId, undefined, null)}
          />
          {job && (
            <StatusPill
              status={job.info.status}
              label={t(`widget.status.jobStatus.${job.info.status}`)}
            />
          )}
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
