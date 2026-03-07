import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { FrameworkContent } from "./_components/framework-content";

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "story/framework",
    title: "app.story.framework.meta.title",
    category: "app.story.framework.meta.category",
    description: "app.story.framework.meta.description",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: "app.story.framework.meta.imageAlt",
    keywords: ["app.story.framework.meta.keywords"],
  });
}

export default async function FrameworkPage(): Promise<JSX.Element> {
  const readmePath = path.join(process.cwd(), "README.md");
  const readmeContent = fs.readFileSync(readmePath, "utf-8");

  return (
    <Div className="min-h-screen">
      <Container size="lg" className="py-12">
        <Div className="prose prose-lg dark:prose-invert mx-auto">
          <FrameworkContent content={readmeContent} />
        </Div>
      </Container>
    </Div>
  );
}
