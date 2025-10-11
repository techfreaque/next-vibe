/**
 * IMAP Configuration Management Component
 * Component for managing IMAP server configuration with tabs and forms
 */

"use client";

import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import { useImapConfigEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/config/hooks";
import { useTranslation } from "@/i18n/core/client";

import { ImapPerformanceConfigForm } from "./imap-performance-config-form";
import { ImapServerConfigForm } from "./imap-server-config-form";
import { ImapSyncConfigForm } from "./imap-sync-config-form";

/**
 * IMAP Configuration Management Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapConfigurationManagement(): JSX.Element {
  const { t } = useTranslation();

  // Use the IMAP config endpoint - no local useState
  const configEndpoint = useImapConfigEndpoint({
    enabled: true,
  });

  // Get config data from endpoint
  const configData = configEndpoint.read?.response?.success
    ? configEndpoint.read.response.data
    : null;

  const isLoading = configEndpoint.read?.isLoading || false;
  const error = configEndpoint.read?.error;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">{t("imap.common.loading")}</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {t("imap.admin.health.error.title")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("imap.admin.config.settings.title")}</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={configEndpoint.read.refetch}>
                {t("imap.common.refresh")}
              </Button>
              <Button
                variant="outline"
                onClick={configEndpoint.read.clearSavedForm}
              >
                {t("imap.common.reset")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form
            form={configEndpoint.create.form}
            onSubmit={configEndpoint.create.onSubmit}
            className="space-y-6"
          >
            <FormAlert alert={configEndpoint.alert} />

            <Tabs defaultValue="server">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="server">{t("imap.nav.config")}</TabsTrigger>
                <TabsTrigger value="sync">{t("imap.nav.sync")}</TabsTrigger>
                <TabsTrigger value="performance">
                  {t("imap.common.performance")}
                </TabsTrigger>
                <TabsTrigger value="resilience">
                  {t("imap.common.resilience")}
                </TabsTrigger>
                <TabsTrigger value="monitoring">
                  {t("imap.common.monitoring")}
                </TabsTrigger>
                <TabsTrigger value="development">
                  {t("imap.common.development")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="server" className="mt-6">
                <ImapServerConfigForm />
              </TabsContent>

              <TabsContent value="sync" className="mt-6">
                <ImapSyncConfigForm />
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <ImapPerformanceConfigForm />
              </TabsContent>

              <TabsContent value="resilience" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("imap.admin.config.resilience.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <EndpointFormField
                        name="maxRetries"
                        config={{
                          type: "number",
                          label: "imap.config.resilience.maxRetries",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                      <EndpointFormField
                        name="retryDelay"
                        config={{
                          type: "number",
                          label: "imap.config.resilience.retryDelay",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                      <EndpointFormField
                        name="circuitBreakerThreshold"
                        config={{
                          type: "number",
                          label:
                            "imap.config.resilience.circuitBreakerThreshold",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monitoring" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("imap.admin.config.monitoring.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <EndpointFormField
                        name="healthCheckInterval"
                        config={{
                          type: "number",
                          label: "imap.config.monitoring.healthCheckInterval",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                      <EndpointFormField
                        name="metricsEnabled"
                        config={{
                          type: "switch",
                          label: "imap.config.monitoring.metricsEnabled",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                      <EndpointFormField
                        name="loggingLevel"
                        config={{
                          type: "select",
                          label: "imap.config.monitoring.loggingLevel",
                          options: [
                            { value: "error", label: "imap.common.error" },
                            { value: "warn", label: "imap.common.warning" },
                            { value: "info", label: "imap.common.info" },
                            {
                              value: "debug",
                              label: "imap.config.development.debugMode",
                            },
                          ],
                        }}
                        control={configEndpoint.create.form.control}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="development" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("imap.admin.config.development.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <EndpointFormField
                        name="debugMode"
                        config={{
                          type: "switch",
                          label: "imap.config.development.debugMode",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                      <EndpointFormField
                        name="testMode"
                        config={{
                          type: "switch",
                          label: "imap.config.development.testMode",
                        }}
                        control={configEndpoint.create.form.control}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={configEndpoint.read.refetch}
              >
                {t("imap.common.reset")}
              </Button>
              <Button
                type="submit"
                disabled={configEndpoint.create?.isSubmitting}
              >
                {configEndpoint.create?.isSubmitting
                  ? t("imap.common.saving")
                  : t("imap.common.save")}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle> {t("imap.admin.config.status.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {configData
                  ? t("imap.common.active")
                  : t("imap.common.inactive")}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.common.status")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {configData ? t("imap.common.justNow") : t("imap.common.never")}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.common.updated")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {configData ? t("imap.common.valid") : t("imap.common.invalid")}
              </div>
              <div className="text-sm text-gray-600">
                {t("imap.common.configuration")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
