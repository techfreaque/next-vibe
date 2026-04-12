/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Div } from "next-vibe-ui/ui/div";
import { Section } from "next-vibe-ui/ui/section";
import { H2, H3, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

function ColorSwatch({
  bg,
  fg,
  label,
  cssVar,
}: {
  bg: string;
  fg?: string;
  label: string;
  cssVar: string;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-1">
      <Div
        className={`h-16 rounded-md border flex items-center justify-center ${bg} ${fg ?? ""}`}
      >
        <P className="text-xs font-mono font-medium">{label}</P>
      </Div>
      <Muted className="text-[10px] font-mono">{cssVar}</Muted>
    </Div>
  );
}

export function ColorsPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Color Palette & Design Tokens</H2>

        <Div className="space-y-6">
          {/* Core colors */}
          <Div className="space-y-2">
            <H3>Core Colors</H3>
            <Div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <ColorSwatch
                bg="bg-background"
                fg="text-foreground"
                label="Background"
                cssVar="--background"
              />
              <ColorSwatch
                bg="bg-foreground"
                fg="text-background"
                label="Foreground"
                cssVar="--foreground"
              />
              <ColorSwatch
                bg="bg-card"
                fg="text-card-foreground"
                label="Card"
                cssVar="--card"
              />
              <ColorSwatch
                bg="bg-popover"
                fg="text-popover-foreground"
                label="Popover"
                cssVar="--popover"
              />
              <ColorSwatch
                bg="bg-muted"
                fg="text-muted-foreground"
                label="Muted"
                cssVar="--muted"
              />
              <ColorSwatch
                bg="bg-accent"
                fg="text-accent-foreground"
                label="Accent"
                cssVar="--accent"
              />
            </Div>
          </Div>

          {/* Brand colors */}
          <Div className="space-y-2">
            <H3>Brand & Interactive</H3>
            <Div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <ColorSwatch
                bg="bg-primary"
                fg="text-primary-foreground"
                label="Primary"
                cssVar="--primary"
              />
              <ColorSwatch
                bg="bg-secondary"
                fg="text-secondary-foreground"
                label="Secondary"
                cssVar="--secondary"
              />
              <ColorSwatch
                bg="bg-border"
                fg="text-foreground"
                label="Border"
                cssVar="--border"
              />
              <ColorSwatch
                bg="bg-input"
                fg="text-foreground"
                label="Input"
                cssVar="--input"
              />
              <ColorSwatch
                bg="bg-ring"
                fg="text-primary-foreground"
                label="Ring"
                cssVar="--ring"
              />
            </Div>
          </Div>

          {/* Semantic colors */}
          <Div className="space-y-2">
            <H3>Semantic Colors</H3>
            <Div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ColorSwatch
                bg="bg-destructive"
                fg="text-destructive-foreground"
                label="Destructive"
                cssVar="--destructive"
              />
              <ColorSwatch
                bg="bg-success"
                fg="text-success-foreground"
                label="Success"
                cssVar="--success"
              />
              <ColorSwatch
                bg="bg-warning"
                fg="text-warning-foreground"
                label="Warning"
                cssVar="--warning"
              />
              <ColorSwatch
                bg="bg-info"
                fg="text-info-foreground"
                label="Info"
                cssVar="--info"
              />
            </Div>
          </Div>

          {/* Chart colors */}
          <Div className="space-y-2">
            <H3>Chart Colors</H3>
            <Div className="grid grid-cols-5 gap-3">
              <Div className="flex flex-col gap-1">
                <Div className="h-16 rounded-md border bg-[hsl(var(--chart-1))]" />
                <Muted className="text-[10px] font-mono">--chart-1</Muted>
              </Div>
              <Div className="flex flex-col gap-1">
                <Div className="h-16 rounded-md border bg-[hsl(var(--chart-2))]" />
                <Muted className="text-[10px] font-mono">--chart-2</Muted>
              </Div>
              <Div className="flex flex-col gap-1">
                <Div className="h-16 rounded-md border bg-[hsl(var(--chart-3))]" />
                <Muted className="text-[10px] font-mono">--chart-3</Muted>
              </Div>
              <Div className="flex flex-col gap-1">
                <Div className="h-16 rounded-md border bg-[hsl(var(--chart-4))]" />
                <Muted className="text-[10px] font-mono">--chart-4</Muted>
              </Div>
              <Div className="flex flex-col gap-1">
                <Div className="h-16 rounded-md border bg-[hsl(var(--chart-5))]" />
                <Muted className="text-[10px] font-mono">--chart-5</Muted>
              </Div>
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
