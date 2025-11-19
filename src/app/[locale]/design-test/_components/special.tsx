/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import type { JSX } from "react";

import { DataTable } from "next-vibe-ui/ui/data-table";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Image } from "next-vibe-ui/ui/image";
import { Div } from "next-vibe-ui/ui/div";
import { Section } from "next-vibe-ui/ui/section";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { Card, CardContent } from "next-vibe-ui/ui/card";

const sampleData = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "User" },
];

const columns = [
  {
    accessorKey: "name",
    header: (): React.ReactElement => <P className="font-medium">Name</P>,
    cell: ({ getValue }: { getValue: () => unknown }): React.ReactElement => <P>{String(getValue())}</P>,
  },
  {
    accessorKey: "email",
    header: (): React.ReactElement => <P className="font-medium">Email</P>,
    cell: ({ getValue }: { getValue: () => unknown }): React.ReactElement => <P>{String(getValue())}</P>,
  },
  {
    accessorKey: "role",
    header: (): React.ReactElement => <P className="font-medium">Role</P>,
    cell: ({ getValue }: { getValue: () => unknown }): React.ReactElement => <P>{String(getValue())}</P>,
  },
];

const markdownContent = `
# Markdown Demo

This is a **bold** text and this is *italic* text.

## Features
- Lists work great
- Code blocks too
- And much more

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`;

export function SpecialPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Special Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Data Table</H3>
            <Card>
              <CardContent className="pt-6">
                <DataTable columns={columns} data={sampleData} />
              </CardContent>
            </Card>
          </Div>

          <Div className="space-y-2">
            <H3>Markdown</H3>
            <Card>
              <CardContent className="pt-6">
                <Markdown content={markdownContent} />
              </CardContent>
            </Card>
          </Div>

          <Div className="space-y-2">
            <H3>Image</H3>
            <Card>
              <CardContent className="pt-6">
                <Image
                  src="/images/example-image.png"
                  alt="Sample image"
                  width={400}
                  height={300}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
