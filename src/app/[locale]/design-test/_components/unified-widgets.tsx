/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { DatePicker } from "next-vibe-ui/ui/date-picker";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { MultiSelect } from "next-vibe-ui/ui/multi-select";
import { NumberInput } from "next-vibe-ui/ui/number-input";
import { PhoneField } from "next-vibe-ui/ui/phone-field";
import { Pre } from "next-vibe-ui/ui/pre";
import { Progress } from "next-vibe-ui/ui/progress";
import { Section } from "next-vibe-ui/ui/section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Separator } from "next-vibe-ui/ui/separator";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "next-vibe-ui/ui/slider";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { Title } from "next-vibe-ui/ui/title";
import { Code, H2, H3, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink as ExternalLinkIcon,
  FileText,
  Inbox,
  Loader2,
  Minus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const WIDGET_BASE =
  "src/app/api/[locale]/system/unified-interface/unified-ui/widgets";

function WidgetCard({
  name,
  category,
  description,
  children,
}: {
  name: string;
  category: string;
  description: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {category}
          </Badge>
        </Div>
        <CardDescription className="text-xs">{description}</CardDescription>
        <Muted className="text-[10px] font-mono">
          {WIDGET_BASE}/{category}/{name.toLowerCase().replace(/\s+/g, "-")}
          /react.tsx
        </Muted>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// =============================================================================
// CONTAINERS
// =============================================================================

function ContainersSection(): JSX.Element {
  return (
    <Div className="space-y-6">
      <H3>Containers (3 widgets)</H3>
      <Div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* container */}
        <WidgetCard
          name="Container"
          category="containers"
          description="Wraps child widgets in Card or plain layout with optional title, description, submit button, and form alert."
        >
          <Card>
            <CardHeader>
              <Div className="flex items-center justify-between">
                <Div>
                  <CardTitle>User Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </Div>
              </Div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Div className="space-y-2">
                <Label>Display Name</Label>
                <Input defaultValue="Max Mustermann" />
              </Div>
              <Button className="w-full">Submit</Button>
            </CardContent>
          </Card>
        </WidgetCard>

        {/* code-output */}
        <WidgetCard
          name="Code Output"
          category="containers"
          description="Displays code blocks with syntax highlighting, line numbers, and language labels."
        >
          <Div className="rounded-md border bg-muted/30 overflow-hidden">
            <Div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/50">
              <Span className="text-[11px] text-muted-foreground font-mono">
                typescript
              </Span>
            </Div>
            <Pre className="p-3 text-sm font-mono overflow-x-auto">
              <Code>{`function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

greet("World");`}</Code>
            </Pre>
          </Div>
        </WidgetCard>

        {/* pagination */}
        <WidgetCard
          name="Pagination"
          category="containers"
          description="Page navigation with items-per-page selector and prev/next controls."
        >
          <Div className="flex items-center justify-between border-t pt-3">
            <Div className="flex items-center gap-2">
              <Span className="text-sm text-muted-foreground">
                Page 2 of 12
              </Span>
            </Div>
            <Div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Div>
          </Div>
        </WidgetCard>
      </Div>
    </Div>
  );
}

// =============================================================================
// DISPLAY-ONLY
// =============================================================================

function DisplayOnlySection(): JSX.Element {
  return (
    <Div className="space-y-6">
      <H3>Display Only (20 widgets)</H3>
      <Div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* alert */}
        <WidgetCard
          name="Alert"
          category="display-only"
          description="Displays alert messages with configurable variants (default, destructive, info)."
        >
          <Div className="space-y-3">
            <Alert>
              <AlertDescription>
                Default alert with informational message.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertDescription>Destructive alert for errors.</AlertDescription>
            </Alert>
          </Div>
        </WidgetCard>

        {/* avatar */}
        <WidgetCard
          name="Avatar"
          category="display-only"
          description="Displays user avatars with image and fallback initials. Supports xs/sm/md/lg/xl sizes."
        >
          <Div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">XS</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">SM</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User avatar"
              />
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-base">LG</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">XL</AvatarFallback>
            </Avatar>
          </Div>
        </WidgetCard>

        {/* badge */}
        <WidgetCard
          name="Badge"
          category="display-only"
          description="Displays badges with variant-based styling and enum option mapping."
        >
          <Div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Info</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Pending</Badge>
            <Badge variant="notification">Warning</Badge>
            <Badge className="text-[10px] px-1.5 py-0">XS Size</Badge>
            <Badge className="text-sm px-3 py-1">LG Size</Badge>
          </Div>
        </WidgetCard>

        {/* chart */}
        <WidgetCard
          name="Chart"
          category="display-only"
          description="Renders line, bar, area, and pie charts from definition-driven data."
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <Div className="flex items-end gap-1 h-16">
                <Div className="flex-1 bg-primary/80 rounded-t h-[40%]" />
                <Div className="flex-1 bg-primary/80 rounded-t h-[65%]" />
                <Div className="flex-1 bg-primary/80 rounded-t h-[45%]" />
                <Div className="flex-1 bg-primary/80 rounded-t h-[80%]" />
                <Div className="flex-1 bg-primary/80 rounded-t h-[55%]" />
                <Div className="flex-1 bg-primary/80 rounded-t h-[90%]" />
                <Div className="flex-1 bg-primary/80 rounded-t h-[70%]" />
              </Div>
              <Div className="flex justify-between mt-1">
                <Span className="text-[10px] text-muted-foreground">Jan</Span>
                <Span className="text-[10px] text-muted-foreground">Jul</Span>
              </Div>
            </CardContent>
          </Card>
        </WidgetCard>

        {/* code-quality-summary */}
        <WidgetCard
          name="Code Quality Summary"
          category="display-only"
          description="Displays summary statistics for code quality checks (errors, warnings, files)."
        >
          <Div className="grid grid-cols-3 gap-3">
            <Div className="text-center p-2 rounded-md bg-destructive/10">
              <Span className="text-lg font-bold text-destructive">12</Span>
              <Div className="text-[10px] text-muted-foreground">Errors</Div>
            </Div>
            <Div className="text-center p-2 rounded-md bg-yellow-500/10">
              <Span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                34
              </Span>
              <Div className="text-[10px] text-muted-foreground">Warnings</Div>
            </Div>
            <Div className="text-center p-2 rounded-md bg-muted/30">
              <Span className="text-lg font-bold">8</Span>
              <Div className="text-[10px] text-muted-foreground">Files</Div>
            </Div>
          </Div>
        </WidgetCard>

        {/* code-quality-list */}
        <WidgetCard
          name="Code Quality List"
          category="display-only"
          description="Displays code quality issues grouped by file with severity-based styling."
        >
          <Div className="space-y-2 text-sm">
            <Div className="flex items-start gap-2">
              <Badge variant="destructive" className="text-[10px] mt-0.5">
                error
              </Badge>
              <Div>
                <Span className="font-mono text-xs">src/config.ts:42</Span>
                <P className="text-xs text-muted-foreground">
                  Type &apos;string&apos; is not assignable to type
                  &apos;number&apos;
                </P>
              </Div>
            </Div>
            <Div className="flex items-start gap-2">
              <Badge variant="outline" className="text-[10px] mt-0.5">
                warn
              </Badge>
              <Div>
                <Span className="font-mono text-xs">src/utils.ts:17</Span>
                <P className="text-xs text-muted-foreground">
                  Unused variable &apos;temp&apos;
                </P>
              </Div>
            </Div>
          </Div>
        </WidgetCard>

        {/* code-quality-files */}
        <WidgetCard
          name="Code Quality Files"
          category="display-only"
          description="Displays list of files with error and warning counts."
        >
          <Div className="space-y-1.5">
            {[
              { file: "src/config.ts", errors: 3, warnings: 1 },
              { file: "src/utils.ts", errors: 0, warnings: 5 },
              { file: "src/index.ts", errors: 1, warnings: 0 },
            ].map((f) => (
              <Div
                key={f.file}
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/30"
              >
                <Span className="font-mono">{f.file}</Span>
                <Div className="flex gap-2">
                  {f.errors > 0 && (
                    <Badge
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {f.errors}E
                    </Badge>
                  )}
                  {f.warnings > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {f.warnings}W
                    </Badge>
                  )}
                </Div>
              </Div>
            ))}
          </Div>
        </WidgetCard>

        {/* description */}
        <WidgetCard
          name="Description"
          category="display-only"
          description="Displays descriptive text with truncation (line-clamp-2), muted styling."
        >
          <Div className="space-y-2">
            <P className="text-sm text-muted-foreground line-clamp-2">
              This is a description widget that renders muted, small text
              typically used for supplementary information. It automatically
              truncates after two lines with an ellipsis for compact display.
            </P>
            <Span className="text-muted-foreground">&mdash;</Span>
          </Div>
        </WidgetCard>

        {/* empty-state */}
        <WidgetCard
          name="Empty State"
          category="display-only"
          description="Displays centered empty state with optional icon, title, description, and action button."
        >
          <Div className="flex flex-col items-center justify-center py-6 px-4">
            <Inbox className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <P className="font-medium text-center">No results found</P>
            <P className="text-sm text-muted-foreground text-center mt-1">
              Try adjusting your search or filters.
            </P>
            <Button size="sm" className="mt-4">
              Clear Filters
            </Button>
          </Div>
        </WidgetCard>

        {/* icon */}
        <WidgetCard
          name="Icon"
          category="display-only"
          description="Displays an icon from the icon library with customizable container, size, and background."
        >
          <Div className="flex items-center gap-4">
            <Div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
              <Search className="h-4 w-4 text-primary" />
            </Div>
            <Div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
              <FileText className="h-5 w-5" />
            </Div>
            <Div className="flex items-center justify-center h-12 w-12 rounded-lg bg-destructive/10">
              <Edit className="h-6 w-6 text-destructive" />
            </Div>
          </Div>
        </WidgetCard>

        {/* key-value */}
        <WidgetCard
          name="Key Value"
          category="display-only"
          description="Displays record/dictionary data as key-value pairs with badges for numbers."
        >
          <Div className="space-y-2">
            {[
              { key: "Status", value: "Active" },
              { key: "Created", value: "2026-04-11" },
              { key: "Messages", value: 1248 },
            ].map((kv) => (
              <Div
                key={kv.key}
                className="flex items-center justify-between text-sm"
              >
                <Span className="text-muted-foreground">{kv.key}</Span>
                {typeof kv.value === "number" ? (
                  <Badge variant="secondary">{kv.value}</Badge>
                ) : (
                  <Span className="font-medium">{kv.value}</Span>
                )}
              </Div>
            ))}
          </Div>
        </WidgetCard>

        {/* link */}
        <WidgetCard
          name="Link"
          category="display-only"
          description="Renders clickable hyperlinks with external link detection and icon indicator."
        >
          <Div className="space-y-2">
            <Div className="flex items-center gap-1.5">
              <ExternalLink
                href="https://unbottled.ai"
                className="text-sm text-primary hover:underline"
              >
                unbottled.ai
              </ExternalLink>
              <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
            </Div>
            <Div className="flex items-center gap-1.5">
              <ExternalLink
                href="https://github.com"
                className="text-sm text-primary hover:underline"
              >
                GitHub Repository
              </ExternalLink>
              <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
            </Div>
          </Div>
        </WidgetCard>

        {/* loading */}
        <WidgetCard
          name="Loading"
          category="display-only"
          description="Displays loading states with animated spinner and optional progress bar."
        >
          <Div className="space-y-4">
            <Div className="flex items-center gap-3 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <Span className="text-sm text-muted-foreground">
                Loading data...
              </Span>
            </Div>
            <Div className="w-full max-w-xs mx-auto space-y-1">
              <Span className="text-sm text-muted-foreground text-center block">
                Uploading file...
              </Span>
              <Progress value={65} className="h-2" />
              <Span className="text-xs text-muted-foreground text-center block">
                65%
              </Span>
            </Div>
          </Div>
        </WidgetCard>

        {/* markdown */}
        <WidgetCard
          name="Markdown"
          category="display-only"
          description="Renders markdown content with GitHub-flavored styling and syntax highlighting."
        >
          <Div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown
              content={`**Bold text** and *italic text*.\n\n- List item one\n- List item two\n\n\`inline code\` renders nicely.`}
            />
          </Div>
        </WidgetCard>

        {/* metadata */}
        <WidgetCard
          name="Metadata"
          category="display-only"
          description="Displays very small, muted supplementary text (11px) for timestamps and metadata."
        >
          <Div className="space-y-1">
            <Span className="text-[11px] text-muted-foreground/70">
              Created 2 hours ago
            </Span>
            <Div>
              <Span className="text-[11px] text-muted-foreground/70">
                ID: 7f3a2b1c-9d4e-5f6a
              </Span>
            </Div>
            <Div>
              <Span className="text-[11px] text-muted-foreground/70">
                Updated by admin@example.com
              </Span>
            </Div>
          </Div>
        </WidgetCard>

        {/* separator */}
        <WidgetCard
          name="Separator"
          category="display-only"
          description="Renders horizontal line dividers with optional centered label text."
        >
          <Div className="space-y-4">
            <Separator />
            <Div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <Span className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium">
                or continue with
              </Span>
              <Separator className="flex-1" />
            </Div>
          </Div>
        </WidgetCard>

        {/* stat */}
        <WidgetCard
          name="Stat"
          category="display-only"
          description="Displays numeric statistics with labels, trend indicators, and icon support."
        >
          <Div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <Div className="flex items-center justify-between">
                  <Span className="text-xs text-muted-foreground">Revenue</Span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </Div>
                <Span className="text-2xl font-bold">$12.4k</Span>
                <Span className="text-xs text-success ml-1">+12.5%</Span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <Div className="flex items-center justify-between">
                  <Span className="text-xs text-muted-foreground">Errors</Span>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </Div>
                <Span className="text-2xl font-bold text-destructive">23</Span>
                <Span className="text-xs text-destructive ml-1">+8.3%</Span>
              </CardContent>
            </Card>
          </Div>
        </WidgetCard>

        {/* status-indicator */}
        <WidgetCard
          name="Status Indicator"
          category="display-only"
          description="Displays a status badge with semantic color coding (success/warning/error/info/pending)."
        >
          <Div className="flex flex-wrap gap-2">
            <Badge variant="default">Success</Badge>
            <Badge variant="notification">Warning</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="secondary">Info</Badge>
            <Badge variant="outline">Pending</Badge>
          </Div>
        </WidgetCard>

        {/* text */}
        <WidgetCard
          name="Text"
          category="display-only"
          description="Displays text data with labels, links, dates, variants, emphasis, and alignment."
        >
          <Div className="space-y-2">
            <Div className="flex flex-col gap-1">
              <Label className="font-medium">Full Name</Label>
              <Span>John Doe</Span>
            </Div>
            <Span className="text-destructive font-bold">Error text</Span>
            <Div>
              <Span className="text-success">Success variant</Span>
            </Div>
            <Span className="italic text-muted-foreground">
              Muted italic text
            </Span>
            <Span className="text-muted-foreground">&mdash;</Span>
          </Div>
        </WidgetCard>

        {/* title */}
        <WidgetCard
          name="Title"
          category="display-only"
          description="Renders semantic HTML headings (H1-H6) with optional subtitle and text alignment."
        >
          <Div className="space-y-2">
            <Title level={2}>Section Title</Title>
            <Span className="text-muted-foreground mt-1 block">
              Optional subtitle text goes here
            </Span>
            <Div className="font-medium text-sm mt-3">
              Card-level title (H4+)
            </Div>
          </Div>
        </WidgetCard>
      </Div>
    </Div>
  );
}

