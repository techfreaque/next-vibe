"use client";

import type { Route } from "next";
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
import { Div } from "next-vibe-ui/ui/div";
import { Folder } from "next-vibe-ui/ui/icons/Folder";
import { List } from "next-vibe-ui/ui/icons/List";
import { Play } from "next-vibe-ui/ui/icons/Play";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Link } from "next-vibe-ui/ui/link";
import { cn } from "next-vibe/shared/utils";
import type { ComponentType, JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface SshTabsNavProps {
  locale: CountryLanguage;
}

export function SshTabsNav({ locale }: SshTabsNavProps): JSX.Element {
  const pathname = usePathname();

  const tabs: Array<{
    value: string;
    href: Route;
    icon: ComponentType<{ className?: string }>;
    label: string;
  }> = [
    {
      value: "terminal",
      href: `/${locale}/admin/ssh/terminal`,
      icon: Terminal,
      label: "Terminal",
    },
    {
      value: "connections",
      href: `/${locale}/admin/ssh/connections`,
      icon: List,
      label: "Connections",
    },
    {
      value: "exec",
      href: `/${locale}/admin/ssh/exec`,
      icon: Play,
      label: "Exec",
    },
    {
      value: "users",
      href: `/${locale}/admin/ssh/users`,
      icon: Users,
      label: "Users",
    },
    {
      value: "files",
      href: `/${locale}/admin/ssh/files`,
      icon: Folder,
      label: "Files",
    },
  ];

  return (
    <Div className="inline-flex h-11 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground border border-border w-full">
      <Div className="grid w-full grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </Div>
    </Div>
  );
}
