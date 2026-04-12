/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { AspectRatio } from "next-vibe-ui/ui/aspect-ratio";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Section } from "next-vibe-ui/ui/section";
import { Separator } from "next-vibe-ui/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

export function LayoutsPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Layout Components</H2>

        <Div className="space-y-6">
          {/* Card */}
          <Div className="space-y-2">
            <H3>Card</H3>
            <Div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Full Card</CardTitle>
                  <CardDescription>With all sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <P>Card content area with some descriptive text.</P>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <P>Minimal card with just a header and content.</P>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Highlighted Card</CardTitle>
                  <CardDescription>With primary border</CardDescription>
                </CardHeader>
                <CardContent>
                  <P>Custom border color for emphasis.</P>
                </CardContent>
              </Card>
            </Div>
          </Div>

          {/* Separator */}
          <Div className="space-y-2">
            <H3>Separator</H3>
            <Div>
              <P>Content above horizontal separator</P>
              <Separator className="my-4" />
              <P>Content below horizontal separator</P>
            </Div>
          </Div>

          {/* Tabs */}
          <Div className="space-y-2">
            <H3>Tabs</H3>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Password</TabsTrigger>
                <TabsTrigger value="tab3" disabled>
                  Settings (disabled)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                      Make changes to your account here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <P>Account settings content.</P>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <P>Password change form content.</P>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Div>

          {/* Accordion */}
          <Div className="space-y-2">
            <H3>Accordion</H3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that match the other
                  components' aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  Yes. It is animated by default, but you can disable it if you
                  prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Div>

          {/* Collapsible */}
          <Div className="space-y-2">
            <H3>Collapsible</H3>
            <Collapsible className="w-full space-y-2">
              <Div className="flex items-center justify-between space-x-4 px-4">
                <P className="text-sm font-semibold">3 items starred</P>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </Div>
              <Div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                @radix-ui/primitives
              </Div>
              <CollapsibleContent className="space-y-2">
                <Div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                  @radix-ui/colors
                </Div>
                <Div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                  @stitches/react
                </Div>
              </CollapsibleContent>
            </Collapsible>
          </Div>

          {/* Aspect Ratio */}
          <Div className="space-y-2">
            <H3>Aspect Ratio</H3>
            <Div className="grid gap-4 md:grid-cols-3">
              <Div>
                <P className="text-sm text-muted-foreground mb-2">16:9</P>
                <AspectRatio ratio={16 / 9}>
                  <Div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
                    <P>16:9</P>
                  </Div>
                </AspectRatio>
              </Div>
              <Div>
                <P className="text-sm text-muted-foreground mb-2">4:3</P>
                <AspectRatio ratio={4 / 3}>
                  <Div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
                    <P>4:3</P>
                  </Div>
                </AspectRatio>
              </Div>
              <Div>
                <P className="text-sm text-muted-foreground mb-2">1:1</P>
                <AspectRatio ratio={1}>
                  <Div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
                    <P>1:1</P>
                  </Div>
                </AspectRatio>
              </Div>
            </Div>
          </Div>

          {/* Resizable */}
          <Div className="space-y-2">
            <H3>Resizable Container</H3>
            <Div className="flex flex-row gap-0 min-h-[200px] rounded-lg border overflow-hidden">
              <ResizableContainer
                defaultWidth={300}
                minWidth={200}
                maxWidth={600}
                storageId="design-test-layouts"
                className="bg-muted"
              >
                <Div className="flex h-full items-center justify-center p-6">
                  <P>Resizable Panel (drag edge)</P>
                </Div>
              </ResizableContainer>
              <Div className="flex-1 flex items-center justify-center p-6 bg-background">
                <P>Main Content (auto-flexes)</P>
              </Div>
            </Div>
          </Div>

          {/* Scroll Area */}
          <Div className="space-y-2">
            <H3>Scroll Area</H3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <Div className="space-y-4">
                {
                  // oxlint-disable-next-line no-unused-vars
                  Array.from({ length: 20 }, (_item, i) => {
                    return (
                      <P key={i}>
                        Scrollable content item {i + 1}. This is a long piece of
                        text to demonstrate the scroll area behavior.
                      </P>
                    );
                  })
                }
              </Div>
            </ScrollArea>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
