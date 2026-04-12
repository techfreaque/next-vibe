/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Progress } from "next-vibe-ui/ui/progress";
import { Section } from "next-vibe-ui/ui/section";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { H2, H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { toast } from "sonner";

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

              <Alert variant="destructive" icon={AlertCircle}>
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert.
                </AlertDescription>
              </Alert>

              <Alert variant="success" icon={CheckCircle}>
                <AlertTitle>Success Alert</AlertTitle>
                <AlertDescription>This is a success alert.</AlertDescription>
              </Alert>

              <Alert variant="warning" icon={AlertTriangle}>
                <AlertTitle>Warning Alert</AlertTitle>
                <AlertDescription>This is a warning alert.</AlertDescription>
              </Alert>

              <Alert variant="info" icon={Info}>
                <AlertTitle>Info Alert</AlertTitle>
                <AlertDescription>This is an info alert.</AlertDescription>
              </Alert>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Badge</H3>
            <Div className="flex flex-row flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="notification">Notification</Badge>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Avatar</H3>
            <Div className="flex flex-row flex-wrap gap-2">
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
            <Div className="flex flex-row flex-wrap gap-2">
              <Button onClick={() => toast("Default toast")}>
                Default Toast
              </Button>
              <Button
                variant="success"
                onClick={() => toast.success("Success!")}
              >
                Success Toast
              </Button>
              <Button
                variant="destructive"
                onClick={() => toast.error("Error!")}
              >
                Error Toast
              </Button>
              <Button
                variant="warning"
                onClick={() => toast.warning("Warning!")}
              >
                Warning Toast
              </Button>
              <Button variant="info" onClick={() => toast.info("Info!")}>
                Info Toast
              </Button>
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
