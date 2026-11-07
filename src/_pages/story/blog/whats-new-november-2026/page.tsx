import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Brain } from "next-vibe/ui/components/icons/Brain";
import { Bug } from "next-vibe/ui/components/icons/Bug";
import { Code2 } from "next-vibe/ui/components/icons/Code2";
import { Database } from "next-vibe/ui/components/icons/Database";
import { Laptop } from "next-vibe/ui/components/icons/Laptop";
import { ListOrdered } from "next-vibe/ui/components/icons/ListOrdered";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Mic } from "next-vibe/ui/components/icons/Mic";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Package } from "next-vibe/ui/components/icons/Package";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Smartphone } from "next-vibe/ui/components/icons/Smartphone";
import { Square } from "next-vibe/ui/components/icons/Square";
import { Wrench } from "next-vibe/ui/components/icons/Wrench";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX, ReactNode } from "react";

import { configScopedTranslation } from "@/env/i18n";

import {
  ArticleBody,
  ArticleEnd,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleSection,
} from "../../_shared/article";
import {
  CardLink,
  Cta,
  FeatureCard,
  FeatureGrid,
} from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "story/blog/whats-new-november-2026",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface WhatsNewNovember2026PageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<WhatsNewNovember2026PageData> {
  const { locale } = await params;
  return { locale };
}

interface UpdateItem {
  icon: IconComponent;
  title: string;
  body: string;
  link?: { href: string; label: string };
}

/** One group of changes: a 2-column card grid with optional deep links. */
function UpdateGrid({ items }: { items: UpdateItem[] }): JSX.Element {
  return (
    <FeatureGrid columns={2} className="md:gap-4">
      {items.map((item) => (
        <FeatureCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          className="p-5"
          footer={
            item.link !== undefined ? (
              <CardLink href={item.link.href} label={item.link.label} />
            ) : undefined
          }
        >
          {item.body}
        </FeatureCard>
      ))}
    </FeatureGrid>
  );
}

function Group({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <ArticleSection title={title} intro={intro}>
      {children}
    </ArticleSection>
  );
}

export function TanstackPage({
  locale,
}: WhatsNewNovember2026PageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("hero.backToBlog") };
  const blog = `/${locale}/story/blog`;

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.category")}
        readTime={t("hero.readTime")}
        date={formatPostDate("whats-new-november-2026", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <ArticleLead>{t("intro.lead")}</ArticleLead>
          <ArticleP>{t("intro.p1")}</ArticleP>
        </Div>

        <Group title={t("chat.title")} intro={t("chat.intro")}>
          <UpdateGrid
            items={[
              {
                icon: Square,
                title: t("chat.stop.title"),
                body: t("chat.stop.body"),
              },
              {
                icon: MessageSquare,
                title: t("chat.input.title"),
                body: t("chat.input.body"),
              },
              {
                icon: Brain,
                title: t("chat.reasoning.title"),
                body: t("chat.reasoning.body"),
              },
              {
                icon: ListOrdered,
                title: t("chat.queue.title"),
                body: t("chat.queue.body"),
              },
            ]}
          />
        </Group>

        <Group title={t("voice.title")} intro={t("voice.intro")}>
          <UpdateGrid
            items={[
              {
                icon: Smartphone,
                title: t("voice.ios.title"),
                body: t("voice.ios.body"),
              },
              {
                icon: Mic,
                title: t("voice.long.title"),
                body: t("voice.long.body"),
              },
              {
                icon: Monitor,
                title: t("voice.windows.title"),
                body: t("voice.windows.body"),
              },
            ]}
          />
        </Group>

        <Group title={t("agents.title")} intro={t("agents.intro")}>
          <UpdateGrid
            items={[
              {
                icon: Bot,
                title: t("agents.twoWay.title"),
                body: t("agents.twoWay.body"),
                link: {
                  href: `${blog}/hermes-thea-two-way-remote`,
                  label: t("agents.twoWay.link"),
                },
              },
              {
                icon: Code2,
                title: t("agents.coding.title"),
                body: t("agents.coding.body"),
                link: {
                  href: `${blog}/interactive-coding-agent`,
                  label: t("agents.coding.link"),
                },
              },
              {
                icon: Wrench,
                title: t("agents.tools.title"),
                body: t("agents.tools.body"),
              },
            ]}
          />
        </Group>

        <Group title={t("selfHost.title")} intro={t("selfHost.intro")}>
          <UpdateGrid
            items={[
              {
                icon: Database,
                title: t("selfHost.pglite.title"),
                body: t("selfHost.pglite.body"),
              },
              {
                icon: Laptop,
                title: t("selfHost.windows.title"),
                body: t("selfHost.windows.body"),
              },
              {
                icon: Package,
                title: t("selfHost.native.title"),
                body: t("selfHost.native.body"),
              },
              {
                icon: RotateCcw,
                title: t("selfHost.revive.title"),
                body: t("selfHost.revive.body"),
              },
            ]}
          />
        </Group>

        <Group title={t("security.title")} intro={t("security.intro")}>
          <UpdateGrid
            items={[
              {
                icon: Bug,
                title: t("security.e2e.title"),
                body: t("security.e2e.body"),
                link: {
                  href: `${blog}/e2e-tests-found-real-bugs`,
                  label: t("security.e2e.link"),
                },
              },
              {
                icon: Shield,
                title: t("security.patches.title"),
                body: t("security.patches.body"),
              },
              {
                icon: Wrench,
                title: t("security.toolCalls.title"),
                body: t("security.toolCalls.body"),
              },
            ]}
          />
        </Group>

        <ArticleEnd
          back={back}
          title={t("cta.title")}
          subtitle={t("cta.subtitle", { appName })}
          actions={
            <>
              <Cta
                href={`/${locale}/threads`}
                label={t("cta.chat")}
                icon={MessageSquare}
              />
              <Cta
                href={`/${locale}/story/self-host`}
                label={t("cta.selfHost")}
                icon={Server}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function WhatsNewNovember2026Page({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
