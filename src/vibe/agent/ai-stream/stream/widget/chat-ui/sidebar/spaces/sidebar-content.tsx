"use client";

import { Div } from "next-vibe/ui/components/div";
import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { type JSX, type ReactNode, useEffect, useRef, useState } from "react";

import { useChatNavigationStore } from "../../../../../../chat/hooks/use-chat-navigation-store";
import { useSidebarCollapsed } from "../use-sidebar-collapsed";
import { AccountDock, AccountPanel, type SidebarAccountProps } from "./account";
import { SegmentSpaces } from "./navigation";

export function SidebarContent({
  children,
  ...account
}: SidebarAccountProps & {
  children: ReactNode;
}): JSX.Element {
  const { locale, user } = account;
  const root = useChatNavigationStore((s) => s.currentRootFolderId);
  const thread = useChatNavigationStore((s) => s.activeThreadId);
  const previous = useRef({ root, thread });
  const { width } = useWindowSize();
  const [, setCollapsed] = useSidebarCollapsed();
  const [accountOpen, setAccountOpen] = useState(false);

  // Phone drawer: opening a chat closes the drawer, like the committed sidebar.
  useEffect(() => {
    if (
      width < 930 &&
      thread &&
      previous.current.root === root &&
      previous.current.thread !== thread
    ) {
      setCollapsed(true);
    }
    previous.current = { root, thread };
  }, [root, thread, width, setCollapsed]);

  // The folders endpoint owns the thread tree and its actions. Replace its root picker.
  const history = (
    <Div className="flex min-h-0 min-w-0 flex-1 flex-col [&_div:has(>[data-tour=root-folders])]:hidden [&_div:has(+div>[data-tour=root-folders])]:hidden">
      {children}
    </Div>
  );

  return (
    <Div
      data-testid="chat-sidebar"
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background pt-16 pb-[env(safe-area-inset-bottom)]"
    >
      <Div className="shrink-0 px-2 pb-2">
        <SegmentSpaces locale={locale} user={user} />
      </Div>
      {accountOpen && (
        <AccountPanel {...account} onClose={() => setAccountOpen(false)} />
      )}
      <Div
        className={cn("flex min-h-0 flex-1 flex-col", accountOpen && "hidden")}
      >
        {history}
      </Div>
      <Div
        className={cn(
          "shrink-0 border-t border-border pb-2 pt-2",
          accountOpen && "hidden",
        )}
      >
        <AccountDock
          {...account}
          open={accountOpen}
          onOpenChange={setAccountOpen}
        />
      </Div>
    </Div>
  );
}
