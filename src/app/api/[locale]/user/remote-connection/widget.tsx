/**
 * Remote Connection Widget
 *
 * 3-state UI: loading → connected → not connected
 * Registered via customWidgetObject in definition.ts
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link2, RefreshCw } from "next-vibe-ui/ui/icons";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Code, P, Small } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import connectDefinitions from "./connect/definition";
import type definitions from "./definition";
import type { RemoteConnectionGetResponseOutput } from "./definition";
import disconnectDefinitions from "./disconnect/definition";
import { scopedTranslation } from "./i18n";

interface RemoteConnectionWidgetProps {
  field: {
    value: RemoteConnectionGetResponseOutput | null | undefined;
  } & (typeof definitions.GET)["fields"];
  fieldName: string;
}

export function RemoteConnectionWidget({
  field,
}: RemoteConnectionWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const endpointMutations = useWidgetEndpointMutations();
  const read = endpointMutations?.read;

  if (user.isPublic) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("widget.title")}</CardTitle>
          <CardDescription>{t("widget.signInDescription")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Loading state
  if (read?.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const status = field.value;
  const isConnected = status?.isConnected === true;

  // Connected state
  if (isConnected && status) {
    return (
      <Card>
        <CardHeader>
          <Div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-green-500" />
            <CardTitle>{t("widget.connected.title")}</CardTitle>
            <Badge variant="default" className="ml-auto bg-green-500">
              {t("widget.connected.badge")}
            </Badge>
          </Div>
          <CardDescription>{t("widget.connected.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Div className="space-y-1">
            <Small className="text-muted-foreground">
              {t("widget.connected.connectedTo")}
            </Small>
            <P className="font-medium break-all">{status.remoteUrl}</P>
          </Div>
          {status.lastSyncedAt && (
            <Div className="space-y-1">
              <Small className="text-muted-foreground">
                {t("widget.connected.lastSynced")}
              </Small>
              <P className="text-sm">
                {new Date(status.lastSyncedAt).toLocaleString()}
              </P>
            </Div>
          )}
          <Div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void read?.refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t("widget.connected.refresh")}
            </Button>
            <Div className="ml-auto">
              <EndpointsPage
                endpoint={disconnectDefinitions}
                locale={locale}
                user={user}
              />
            </Div>
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Not connected state — show explainer + connect form
  return (
    <Div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("widget.notConnected.title")}</CardTitle>
          <CardDescription>
            {t("widget.notConnected.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Div className="grid gap-3 text-sm text-muted-foreground">
            <P>✓ {t("widget.notConnected.benefit1")}</P>
            <P>
              ✓ {t("widget.notConnected.benefit2")}{" "}
              <Code>{t("widget.notConnected.benefit2Code")}</Code>
            </P>
            <P>✓ {t("widget.notConnected.benefit3")}</P>
          </Div>
        </CardContent>
      </Card>

      <EndpointsPage
        endpoint={connectDefinitions}
        locale={locale}
        user={user}
      />
    </Div>
  );
}
