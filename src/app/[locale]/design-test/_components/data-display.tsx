/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import type { JSX } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "next-vibe-ui/ui/carousel";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "next-vibe-ui/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  H1,
  H2,
  H3,
  H4,
  P,
  BlockQuote,
  Lead,
  Large,
  Small,
  Muted,
} from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Title } from "next-vibe-ui/ui/title";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "next-vibe-ui/ui/pagination";
import { Div } from "next-vibe-ui/ui/div";
import { Section } from "next-vibe-ui/ui/section";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export function DataDisplayPreview(): JSX.Element {
  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Data Display Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Typography</H3>
            <Div className="space-y-2">
              <Title level={1}>This is a Title component</Title>
              <H1>Heading 1</H1>
              <H2>Heading 2</H2>
              <H3>Heading 3</H3>
              <H4>Heading 4</H4>
              <P>
                This is a paragraph with{" "}
                <Span className="font-bold">bold text</Span> and{" "}
                <Span className="italic">italic text</Span>.
              </P>
              <BlockQuote>
                This is a blockquote component for displaying quoted text.
              </BlockQuote>
              <Lead>
                This is lead text that stands out from regular paragraphs.
              </Lead>
              <Large>Large text variant</Large>
              <Small>Small text variant</Small>
              <Muted>Muted text variant</Muted>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Table</H3>
            <Table>
              <TableCaption>A list of sample data</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>$350.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Div>

          <Div className="space-y-2">
            <H3>Chart</H3>
            <Card>
              <CardContent className="pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </Div>

          <Div className="space-y-2">
            <H3>Carousel</H3>
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
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
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Div>

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
