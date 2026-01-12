/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import {
  Box,
  Database,
  Layers,
  Layout,
  Menu,
  Navigation,
  Palette,
  Sparkles,
} from "next-vibe-ui/ui/icons";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Separator } from "next-vibe-ui/ui/separator";
import { SidebarLayout } from "next-vibe-ui/ui/sidebar";
import { Toaster } from "next-vibe-ui/ui/sonner";
import { H1, H4, Large, P } from "next-vibe-ui/ui/typography";
import { useState } from "react";

import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { ThemeToggle } from "../../_components/theme-toggle";
import { AdvancedPreview } from "./advanced";
import { ButtonsPreview } from "./buttons";
import { DataDisplayPreview } from "./data-display";
import { FeedbackPreview } from "./feedback";
import { FormsPreview } from "./forms";
import { LayoutsPreview } from "./layouts";
import { NavigationPreview } from "./navigation";
import { OverlaysPreview } from "./overlays";
import { SpecialPreview } from "./special";

export function DesignTestPageLayout({
  locale,
}: {
  locale: CountryLanguage;
}): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <SidebarLayout
        className={
          platform.isReactNative
            ? "flex flex-1 overflow-hidden bg-background"
            : "flex h-dvh overflow-hidden bg-background"
        }
        topBarLeft={
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Div className="flex flex-row items-center bg-card backdrop-blur-sm shadow-sm rounded-md px-3 h-9">
              <H4 className="font-semibold text-sm text-card-foreground">
                Vibe UI Components
              </H4>
            </Div>
          </>
        }
        topBarRight={<ThemeToggle locale={locale} />}
        sidebar={
          <>
            <Div className="bg-background flex flex-col gap-0 pt-15" />
            <Div className="flex-1 p-4">
              <ScrollArea className="h-full">
                <Div className="flex flex-col gap-1">
                  <P className="px-2 text-xs font-semibold text-muted-foreground mb-2">
                    COMPONENTS
                  </P>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#buttons")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Buttons
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#forms")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Box className="h-4 w-4 mr-2" />
                    Forms
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#feedback")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Feedback
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#layouts")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Layouts
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#navigation")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigation
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#overlays")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Overlays
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#data-display")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Data Display
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#advanced")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => {
                      if (!platform.isReactNative) {
                        document
                          .querySelector("#special")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Special
                  </Button>
                </Div>
              </ScrollArea>
            </Div>
            <Div className="p-4 border-t border-border">
              <P className="text-xs text-muted-foreground text-center">
                Vibe UI Library
              </P>
            </Div>
          </>
        }
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        closeSidebarLabel="Close sidebar"
      >
        <Container className="max-w-full mx-auto pt-15 pb-10 space-y-12 px-6">
          <Div className="space-y-2">
            <H1>Vibe UI Component Library</H1>
            <Large className="text-muted-foreground">
              Demo of Vibe UI components
            </Large>
          </Div>

          <Separator />
          <Div id="buttons">
            <ButtonsPreview />
          </Div>

          <Separator />
          <Div id="feedback">
            <FeedbackPreview />
          </Div>

          <Separator />
          <Div id="layouts">
            <LayoutsPreview />
          </Div>

          <Separator />
          <Div id="navigation">
            <NavigationPreview />
          </Div>

          <Separator />
          <Div id="overlays">
            <OverlaysPreview />
          </Div>

          <Separator />
          <Div id="data-display">
            <DataDisplayPreview />
          </Div>

          <Separator />
          <Div id="advanced">
            <AdvancedPreview />
          </Div>

          <Separator />
          <Div id="special">
            <SpecialPreview />
          </Div>

          <Separator />
          <Div id="forms">
            <FormsPreview />
          </Div>
        </Container>
      </SidebarLayout>
      <Toaster />
    </>
  );
}
