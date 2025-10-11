import type { JSX, ReactNode } from "react";

export default function SignupLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <div className="container max-w-xl mx-auto py-8 px-4">{children}</div>;
}