// =============================================================================
// FORM FIELDS
// =============================================================================

function FormFieldsSection(): JSX.Element {
  const [boolSwitch, setBoolSwitch] = useState(true);
  const [boolCheck, setBoolCheck] = useState(false);
  const [colorValue, setColorValue] = useState("#3b82f6");
  const [dateValue, setDateValue] = useState<Date | undefined>(new Date());
  const [phoneValue, setPhoneValue] = useState("+1 555 0123");
  const [numberValue, setNumberValue] = useState(42);
  const [sliderValue, setSliderValue] = useState([50]);
  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [tags] = useState<string[]>(["react", "typescript"]);
  const [multiValue, setMultiValue] = useState<string[]>(["en"]);

  return (
    <Div className="space-y-6">
      <H3>Form Fields (32 widgets)</H3>
      <P className="text-sm text-muted-foreground">
        Each form field widget wraps a primitive input with FormField,
        FormLabel, validation state, error messages, description tooltips, and
        required-field styling. Shown below with their visual output.
      </P>
      <Div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* text-field */}
        <WidgetCard
          name="Text Field"
          category="form-fields"
          description="Text input supporting text, email, url, and tel input types."
        >
          <Div className="space-y-2">
            <Div className="flex items-center gap-1.5">
              <Label>Display Name</Label>
              <Span className="text-info font-bold">*</Span>
            </Div>
            <Input defaultValue="Max Mustermann" />
          </Div>
        </WidgetCard>

        {/* email-field */}
        <WidgetCard
          name="Email Field"
          category="form-fields"
          description="Email-specific input with validation."
        >
          <Div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" defaultValue="user@example.com" />
          </Div>
        </WidgetCard>

        {/* password-field */}
        <WidgetCard
          name="Password Field"
          category="form-fields"
          description="Password input with visibility toggle."
        >
          <Div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" defaultValue="supersecret123" />
          </Div>
        </WidgetCard>

        {/* url-field */}
        <WidgetCard
          name="URL Field"
          category="form-fields"
          description="URL input with validation for web addresses."
        >
          <Div className="space-y-2">
            <Label>Website</Label>
            <Input type="url" defaultValue="https://unbottled.ai" />
          </Div>
        </WidgetCard>

        {/* uuid-field */}
        <WidgetCard
          name="UUID Field"
          category="form-fields"
          description="UUID input with monospace formatting."
        >
          <Div className="space-y-2">
            <Label>Record ID</Label>
            <Input
              className="font-mono text-sm"
              defaultValue="7f3a2b1c-9d4e-5f6a-8b7c-1d2e3f4a5b6c"
            />
          </Div>
        </WidgetCard>

        {/* textarea-field */}
        <WidgetCard
          name="Textarea Field"
          category="form-fields"
          description="Multi-line text input for longer content."
        >
          <Div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              defaultValue="Full-stack developer with 10 years of experience building scalable web applications."
              rows={3}
            />
          </Div>
        </WidgetCard>

        {/* markdown-textarea-field */}
        <WidgetCard
          name="Markdown Textarea Field"
          category="form-fields"
          description="Textarea with markdown preview support."
        >
          <Div className="space-y-2">
            <Label>Content (Markdown)</Label>
            <Textarea
              defaultValue="## Hello World\n\nThis is **bold** and *italic* text."
              rows={3}
              className="font-mono text-sm"
            />
          </Div>
        </WidgetCard>

        {/* markdown-editor */}
        <WidgetCard
          name="Markdown Editor"
          category="form-fields"
          description="Full markdown editor with toolbar and live preview."
        >
          <Div className="space-y-2">
            <Label>Article Body</Label>
            <Div className="border rounded-md">
              <Div className="flex gap-1 p-1.5 border-b bg-muted/30">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Span className="text-xs font-bold">B</Span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Span className="text-xs italic">I</Span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Span className="text-xs underline">U</Span>
                </Button>
              </Div>
              <Textarea
                className="border-0 rounded-none font-mono text-sm focus-visible:ring-0"
                defaultValue="# Article Title"
                rows={2}
              />
            </Div>
          </Div>
        </WidgetCard>

        {/* number-field */}
        <WidgetCard
          name="Number Field"
          category="form-fields"
          description="Numeric input with increment/decrement controls."
        >
          <Div className="space-y-2">
            <Label>Quantity</Label>
            <NumberInput value={numberValue} onChange={setNumberValue} />
          </Div>
        </WidgetCard>

        {/* int-field */}
        <WidgetCard
          name="Int Field"
          category="form-fields"
          description="Integer-only numeric input (no decimals)."
        >
          <Div className="space-y-2">
            <Label>Max Retries</Label>
            <Input type="number" defaultValue={3} step={1} />
          </Div>
        </WidgetCard>

        {/* boolean-field */}
        <WidgetCard
          name="Boolean Field"
          category="form-fields"
          description="Toggle input as checkbox or switch variant."
        >
          <Div className="space-y-4">
            <Div className="flex items-center gap-3">
              <Switch checked={boolSwitch} onCheckedChange={setBoolSwitch} />
              <Label>Enable notifications (switch)</Label>
            </Div>
            <Div className="flex items-center gap-3">
              <Checkbox
                checked={boolCheck}
                onCheckedChange={(v) => setBoolCheck(v === true)}
              />
              <Label>Accept terms (checkbox)</Label>
            </Div>
          </Div>
        </WidgetCard>

        {/* select-field */}
        <WidgetCard
          name="Select Field"
          category="form-fields"
          description="Dropdown selection from predefined enum options."
        >
          <Div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue="editor">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </WidgetCard>

        {/* multiselect-field */}
        <WidgetCard
          name="Multiselect Field"
          category="form-fields"
          description="Multiple selection with search and badge display."
        >
          <Div className="space-y-2">
            <Label>Languages</Label>
            <MultiSelect
              options={[
                { value: "en", label: "English" },
                { value: "de", label: "German" },
                { value: "pl", label: "Polish" },
                { value: "fr", label: "French" },
              ]}
              value={multiValue}
              onChange={setMultiValue}
              placeholder="Select languages"
            />
          </Div>
        </WidgetCard>

        {/* filter-pills-field */}
        <WidgetCard
          name="Filter Pills Field"
          category="form-fields"
          description="Pill-style filter buttons for quick multi-select filtering."
        >
          <Div className="space-y-2">
            <Label>Categories</Label>
            <Div className="flex flex-wrap gap-2">
              {["All", "Active", "Archived", "Draft"].map((pill, i) => (
                <Button
                  key={pill}
                  variant={i === 1 ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {pill}
                </Button>
              ))}
            </Div>
          </Div>
        </WidgetCard>

        {/* color-field */}
        <WidgetCard
          name="Color Field"
          category="form-fields"
          description="Color picker input with hex value display."
        >
          <Div className="space-y-2">
            <Label>Brand Color</Label>
            <Div className="flex items-center gap-3">
              <Div className="h-10 w-10 rounded border shrink-0 bg-blue-500" />
              <Input
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="font-mono"
              />
            </Div>
          </Div>
        </WidgetCard>

        {/* date-field */}
        <WidgetCard
          name="Date Field"
          category="form-fields"
          description="Date picker with calendar popup."
        >
          <Div className="space-y-2">
            <Label>Start Date</Label>
            <DatePicker value={dateValue} onChange={setDateValue} />
          </Div>
        </WidgetCard>

        {/* datetime-field */}
        <WidgetCard
          name="Datetime Field"
          category="form-fields"
          description="Combined date and time picker."
        >
          <Div className="space-y-2">
            <Label>Event Start</Label>
            <Div className="flex gap-2">
              <Input type="date" defaultValue="2026-04-11" className="flex-1" />
              <Input type="time" defaultValue="14:30" className="w-28" />
            </Div>
          </Div>
        </WidgetCard>

        {/* date-range-field */}
        <WidgetCard
          name="Date Range Field"
          category="form-fields"
          description="Start and end date range selection."
        >
          <Div className="space-y-2">
            <Label>Report Period</Label>
            <Div className="flex items-center gap-2">
              <Input type="date" defaultValue="2026-04-01" className="flex-1" />
              <Span className="text-muted-foreground">&mdash;</Span>
              <Input type="date" defaultValue="2026-04-11" className="flex-1" />
            </Div>
          </Div>
        </WidgetCard>

        {/* time-field */}
        <WidgetCard
          name="Time Field"
          category="form-fields"
          description="Time-only input."
        >
          <Div className="space-y-2">
            <Label>Reminder Time</Label>
            <Input type="time" defaultValue="09:00" />
          </Div>
        </WidgetCard>

        {/* time-range-field */}
        <WidgetCard
          name="Time Range Field"
          category="form-fields"
          description="Start and end time range selection."
        >
          <Div className="space-y-2">
            <Label>Business Hours</Label>
            <Div className="flex items-center gap-2">
              <Input type="time" defaultValue="09:00" className="flex-1" />
              <Span className="text-muted-foreground">&mdash;</Span>
              <Input type="time" defaultValue="17:00" className="flex-1" />
            </Div>
          </Div>
        </WidgetCard>

        {/* timezone-field */}
        <WidgetCard
          name="Timezone Field"
          category="form-fields"
          description="Timezone selection dropdown."
        >
          <Div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="europe-berlin">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="europe-berlin">
                  Europe/Berlin (CET)
                </SelectItem>
                <SelectItem value="america-new-york">
                  America/New_York (EST)
                </SelectItem>
                <SelectItem value="asia-tokyo">Asia/Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </WidgetCard>

        {/* country-select-field */}
        <WidgetCard
          name="Country Select Field"
          category="form-fields"
          description="Country selection with flags and search."
        >
          <Div className="space-y-2">
            <Label>Country</Label>
            <Select defaultValue="de">
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="pl">Poland</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </WidgetCard>

        {/* language-select-field */}
        <WidgetCard
          name="Language Select Field"
          category="form-fields"
          description="Language selection dropdown."
        >
          <Div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pl">Polski</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </WidgetCard>

        {/* currency-select-field */}
        <WidgetCard
          name="Currency Select Field"
          category="form-fields"
          description="Currency selection dropdown."
        >
          <Div className="space-y-2">
            <Label>Currency</Label>
            <Select defaultValue="eur">
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">EUR - Euro</SelectItem>
                <SelectItem value="usd">USD - US Dollar</SelectItem>
                <SelectItem value="gbp">GBP - British Pound</SelectItem>
                <SelectItem value="pln">PLN - Polish Zloty</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        </WidgetCard>

        {/* phone-field */}
        <WidgetCard
          name="Phone Field"
          category="form-fields"
          description="International phone number input with country code."
        >
          <Div className="space-y-2">
            <Label>Phone Number</Label>
            <PhoneField value={phoneValue} onChange={setPhoneValue} />
          </Div>
        </WidgetCard>

        {/* slider-field */}
        <WidgetCard
          name="Slider Field"
          category="form-fields"
          description="Single value slider with min/max range."
        >
          <Div className="space-y-3">
            <Div className="flex items-center justify-between">
              <Label>Volume</Label>
              <Span className="text-sm text-muted-foreground">
                {sliderValue[0]}%
              </Span>
            </Div>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            >
              <SliderTrack>
                <SliderRange />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Div>
        </WidgetCard>

        {/* range-slider-field */}
        <WidgetCard
          name="Range Slider Field"
          category="form-fields"
          description="Dual-thumb range slider for min/max selection."
        >
          <Div className="space-y-3">
            <Div className="flex items-center justify-between">
              <Label>Price Range</Label>
              <Span className="text-sm text-muted-foreground">
                ${rangeValue[0]} - ${rangeValue[1]}
              </Span>
            </Div>
            <Slider
              value={rangeValue}
              onValueChange={setRangeValue}
              max={100}
              step={1}
            >
              <SliderTrack>
                <SliderRange />
              </SliderTrack>
              <SliderThumb />
              <SliderThumb />
            </Slider>
          </Div>
        </WidgetCard>

        {/* tags-field */}
        <WidgetCard
          name="Tags Field"
          category="form-fields"
          description="Array of tags input with suggestions and badge display."
        >
          <Div className="space-y-2">
            <Label>Tags</Label>
            <Div className="flex flex-wrap gap-1.5 p-2 border rounded-md min-h-10">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <Span className="cursor-pointer text-muted-foreground hover:text-foreground">
                    x
                  </Span>
                </Badge>
              ))}
              <Input
                className="flex-1 min-w-[80px] border-0 h-6 p-0 focus-visible:ring-0"
                placeholder="Add tag..."
              />
            </Div>
          </Div>
        </WidgetCard>

        {/* text-array-field */}
        <WidgetCard
          name="Text Array Field"
          category="form-fields"
          description="Array of text inputs with add/remove controls."
        >
          <Div className="space-y-2">
            <Label>Aliases</Label>
            <Div className="space-y-2">
              {["Primary alias", "Secondary alias"].map((val, i) => (
                <Div key={i} className="flex gap-2">
                  <Input defaultValue={val} className="flex-1" />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Minus className="h-4 w-4" />
                  </Button>
                </Div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                + Add Item
              </Button>
            </Div>
          </Div>
        </WidgetCard>

        {/* json-field */}
        <WidgetCard
          name="JSON Field"
          category="form-fields"
          description="JSON editor with syntax validation."
        >
          <Div className="space-y-2">
            <Label>Configuration</Label>
            <Textarea
              className="font-mono text-sm"
              defaultValue={`{\n  "key": "value",\n  "count": 42\n}`}
              rows={4}
            />
          </Div>
        </WidgetCard>

        {/* file-field */}
        <WidgetCard
          name="File Field"
          category="form-fields"
          description="File upload input with drag-and-drop support."
        >
          <Div className="space-y-2">
            <Label>Attachment</Label>
            <Div className="border-2 border-dashed rounded-md p-6 text-center">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <P className="text-sm text-muted-foreground">
                Drag and drop or click to upload
              </P>
              <Muted>Max 10MB, PDF/PNG/JPG</Muted>
            </Div>
          </Div>
        </WidgetCard>

        {/* icon-field */}
        <WidgetCard
          name="Icon Field"
          category="form-fields"
          description="Icon picker from the icon library with search."
        >
          <Div className="space-y-2">
            <Label>Icon</Label>
            <Div className="flex items-center gap-2">
              <Div className="flex items-center justify-center h-10 w-10 rounded-md border bg-muted/30">
                <Search className="h-5 w-5" />
              </Div>
              <Input defaultValue="search" className="flex-1" />
            </Div>
          </Div>
        </WidgetCard>
      </Div>
    </Div>
  );
}

// =============================================================================
// INTERACTIVE
// =============================================================================

function InteractiveSection(): JSX.Element {
  return (
    <Div className="space-y-6">
      <H3>Interactive (4 widgets)</H3>
      <Div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* button */}
        <WidgetCard
          name="Button"
          category="interactive"
          description="Action button with icon, variant, and size options. Used for Edit, Delete, etc."
        >
          <Div className="flex flex-wrap gap-2">
            <Button variant="default" size="default">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </Div>
        </WidgetCard>

        {/* submit-button */}
        <WidgetCard
          name="Submit Button"
          category="interactive"
          description="Form submit button with loading state, icon, and custom text."
        >
          <Div className="space-y-3">
            <Button className="w-full">Submit</Button>
            <Button className="w-full" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </Button>
          </Div>
        </WidgetCard>

        {/* navigate-button */}
        <WidgetCard
          name="Navigate Button"
          category="interactive"
          description="Cross-definition navigation button. Pushes to navigation stack or opens in modal."
        >
          <Div className="space-y-3">
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button variant="default" size="sm">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              Open Settings
            </Button>
          </Div>
        </WidgetCard>

        {/* form-alert */}
        <WidgetCard
          name="Form Alert"
          category="interactive"
          description="Displays form validation and API errors from response context."
        >
          <Div className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>
                Email address is already in use. Please try another.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>Settings saved successfully.</AlertDescription>
            </Alert>
          </Div>
        </WidgetCard>
      </Div>
    </Div>
  );
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

export function UnifiedWidgetsPreview(): JSX.Element {
  return (
    <Div className="space-y-10">
      <Section>
        <H2 className="mb-2">Unified UI Widgets</H2>
        <P className="text-muted-foreground mb-1">
          All 59 widget components from the unified interface system. These are
          the building blocks that render endpoint forms and results across
          every surface: Web, Native, CLI, and MCP.
        </P>
        <Muted className="font-mono text-xs block mb-6">{WIDGET_BASE}/</Muted>

        <Div className="space-y-10">
          <ContainersSection />
          <Separator />
          <DisplayOnlySection />
          <Separator />
          <FormFieldsSection />
          <Separator />
          <InteractiveSection />
        </Div>
      </Section>
    </Div>
  );
}
