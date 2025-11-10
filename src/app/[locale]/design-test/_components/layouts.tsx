/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import type { JSX } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Separator } from "next-vibe-ui/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Section } from "next-vibe-ui/ui/section";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { H2, H3, P } from "next-vibe-ui/ui/typography";

export function LayoutsPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Layout Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Card</H3>
            <Div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <P>Card content area.</P>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <P>A simpler card.</P>
                </CardContent>
              </Card>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Separator</H3>
            <Div>
              <P>Content above separator</P>
              <Separator className="my-4" />
              <P>Content below separator</P>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Tabs</H3>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <Card>
                  <CardHeader>
                    <CardTitle>Tab 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <P>Content for tab 1.</P>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tab 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <P>Content for tab 2.</P>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Div>

          <Div className="space-y-2">
            <H3>Accordion</H3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Section 1</AccordionTrigger>
                <AccordionContent>Content for section 1.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Section 2</AccordionTrigger>
                <AccordionContent>Content for section 2.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Div>

          <Div className="space-y-2">
            <H3>Collapsible</H3>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline">Toggle</Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 border rounded-md p-4">
                <P>Collapsible content.</P>
              </CollapsibleContent>
            </Collapsible>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
