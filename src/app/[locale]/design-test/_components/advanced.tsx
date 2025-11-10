/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import type { JSX } from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "next-vibe-ui/ui/resizable";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { AspectRatio } from "next-vibe-ui/ui/aspect-ratio";
import { NumberInput } from "next-vibe-ui/ui/number-input";
import { PhoneField } from "next-vibe-ui/ui/phone-field";
import { Div } from "next-vibe-ui/ui/div";
import { Section } from "next-vibe-ui/ui/section";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { Label } from "next-vibe-ui/ui/label";
import { useState } from "react";

export function AdvancedPreview(): JSX.Element {
  const [phoneValue, setPhoneValue] = useState("");
  const [numberValue, setNumberValue] = useState(0);

  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Advanced Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Resizable Panels</H3>
            <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border">
              <ResizablePanel defaultSize={50}>
                <Div className="flex h-full items-center justify-center p-6">
                  <P>Panel 1</P>
                </Div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <Div className="flex h-full items-center justify-center p-6">
                  <P>Panel 2</P>
                </Div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </Div>

          <Div className="space-y-2">
            <H3>Scroll Area</H3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <Div className="space-y-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <P key={i}>
                    Scrollable content item {i + 1}. This is a long piece of text to demonstrate scrolling behavior.
                  </P>
                ))}
              </Div>
            </ScrollArea>
          </Div>

          <Div className="space-y-2">
            <H3>Aspect Ratio</H3>
            <Div className="w-full max-w-md">
              <AspectRatio ratio={16 / 9}>
                <Div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
                  <P>16:9 Aspect Ratio</P>
                </Div>
              </AspectRatio>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Number Input</H3>
            <Div className="max-w-md space-y-2">
              <Label>Enter a number</Label>
              <NumberInput value={numberValue} onChange={setNumberValue} />
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Phone Field</H3>
            <Div className="max-w-md space-y-2">
              <Label>Phone number</Label>
              <PhoneField value={phoneValue} onChange={setPhoneValue} placeholder="Enter phone number" />
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
