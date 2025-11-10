/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import type { JSX } from "react";

import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { Badge } from "next-vibe-ui/ui/badge";
import { Progress } from "next-vibe-ui/ui/progress";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { toast } from "sonner";
import { Button } from "next-vibe-ui/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Div } from "next-vibe-ui/ui/div";
import { Section } from "next-vibe-ui/ui/section";
import { H2, H3 } from "next-vibe-ui/ui/typography";

export function FeedbackPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Feedback Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Alert</H3>
            <Div className="space-y-4">
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert.</AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert.
                </AlertDescription>
              </Alert>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Badge</H3>
            <Div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Avatar</H3>
            <Div className="flex flex-wrap gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Progress</H3>
            <Div className="space-y-4">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Skeleton</H3>
            <Div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Toast</H3>
            <Div className="flex flex-wrap gap-2">
              <Button onClick={() => toast("Default toast")}>
                Default Toast
              </Button>
              <Button onClick={() => toast.success("Success!")}>
                Success Toast
              </Button>
              <Button onClick={() => toast.error("Error!")}>Error Toast</Button>
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
