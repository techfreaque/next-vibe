/**
 * Remote Connection by Instance ID Widget
 * Shows status, re-authenticate, rename, disconnect for a specific connection.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Key } from "next-vibe-ui/ui/icons/Key";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { WifiOff } from "next-vibe-ui/ui/icons/WifiOff";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Code, P, Small } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import connectDefinitions from "../connect/definition";
import disconnectDefinition from "./disconnect/definition";
import reauthDefinition from "./reauth/definition";
import renameDefinition from "./rename/definition";
import type { RemoteConnectionByIdGetResponseOutput } from "./definition";
import type definitions from "./definition";
import { scopedTranslation } from "./i18n";

interface RemoteConnectionByIdWidgetProps {
  field: {
    value: RemoteConnectionByIdGetResponseOutput | null | undefined;
    urlPathParams?: { instanceId?: string };
    children: (typeof definitions.GET)["fields"]["children"];
  };
}

export function RemoteConnectionByIdWidget({
  field,
}: RemoteConnectionByIdWidgetProps): JSX.Element {
  const children = field.children;
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const endpointMutations = useWidgetEndpointMutations();
  const read = endpointMutations?.read;
  const { push: navigate } = useWidgetNavigation();
  const instanceId = field.urlPathParams?.instanceId ?? "";

  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsDisconnecting(true);
    try {
      navigate(disconnectDefinition.DELETE, {
        urlPathParams: { instanceId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const backButton = <NavigateButtonWidget field={children.backButton} />;

  if (user.isPublic) {
    return (
      <Div className="space-y-2">
        {backButton}
        <Card>
          <CardHeader>
            <CardTitle>{t("widget.title")}</CardTitle>
            <CardDescription>{t("widget.signInDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </Div>
    );
  }

  if (read?.isLoading) {
    return (
      <Div className="space-y-2">
        {backButton}
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
      </Div>
    );
  }

  const status = field.value;
  const isConnected = status?.isConnected === true;

  if (isConnected && status) {
    return (
      <Div className="space-y-2">
        {backButton}
        <Card>
          <CardHeader>
            <Div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-green-500" />
              <CardTitle>{t("widget.connected.title")}</CardTitle>
              <Badge variant="default" className="ml-auto bg-green-500">
                {t("widget.connected.badge")}
              </Badge>
            </Div>
            <CardDescription>
              {t("widget.connected.description")}
            </CardDescription>
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
            <Div className="flex gap-2 pt-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void read?.refetch()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("widget.connected.refresh")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(reauthDefinition.POST, {
                    urlPathParams: { instanceId },
                    renderInModal: true,
                  })
                }
                className="gap-2"
              >
                <Key className="h-4 w-4" />
                {t("widget.connected.reauth")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(renameDefinition.PATCH, {
                    urlPathParams: { instanceId },
                    renderInModal: true,
                  })
                }
                className="gap-2"
              >
                {t("widget.connected.rename")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="ml-auto"
              >
                {isDisconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("widget.connected.disconnect")
                )}
              </Button>
            </Div>
          </CardContent>
        </Card>
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      {backButton}
      <Card>
        <CardHeader>
          <Div className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t("widget.notConnected.title")}</CardTitle>
          </Div>
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
