import { Div } from "next-vibe-ui/ui/div";
import type { JSX, ReactNode } from "react";

export interface SignupLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader(): Promise<
  Omit<SignupLayoutData, "children">
> {
  return {};
}

export function TanstackPage({ children }: SignupLayoutData): JSX.Element {
  return (
    <Div className="container max-w-2xl mx-auto py-8 px-4">{children}</Div>
  );
}

export default function SignupLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TanstackPage>{children}</TanstackPage>;
}
