"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Link } from "next-vibe-ui/ui/link";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Coins } from "next-vibe-ui/ui/icons/Coins";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { HelpCircle } from "next-vibe-ui/ui/icons/HelpCircle";
import { Info } from "next-vibe-ui/ui/icons/Info";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { UserMenu } from "./user-menu";

interface SidebarFooterProps {
  locale: CountryLanguage;
  credits: {
    total: number;
    free: number;
    expiring: number;
    permanent: number;
    expiresAt?: string | null;
  } | null;
  user: JwtPayloadType | undefined;
  logger: EndpointLogger;
}

export function SidebarFooter({
  locale,
  credits,
  user,
  logger,
}: SidebarFooterProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Div className="border-t border-border bg-background">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* Compact Credits Bar - Always Visible */}
        {credits && (
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-10 px-3 flex flex-row items-center justify-between hover:bg-accent/50 rounded-none border-b border-border/50"
            >
              <Div className="flex flex-row items-center gap-2 min-w-0">
                <Coins className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <Span
                  className="text-sm font-medium truncate"
                  suppressHydrationWarning
                >
                  {credits.total === 1
                    ? t("app.chat.credits.credit", { count: credits.total })
                    : t("app.chat.credits.credits", { count: credits.total })}
                </Span>
              </Div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </Button>
          </CollapsibleTrigger>
        )}

        {/* Expandable Content */}
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <Div className="px-2 py-2 flex flex-col gap-1 bg-muted/30">
            {/* Credits Breakdown */}
            {credits && (
              <Div className="px-2 py-2 flex flex-col gap-1.5 text-xs">
                {credits.free > 0 && (
                  <Div className="flex flex-row justify-between items-center">
                    <Span className="text-muted-foreground">
                      {credits.free === 1
                        ? t("app.chat.credits.freeCredit", {
                            count: credits.free,
                          })
                        : t("app.chat.credits.freeCredits", {
                            count: credits.free,
                          })}
                    </Span>
                    <Span>{credits.free}</Span>
                  </Div>
                )}
                {credits.expiring > 0 && (
                  <Div className="flex flex-row justify-between items-center">
                    <Span className="text-muted-foreground">
                      {credits.expiring === 1
                        ? t("app.chat.credits.expiringCredit", {
                            count: credits.expiring,
                          })
                        : t("app.chat.credits.expiringCredits", {
                            count: credits.expiring,
                          })}
                    </Span>
                    <Span>{credits.expiring}</Span>
                  </Div>
                )}
                {credits.permanent > 0 && (
                  <Div className="flex flex-row justify-between items-center">
                    <Span className="text-muted-foreground">
                      {credits.permanent === 1
                        ? t("app.chat.credits.permanentCredit", {
                            count: credits.permanent,
                          })
                        : t("app.chat.credits.permanentCredits", {
                            count: credits.permanent,
                          })}
                    </Span>
                    <Span>{credits.permanent}</Span>
                  </Div>
                )}
                {credits.expiresAt && (
                  <Div className="flex flex-row justify-between items-center pt-1 border-t border-border/50">
                    <Span className="text-muted-foreground">
                      {t("app.chat.credits.expiresAt")}
                    </Span>
                    <Span>
                      {new Date(credits.expiresAt).toLocaleDateString()}
                    </Span>
                  </Div>
                )}
              </Div>
            )}

            {/* Navigation Links */}
            <Div className="flex flex-col gap-0.5">
              <Link href={`/${locale}/subscription`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-xs"
                >
                  <Coins className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.subscription")}
                </Button>
              </Link>
              <Link href={`/${locale}/story`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-xs"
                >
                  <Info className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.about")}
                </Button>
              </Link>
              <Link href={`/${locale}/help`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-xs"
                >
                  <HelpCircle className="h-3.5 w-3.5 mr-2" />
                  {t("app.chat.credits.navigation.help")}
                </Button>
              </Link>
            </Div>
          </Div>
        </CollapsibleContent>

        {/* User Menu - Always Visible */}
        <Div className="px-2 py-2">
          <UserMenu user={user} locale={locale} logger={logger} />
        </Div>
      </Collapsible>
    </Div>
  );
}
