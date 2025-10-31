/* eslint-disable i18next/no-literal-string */
/**
 * Next.js-style page component for React Native compatibility testing
 *
 * This file uses Next.js 15 conventions:
 * - Async Server Component
 * - Params as Promise (Next.js 15 requirement)
 * - TypeScript with proper types
 *
 * The index.tsx wrapper handles converting this to work with Expo Router
 */

import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface HomePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export default async function HomePage({
  params,
}: HomePageProps): Promise<JSX.Element> {
  const { locale } = await params;
  return (
    <Div className="flex-1 p-6 bg-background">
      <Div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Div className="text-center space-y-2">
          <H1>Welcome to Next Vibe</H1>
          <P className="text-muted-foreground">
            A unified Next.js and React Native application {locale}
          </P>
        </Div>

        {/* Locale Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Locale</CardTitle>
            <CardDescription>
              Your current language and region settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Div className="flex flex-row items-center space-x-2">
              <Span className="text-2xl font-bold text-primary">{locale}</Span>
            </Div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
            <CardDescription>
              This page works on both web and mobile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Div>
              <H2 className="text-lg mb-2">✅ Unified Components</H2>
              <P className="text-muted-foreground">
                Using next-vibe-ui components that work seamlessly across
                platforms
              </P>
            </Div>
            <Div>
              <H2 className="text-lg mb-2">✅ Type Safety</H2>
              <P className="text-muted-foreground">
                Full TypeScript support with proper type inference
              </P>
            </Div>
            <Div>
              <H2 className="text-lg mb-2">✅ Async Server Components</H2>
              <P className="text-muted-foreground">
                Next.js 15 async page components work in React Native
              </P>
            </Div>
          </CardContent>
          <CardFooter>
            <Div>
            <Link href={`/${locale}/chat`} asChild>
              <Button className="w-full">
                <Span>Go to Chat</Span>
              </Button>
            </Link>
            <Link href={`/${locale}/help`} asChild>
              <Button className="w-full">
                <Span>Go to Help</Span>
              </Button>
            </Link>
            </Div> 
          </CardFooter>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Div className="space-y-2">
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">Platform:</Span>
                <Span className="font-medium">Universal</Span>
              </Div>
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">Routing:</Span>
                <Span className="font-medium">File-based</Span>
              </Div>
              <Div className="flex flex-row justify-between">
                <Span className="text-muted-foreground">Styling:</Span>
                <Span className="font-medium">NativeWind</Span>
              </Div>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
}
