/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "next-vibe-ui/ui/carousel";
import { Div } from "next-vibe-ui/ui/div";
import { Kbd } from "next-vibe-ui/ui/kbd";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "next-vibe-ui/ui/pagination";
import { Section } from "next-vibe-ui/ui/section";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import { Title } from "next-vibe-ui/ui/title";
import {
  BlockQuote,
  Code,
  H1,
  H2,
  H3,
  H4,
  Large,
  Lead,
  Muted,
  P,
  Small,
} from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

export function DataDisplayPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Data Display Components</H2>

        <Div className="space-y-6">
          {/* Typography */}
          <Div className="space-y-2">
            <H3>Typography</H3>
            <Div className="space-y-3">
              <Title level={1}>Title Component (level 1)</Title>
              <Title level={2}>Title Component (level 2)</Title>
              <Title level={3}>Title Component (level 3)</Title>
              <Separator className="my-2" />
              <H1>Heading 1 - The largest heading</H1>
              <H2 className="border-none pb-0">Heading 2 - Section heading</H2>
              <H3>Heading 3 - Subsection heading</H3>
              <H4>Heading 4 - Minor heading</H4>
              <Separator className="my-2" />
              <P>
                Paragraph - Regular body text with{" "}
                <Span className="font-bold">bold text</Span>,{" "}
                <Span className="italic">italic text</Span>, and{" "}
                <Span className="underline">underlined text</Span>.
              </P>
              <Lead>
                Lead - Stands out from regular paragraphs. Use for intros.
              </Lead>
              <Large>Large - Bigger text for emphasis</Large>
              <Small>Small - Fine print and secondary info</Small>
              <Muted>Muted - De-emphasized helper text</Muted>
              <BlockQuote>
                BlockQuote - For quotations or callout text. The best way to
                predict the future is to create it.
              </BlockQuote>
              <P>
                Inline <Code>code</Code> renders with a monospace background.
                Use it for variable names like <Code>useState</Code> or values
                like <Code>true</Code>.
              </P>
            </Div>
          </Div>

          {/* Kbd */}
          <Div className="space-y-2">
            <H3>Keyboard Shortcut (Kbd)</H3>
            <Div className="flex flex-row flex-wrap items-center gap-2">
              <Kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Span className="text-xs">⌘</Span>K
              </Kbd>
              <Kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Span className="text-xs">⌘</Span>C
              </Kbd>
              <Kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl+Shift+P
              </Kbd>
              <Kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Esc
              </Kbd>
            </Div>
          </Div>

          {/* Separator */}
          <Div className="space-y-2">
            <H3>Separator</H3>
            <P>Horizontal separator:</P>
            <Separator />
            <Div className="flex h-5 items-center space-x-4 text-sm">
              <Span>Blog</Span>
              <Separator orientation="vertical" />
              <Span>Docs</Span>
              <Separator orientation="vertical" />
              <Span>Source</Span>
            </Div>
          </Div>

          {/* Table */}
          <Div className="space-y-2">
            <H3>Table</H3>
            <Table>
              <TableCaption>Monthly subscription revenue</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV002</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV003</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="text-right">$350.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV004</TableCell>
                  <TableCell>Failed</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$450.00</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$1,200.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Div>

          {/* Carousel */}
          <Div className="space-y-2">
            <H3>Carousel</H3>
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {
                  // oxlint-disable-next-line no-unused-vars
                  Array.from({ length: 5 }, (_item, index) => {
                    return (
                      <CarouselItem key={index}>
                        <Div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <Span className="text-4xl font-semibold">
                                {index + 1}
                              </Span>
                            </CardContent>
                          </Card>
                        </Div>
                      </CarouselItem>
                    );
                  })
                }
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Div>

          {/* Pagination */}
          <Div className="space-y-2">
            <H3>Pagination</H3>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
