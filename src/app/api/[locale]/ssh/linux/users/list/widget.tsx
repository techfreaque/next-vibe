/**
 * Linux Users List Widget
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Plus, Users } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { P } from "next-vibe-ui/ui/typography";
import React from "react";

import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { LinuxUsersListResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: LinuxUsersListResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

export function LinuxUsersListContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const router = useRouter();
  const value = field.value;
  const users = value?.users ?? [];

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[400px]">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("app.api.ssh.linux.users.list.widget.title")}
        </Span>
        <Button
          type="button"
          size="sm"
          onClick={() => router.push(`/${locale}/admin/ssh/users/create`)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t("app.api.ssh.linux.users.list.widget.createButton")}
        </Button>
      </Div>

      {users.length === 0 ? (
        <Div className="flex items-center justify-center flex-1 py-12">
          <P className="text-sm text-muted-foreground">
            {t("app.api.ssh.linux.users.list.widget.localModeOnly")}
          </P>
        </Div>
      ) : (
        <Div className="overflow-x-auto flex-1">
          <Table className="w-full text-xs">
            <TableHeader>
              <TableRow className="border-b bg-muted/20">
                <TableHead className="px-4 py-2 text-left font-medium text-muted-foreground">
                  {t("app.api.ssh.linux.users.list.widget.usernameCol")}
                </TableHead>
                <TableHead className="px-4 py-2 text-left font-medium text-muted-foreground">
                  {t("app.api.ssh.linux.users.list.widget.uidCol")}
                </TableHead>
                <TableHead className="px-4 py-2 text-left font-medium text-muted-foreground">
                  {t("app.api.ssh.linux.users.list.widget.homeDirCol")}
                </TableHead>
                <TableHead className="px-4 py-2 text-left font-medium text-muted-foreground">
                  {t("app.api.ssh.linux.users.list.widget.shellCol")}
                </TableHead>
                <TableHead className="px-4 py-2 text-left font-medium text-muted-foreground">
                  {t("app.api.ssh.linux.users.list.widget.statusCol")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.username}
                  className="border-b hover:bg-muted/20"
                >
                  <TableCell className="px-4 py-2 font-mono">
                    {user.username}
                  </TableCell>
                  <TableCell className="px-4 py-2 tabular-nums">
                    {user.uid}
                  </TableCell>
                  <TableCell className="px-4 py-2 font-mono text-muted-foreground truncate max-w-32">
                    {user.homeDir}
                  </TableCell>
                  <TableCell className="px-4 py-2 font-mono text-muted-foreground">
                    {user.shell.split("/").pop()}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Span
                      className={
                        user.locked
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }
                    >
                      {user.locked
                        ? t("app.api.ssh.linux.users.list.widget.locked")
                        : t("app.api.ssh.linux.users.list.widget.active")}
                    </Span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Div>
      )}
    </Div>
  );
}
