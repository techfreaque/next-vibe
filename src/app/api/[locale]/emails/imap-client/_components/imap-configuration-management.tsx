/**
 * IMAP Configuration Management Component
 * Component for managing IMAP server configuration with tabs and forms
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import { useImapConfig } from "@/app/api/[locale]/emails/imap-client/config/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { ImapPerformanceConfigForm } from "./imap-performance-config-form";
import { ImapServerConfigForm } from "./imap-server-config-form";
import { ImapSyncConfigForm } from "./imap-sync-config-form";

interface ImapConfigurationManagementProps {
  locale: CountryLanguage;
}

/**
 * IMAP Configuration Management Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapConfigurationManagement({
  locale,
}: ImapConfigurationManagementProps): JSX.Element {
  const { t } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use the IMAP config endpoint - no local useState
  const configEndpoint = useImapConfig(logger);

  // Get config data from endpoint
  const configData = configEndpoint.read.response?.success
    ? configEndpoint.read.response.data
    : null;

  const isLoading = configEndpoint.read.isLoading || false;
  const error = configEndpoint.read.error;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Div className="text-center">
            {t("app.admin.emails.imap.common.loading")}
          </Div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Div className="text-center text-red-600">
            {t("app.admin.emails.imap.admin.health.error.title")}
          </Div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <Div className="flex items-center justify-between">
            <CardTitle>
              {t("app.admin.emails.imap.admin.config.settings.title")}
            </CardTitle>
            <Div className="flex flex-row gap-2">
              <Button variant="outline" onClick={configEndpoint.read.refetch}>
                {t("app.admin.emails.imap.common.refresh")}
              </Button>
              <Button
                variant="outline"
                onClick={configEndpoint.read.clearSavedForm}
              >
                {t("app.admin.emails.imap.common.reset")}
              </Button>
            </Div>
          </Div>
        </CardHeader>
        <CardContent>
          <Form
            form={configEndpoint.create.form}
            onSubmit={configEndpoint.create.onSubmit}
            className="flex flex-col gap-6"
          >
            <FormAlert alert={configEndpoint.alert} />

            <Tabs defaultValue="server">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="server">
                  {t("app.admin.emails.imap.nav.config")}
                </TabsTrigger>
                <TabsTrigger value="sync">
                  {t("app.admin.emails.imap.nav.sync")}
                </TabsTrigger>
                <TabsTrigger value="performance">
                  {t("app.admin.emails.imap.common.performance")}
                </TabsTrigger>
                <TabsTrigger value="resilience">
                  {t("app.admin.emails.imap.common.resilience")}
                </TabsTrigger>
                <TabsTrigger value="monitoring">
                  {t("app.admin.emails.imap.common.monitoring")}
                </TabsTrigger>
                <TabsTrigger value="development">
                  {t("app.admin.emails.imap.common.development")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="server" className="mt-6">
                {configEndpoint.create && (
                  <ImapServerConfigForm
                    control={configEndpoint.create.form.control}
                    locale={locale}
                  />
                )}
              </TabsContent>

              <TabsContent value="sync" className="mt-6">
                {configEndpoint.create && (
                  <ImapSyncConfigForm
                    control={configEndpoint.create.form.control}
                    locale={locale}
                  />
                )}
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                {configEndpoint.create && (
                  <ImapPerformanceConfigForm
                    control={configEndpoint.create.form.control}
                    locale={locale}
                  />
                )}
              </TabsContent>

              <TabsContent value="resilience" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("app.admin.emails.imap.admin.config.resilience.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Div className="flex flex-col gap-4">
                      <EndpointFormField
                        name="maxRetries"
                        config={{
                          type: "number",
                          label:
                            "app.admin.emails.imap.config.resilience.maxRetries",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                      <EndpointFormField
                        name="retryDelay"
                        config={{
                          type: "number",
                          label:
                            "app.admin.emails.imap.config.resilience.retryDelay",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                      <EndpointFormField
                        name="circuitBreakerThreshold"
                        config={{
                          type: "number",
                          label:
                            "app.admin.emails.imap.config.resilience.circuitBreakerThreshold",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                    </Div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monitoring" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("app.admin.emails.imap.admin.config.monitoring.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Div className="flex flex-col gap-4">
                      <EndpointFormField
                        name="healthCheckInterval"
                        config={{
                          type: "number",
                          label:
                            "app.admin.emails.imap.config.monitoring.healthCheckInterval",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                      <EndpointFormField
                        name="metricsEnabled"
                        config={{
                          type: "switch",
                          label:
                            "app.admin.emails.imap.config.monitoring.metricsEnabled",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                      <EndpointFormField
                        name="loggingLevel"
                        config={{
                          type: "select",
                          label:
                            "app.admin.emails.imap.config.monitoring.loggingLevel",
                          options: [
                            {
                              value: "error",
                              label: "app.admin.emails.imap.common.error",
                            },
                            {
                              value: "warn",
                              label: "app.admin.emails.imap.common.warning",
                            },
                            {
                              value: "info",
                              label: "app.admin.emails.imap.common.info",
                            },
                            {
                              value: "debug",
                              label:
                                "app.admin.emails.imap.config.development.debugMode",
                            },
                          ],
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                    </Div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="development" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t(
                        "app.admin.emails.imap.admin.config.development.title",
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Div className="flex flex-col gap-4">
                      <EndpointFormField
                        name="debugMode"
                        config={{
                          type: "switch",
                          label:
                            "app.admin.emails.imap.config.development.debugMode",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                      <EndpointFormField
                        name="testMode"
                        config={{
                          type: "switch",
                          label:
                            "app.admin.emails.imap.config.development.testMode",
                        }}
                        control={configEndpoint.create.form.control}
                        locale={locale}
                      />
                    </Div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <Div className="flex justify-end flex-row gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={configEndpoint.read.refetch}
              >
                {t("app.admin.emails.imap.common.reset")}
              </Button>
              <Button
                type="submit"
                disabled={configEndpoint.create.isSubmitting}
              >
                {configEndpoint.create.isSubmitting
                  ? t("app.admin.emails.imap.common.saving")
                  : t("app.admin.emails.imap.common.save")}
              </Button>
            </Div>
          </Form>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {t("app.admin.emails.imap.admin.config.status.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Div className="text-center">
              <Div className="text-2xl font-bold text-green-600">
                {configData
                  ? t("app.admin.emails.imap.common.active")
                  : t("app.admin.emails.imap.common.inactive")}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.common.status")}
              </Div>
            </Div>
            <Div className="text-center">
              <Div className="text-2xl font-bold">
                {configData
                  ? t("app.admin.emails.imap.common.justNow")
                  : t("app.admin.emails.imap.common.never")}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.common.updated")}
              </Div>
            </Div>
            <Div className="text-center">
              <Div className="text-2xl font-bold text-blue-600">
                {configData
                  ? t("app.admin.emails.imap.common.valid")
                  : t("app.admin.emails.imap.common.invalid")}
              </Div>
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.common.configuration")}
              </Div>
            </Div>
          </Div>
        </CardContent>
      </Card>
    </Div>
  );
}
