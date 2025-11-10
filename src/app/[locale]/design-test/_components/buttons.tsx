/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import type { JSX } from "react";

import { Button } from "next-vibe-ui/ui/button";
import { Toggle } from "next-vibe-ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "next-vibe-ui/ui/toggle-group";
import { Div } from "next-vibe-ui/ui/div";
import { Section } from "next-vibe-ui/ui/section";
import { H2, H3 } from "next-vibe-ui/ui/typography";

export function ButtonsPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Button & Action Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Button Variants</H3>
            <Div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Button Sizes</H3>
            <Div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Toggle</H3>
            <Div className="flex flex-wrap gap-2">
              <Toggle>Toggle</Toggle>
              <Toggle variant="outline">Toggle Outline</Toggle>
              <Toggle size="sm">Small</Toggle>
              <Toggle size="lg">Large</Toggle>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Toggle Group</H3>
            <ToggleGroup type="single">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
