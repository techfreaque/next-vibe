/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { Box } from "next-vibe-ui/ui/icons/Box";
import { Database } from "next-vibe-ui/ui/icons/Database";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Layout } from "next-vibe-ui/ui/icons/Layout";
import { Menu } from "next-vibe-ui/ui/icons/Menu";
import { Navigation } from "next-vibe-ui/ui/icons/Navigation";
import { Palette } from "next-vibe-ui/ui/icons/Palette";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
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
import { ColorsPreview } from "./colors";
import { DataDisplayPreview } from "./data-display";
import { FeedbackPreview } from "./feedback";
import { FormsPreview } from "./forms";
import { LayoutsPreview } from "./layouts";
import { NavigationPreview } from "./navigation";
import { OverlaysPreview } from "./overlays";
import { PaletteSwitcher } from "./palette-switcher";
import { SpecialPreview } from "./special";
import { UnifiedWidgetsPreview } from "./unified-widgets";

function SidebarNavButton({
  targetId,
  icon: IconComponent,
  label,
}: {
  targetId: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}): React.JSX.Element {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      size="sm"
      onClick={() => {
        if (!platform.isReactNative) {
          document
            .querySelector(`#${targetId}`)
            ?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      <IconComponent className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}

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
                    FOUNDATIONS
                  </P>
                  <SidebarNavButton
                    targetId="colors"
                    icon={Palette}
                    label="Colors"
                  />
                  <SidebarNavButton
                    targetId="data-display"
                    icon={Database}
                    label="Typography & Data"
                  />

                  <P className="px-2 text-xs font-semibold text-muted-foreground mb-2 mt-4">
                    COMPONENTS
                  </P>
                  <SidebarNavButton
                    targetId="buttons"
                    icon={Star}
                    label="Buttons & Actions"
                  />
                  <SidebarNavButton
                    targetId="forms"
                    icon={Box}
                    label="Forms & Inputs"
                  />
                  <SidebarNavButton
                    targetId="feedback"
                    icon={Sparkles}
                    label="Feedback"
                  />
                  <SidebarNavButton
                    targetId="layouts"
                    icon={Layout}
                    label="Layouts"
                  />
                  <SidebarNavButton
                    targetId="navigation"
                    icon={Navigation}
                    label="Navigation"
                  />
                  <SidebarNavButton
                    targetId="overlays"
                    icon={Layers}
                    label="Overlays"
                  />

                  <P className="px-2 text-xs font-semibold text-muted-foreground mb-2 mt-4">
                    ADVANCED
                  </P>
                  <SidebarNavButton
                    targetId="advanced"
                    icon={Sparkles}
                    label="Motion & Details"
                  />
                  <SidebarNavButton
                    targetId="special"
                    icon={Database}
                    label="Markdown & Tables"
                  />

                  <P className="px-2 text-xs font-semibold text-muted-foreground mb-2 mt-4">
                    UNIFIED INTERFACE
                  </P>
                  <SidebarNavButton
                    targetId="unified-widgets"
                    icon={Box}
                    label="Unified Widgets (59)"
                  />
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
          <Div className="space-y-4">
            <H1>Vibe UI Component Library</H1>
            <Large className="text-muted-foreground">
              Comprehensive showcase of every component and variant
            </Large>
            <Div className="p-4 rounded-lg border bg-card">
              <H4 className="mb-3 text-sm font-semibold">Color Palette</H4>
              <PaletteSwitcher />
            </Div>
          </Div>

          <Separator />
          <Div id="colors">
            <ColorsPreview />
          </Div>

          <Separator />
          <Div id="data-display">
            <DataDisplayPreview />
          </Div>

          <Separator />
          <Div id="buttons">
            <ButtonsPreview />
          </Div>

          <Separator />
          <Div id="forms">
            <FormsPreview />
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
          <Div id="advanced">
            <AdvancedPreview />
          </Div>

          <Separator />
          <Div id="special">
            <SpecialPreview />
          </Div>

          <Separator />
          <Div id="unified-widgets">
            <UnifiedWidgetsPreview />
          </Div>
        </Container>
      </SidebarLayout>
      <Toaster />
    </>
  );
}
