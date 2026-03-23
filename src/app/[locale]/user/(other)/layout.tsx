import { Div } from "next-vibe-ui/ui/div";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

export interface OtherUserLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<OtherUserLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: OtherUserLayoutData): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <Div className="container max-w-xl mx-auto py-8 px-4">{children}</Div>
    </PageLayout>
  );
}

export default function OtherUserLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
