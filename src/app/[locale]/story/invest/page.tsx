import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { FrameworkContent } from "../framework/_components/framework-content";

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "story/invest",
    title: "app.story.invest.meta.title",
    category: "app.story.invest.meta.category",
    description: "app.story.invest.meta.description",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: "app.story.invest.meta.imageAlt",
    keywords: ["app.story.invest.meta.keywords"],
  });
}

export default async function InvestPage(): Promise<JSX.Element> {
  const investPath = path.join(process.cwd(), "docs", "INVEST.md");
  const investContent = fs.readFileSync(investPath, "utf-8");

  return (
    <Div className="min-h-screen">
      <Container size="lg" className="py-12">
        <Div className="prose prose-lg dark:prose-invert mx-auto">
          <FrameworkContent content={investContent} />
        </Div>
      </Container>
    </Div>
  );
}
