/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Heart } from "next-vibe-ui/ui/icons/Heart";
import { Mail } from "next-vibe-ui/ui/icons/Mail";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Section } from "next-vibe-ui/ui/section";
import { Toggle } from "next-vibe-ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "next-vibe-ui/ui/toggle-group";
import { H2, H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

export function ButtonsPreview(): JSX.Element {
  return (
    <Div className="flex flex-col gap-8">
      <Section>
        <H2 className="mb-4">Button & Action Components</H2>

        <Div className="flex flex-col gap-6">
          <Div className="flex flex-col gap-2">
            <H3>Button Variants</H3>
            <Div className="flex flex-row flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
            </Div>
          </Div>

          <Div className="flex flex-col gap-2">
            <H3>Button Sizes</H3>
            <Div className="flex flex-row flex-wrap items-center gap-2">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Star />
              </Button>
            </Div>
          </Div>

          <Div className="flex flex-col gap-2">
            <H3>Disabled States</H3>
            <Div className="flex flex-row flex-wrap gap-2">
              <Button variant="default" disabled>
                Default
              </Button>
              <Button variant="destructive" disabled>
                Destructive
              </Button>
              <Button variant="outline" disabled>
                Outline
              </Button>
              <Button variant="secondary" disabled>
                Secondary
              </Button>
              <Button variant="ghost" disabled>
                Ghost
              </Button>
              <Button variant="link" disabled>
                Link
              </Button>
              <Button variant="success" disabled>
                Success
              </Button>
              <Button variant="warning" disabled>
                Warning
              </Button>
              <Button variant="info" disabled>
                Info
              </Button>
            </Div>
          </Div>

          <Div className="flex flex-col gap-2">
            <H3>Icon Buttons</H3>
            <Div className="flex flex-row flex-wrap items-center gap-2">
              <Button size="icon" variant="default">
                <Plus />
              </Button>
              <Button size="icon" variant="destructive">
                <Heart />
              </Button>
              <Button size="icon" variant="outline">
                <Search />
              </Button>
              <Button size="icon" variant="secondary">
                <Mail />
              </Button>
              <Button size="icon" variant="success">
                <Check />
              </Button>
              <Button size="icon" variant="warning">
                <Star />
              </Button>
              <Button size="icon" variant="info">
                <Search />
              </Button>
            </Div>
          </Div>

          <Div className="flex flex-col gap-2">
            <H3>Buttons with Icons</H3>
            <Div className="flex flex-row flex-wrap gap-2">
              <Button variant="default">
                <Plus /> Create
              </Button>
              <Button variant="destructive">
                <Heart /> Favorite
              </Button>
              <Button variant="success">
                <Check /> Confirm
              </Button>
              <Button variant="warning">
                <Star /> Star
              </Button>
              <Button variant="info">
                <Search /> Search
              </Button>
              <Button variant="outline">
                <Mail /> Send
              </Button>
            </Div>
          </Div>

          <Div className="flex flex-col gap-2">
            <H3>Toggle</H3>
            <Div className="flex flex-row flex-wrap gap-2">
              <Toggle>Toggle</Toggle>
              <Toggle variant="outline">Toggle Outline</Toggle>
              <Toggle size="sm">Small</Toggle>
              <Toggle size="lg">Large</Toggle>
            </Div>
          </Div>

          <Div className="flex flex-col gap-2">
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
