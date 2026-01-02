import { Div } from "next-vibe-ui/ui/div";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type { JSX, ReactNode } from "react";

export default function SignupLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <Div className="container max-w-2xl mx-auto py-8 px-4">{children}</Div>
    </PageLayout>
  );
}
