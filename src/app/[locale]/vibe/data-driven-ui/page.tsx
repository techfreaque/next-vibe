"use client";

import {
  BarChart,
  Code2,
  Layers,
  Layout,
  Monitor,
  Palette,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal as TerminalIcon,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  definition: `// Single definition drives all UI rendering
const userEndpoint = createEndpoint({
  fields: objectField({
    // Form field with validation
    email: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "user.email.label",
      placeholder: "user.email.placeholder",
      description: "user.email.description",
      required: true,
      layout: { columns: 6 },
    }, z.email()),
    
    // Select with options
    role: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.SELECT,
      options: [
        { value: "admin", label: "Administrator" },
        { value: "user", label: "Regular User" },
        { value: "guest", label: "Guest" }
      ],
      defaultValue: "user",
      layout: { columns: 6 },
    }, z.enum(["admin", "user", "guest"])),
    
    // Response displays
    stats: responseField({
      type: WidgetType.METRIC,
      label: "user.stats.label",
      format: "number",
      trend: "up",
    }, z.object({
      total: z.number(),
      active: z.number(),
      growth: z.number(),
    })),
  }),
});`,

  hooks: `// One hook, infinite possibilities
// Web (React)
import { useUniversalEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

function UserDashboard() {
  // Just pass the definition - UI is auto-generated
  const { form, data, loading } = useUniversalEndpoint(userEndpoint);
  
  return <div>{form}</div>;
}

// React Native - Same hooks, native components
import { useUniversalEndpoint } from "vibe-native/client";
import { View } from "react-native";

function UserDashboardNative() {
  // Exact same hook usage!
  const { form, data, loading } = useUniversalEndpoint(userEndpoint);
  
  return <View>{form}</View>; // Native components rendered
}

// Shared business logic, platform-specific UI
function useUserData() {
  // This hook works on ALL platforms
  return useEndpoint(userEndpoint);
}`,

  widgets: `// Rich widget system for any UI need
const widgets = {
  // Display widgets
  [WidgetType.TEXT]: TextWidget,
  [WidgetType.METRIC]: MetricWidget,
  [WidgetType.TABLE]: TableWidget,
  [WidgetType.CODE]: CodeWidget,
  [WidgetType.GROUPED_LIST]: GroupedListWidget,
  
  // Form widgets
  [WidgetType.FORM_FIELD]: FormFieldWidget,
  [WidgetType.FORM_ARRAY]: FormArrayWidget,
  [WidgetType.FORM_OBJECT]: FormObjectWidget,
  
  // Layout widgets
  [WidgetType.GRID]: GridWidget,
  [WidgetType.TABS]: TabsWidget,
  [WidgetType.ACCORDION]: AccordionWidget,
};

// Custom widget example
const MetricWidget = ({ value, label, trend, format }) => (
  <div className="metric-card">
    <h3>{label}</h3>
    <div className="value">
      {format === "currency" && "$"}
      {value.toLocaleString()}
    </div>
    {trend && <TrendIndicator direction={trend} />}
  </div>
);`,

  layouts: `// Responsive layout system
const dashboardEndpoint = createEndpoint({
  fields: objectField({
    // Grid layout with responsive columns
    metrics: responseField({
      type: WidgetType.GRID,
      layout: { 
        columns: { mobile: 1, tablet: 2, desktop: 4 },
        gap: 4,
      },
      children: [
        totalUsersMetric,
        activeUsersMetric,
        revenueMetric,
        growthMetric,
      ],
    }),
    
    // Tabbed interface
    details: responseField({
      type: WidgetType.TABS,
      tabs: [
        { id: "overview", label: "Overview", content: overviewFields },
        { id: "analytics", label: "Analytics", content: analyticsFields },
        { id: "settings", label: "Settings", content: settingsFields },
      ],
    }),
    
    // Nested layouts
    userTable: responseField({
      type: WidgetType.TABLE,
      layout: { columns: 12 },
      sortable: true,
      filterable: true,
      pagination: { pageSize: 20 },
    }),
  }),
});`,

  cli: `// Same definition renders in CLI
$ vibe user:create

┌─ Create New User ─────────────────────┐
│                                       │
│ Email: * [___________________]        │
│         user@example.com              │
│                                       │
│ Role:   [▼ Regular User      ]        │
│         • Administrator               │
│         • Regular User ✓              │
│         • Guest                       │
│                                       │
│ Department: [___________________]     │
│                                       │
│ [Cancel]            [Create User]     │
└───────────────────────────────────────┘

// Rich CLI output rendering
$ vibe stats:overview

📊 System Overview
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Users │ Active      │ Revenue     │ Growth      │
│ 12,847      │ 8,923       │ $458,291    │ ↑ 23.4%     │
└─────────────┴─────────────┴─────────────┴─────────────┘`,

  realtime: `// Real-time updates with WebSocket support
const liveEndpoint = createEndpoint({
  streaming: true,
  
  fields: objectField({
    chart: responseField({
      type: WidgetType.CHART,
      chartType: "line",
      realtime: true,
      updateInterval: 1000,
    }, z.array(z.object({
      timestamp: z.number(),
      value: z.number(),
    }))),
    
    logs: responseField({
      type: WidgetType.LOG_VIEWER,
      maxLines: 100,
      follow: true,
      highlight: ["error", "warning"],
    }, z.array(z.string())),
  }),
});

// Hook automatically handles WebSocket connection
const { data, isConnected } = useStreamingEndpoint(liveEndpoint);`,

  native: `// React Native with platform-specific components
// Shared endpoint definition
const userFormEndpoint = createEndpoint({
  fields: objectField({
    email: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "Email",
      placeholder: "user@example.com",
    }, z.email()),
    
    avatar: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.IMAGE,
      label: "Profile Picture",
    }, z.string().optional()),
  }),
});

// Web implementation
function UserFormWeb() {
  const { form } = useUniversalEndpoint(userFormEndpoint);
  return <div className="form-container">{form}</div>;
}

// React Native implementation
import { ScrollView, KeyboardAvoidingView } from 'react-native';

function UserFormNative() {
  const { form } = useUniversalEndpoint(userFormEndpoint);
  
  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        {form} {/* Renders native TextInput, Image picker, etc */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Shared business logic hook
function useUserForm() {
  const { mutate, error, loading } = useEndpointCreate(userFormEndpoint);
  
  const handleSubmit = async (data) => {
    // Same logic for web and native!
    await mutate(data);
  };
  
  return { handleSubmit, error, loading };
}`,
};

export default function DataDrivenUIPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("definition");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Code2 className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Data-Driven UI
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Define your UI once, render everywhere. From CLI forms to React
          components, all generated from a single schema definition.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Write Once, UI Everywhere
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Web UI</h3>
              <p className="text-gray-400 text-sm">
                React components with forms, tables, charts, and more
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                React Native
              </h3>
              <p className="text-gray-400 text-sm">
                Same hooks, native components for iOS and Android
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TerminalIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                CLI Interface
              </h3>
              <p className="text-gray-400 text-sm">
                Interactive terminal UI with rich formatting
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Tablet className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Responsive
              </h3>
              <p className="text-gray-400 text-sm">
                Adapts to any screen size automatically
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Live Examples</h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveExample("definition")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "definition"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Schema Definition
              </button>
              <button
                onClick={() => setActiveExample("hooks")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "hooks"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                React Hooks
              </button>
              <button
                onClick={() => setActiveExample("widgets")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "widgets"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Widget System
              </button>
              <button
                onClick={() => setActiveExample("layouts")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "layouts"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Layouts
              </button>
              <button
                onClick={() => setActiveExample("cli")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "cli"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                CLI Rendering
              </button>
              <button
                onClick={() => setActiveExample("realtime")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "realtime"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Real-time
              </button>
              <button
                onClick={() => setActiveExample("native")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "native"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                React Native
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-300">
                {codeExamples[activeExample]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Widget Gallery</h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Live Widget Examples
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Metric Widget
              </h4>
              <div className="bg-black/30 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      $142,394
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-green-400 text-sm">↑ 12.5%</span>
                      <span className="text-gray-500 text-sm">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <BarChart className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Progress Widget
              </h4>
              <div className="bg-black/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Campaign Progress</span>
                  <span className="text-gray-400">68%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>1,247 sent</span>
                  <span>553 remaining</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Status Widget
              </h4>
              <div className="bg-black/30 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">API Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm">
                        Operational
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Queue</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-yellow-400 text-sm">
                        42 pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                List Widget
              </h4>
              <div className="bg-black/30 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs text-purple-400">JD</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">John Doe</p>
                        <p className="text-gray-500 text-xs">
                          john@example.com
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">2m ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs text-blue-400">AS</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">Alice Smith</p>
                        <p className="text-gray-500 text-xs">
                          alice@example.com
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">5m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Layout className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Form Widgets</h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Text, Email, Password inputs</li>
              <li>• Select, Multi-select, Radio</li>
              <li>• Date, Time, DateTime pickers</li>
              <li>• File upload with drag & drop</li>
              <li>• Rich text editor</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Display Widgets
              </h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Tables with sorting & filtering</li>
              <li>• Charts (line, bar, pie, etc.)</li>
              <li>• Metrics with trends</li>
              <li>• Code blocks with syntax highlighting</li>
              <li>• Progress indicators</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Layout Widgets
              </h3>
            </div>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Responsive grid system</li>
              <li>• Tabs & accordions</li>
              <li>• Modal dialogs</li>
              <li>• Sidebars & drawers</li>
              <li>• Split panes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          One Definition, Multiple Renderings
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <p className="text-gray-300 mb-6">
            See how the same endpoint definition renders across different
            platforms automatically:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-400" />
                Web Browser
              </h3>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="bg-gray-800 rounded p-3 mb-3">
                  <label className="text-sm text-gray-400 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                    placeholder="user@example.com"
                  />
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors">
                  Create User
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <TerminalIcon className="h-5 w-5 text-green-400" />
                CLI Terminal
              </h3>
              <div className="bg-black rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400">? Enter email:</div>
                <div className="text-white">user@example.com</div>
                <div className="text-green-400 mt-2">? Select role:</div>
                <div className="text-white">❯ User</div>
                <div className="text-gray-500"> Admin</div>
                <div className="text-gray-500"> Guest</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-400" />
                React Native
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="bg-gray-800 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-400 mb-1">EMAIL</p>
                  <div className="border-b border-gray-600 pb-1">
                    <p className="text-white">user@example.com</p>
                  </div>
                </div>
                <div className="bg-blue-600 rounded-lg py-3 text-center text-white">
                  Create User
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-black/30 rounded-lg">
            <p className="text-center text-gray-400 text-sm">
              All three interfaces are generated from the same endpoint
              definition - no additional code required!
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">The Magic Hook</h2>
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">
              useUniversalEndpoint
            </h3>
          </div>
          <p className="text-gray-300 mb-6">
            The ultimate data-driven UI hook. Pass it an endpoint definition and
            get back a complete UI with forms, validation, error handling,
            loading states, and more.
          </p>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-purple-400">{"const Dashboard = () => {"}</div>
            <div className="text-blue-400 ml-4">
              const {`{`} ui {`}`} = useUniversalEndpoint(dashboardEndpoint);
            </div>
            <div className="text-purple-400 ml-4">return ui; // That's it!</div>
            <div className="text-purple-400">{`}`};</div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            True Cross-Platform Development
          </h2>
          <p className="text-gray-300 mb-6">
            Share 100% of your business logic across Web, iOS, Android, and CLI.
            Only the rendering layer changes - your hooks, validation, and data
            fetching remain identical.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Shared Code
              </h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>✓ All hooks work on all platforms</li>
                <li>✓ Same endpoint definitions</li>
                <li>✓ Unified state management</li>
                <li>✓ Consistent error handling</li>
                <li>✓ Single source of truth</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Platform-Specific
              </h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Native UI components</li>
                <li>• Platform gestures</li>
                <li>• Device capabilities</li>
                <li>• Optimized performance</li>
                <li>• Native look and feel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Zero Configuration
          </h3>
          <p className="text-gray-300">
            No need to wire up forms, validation, or state management.
            Everything is derived from your endpoint definition automatically.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Fully Customizable
          </h3>
          <p className="text-gray-300">
            Override any widget, add custom renderers, or build your own widget
            types. The system is designed for extension.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Accessibility Built-in
          </h3>
          <p className="text-gray-300">
            All widgets follow WCAG guidelines with proper ARIA labels, keyboard
            navigation, and screen reader support.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Theme Support
          </h3>
          <p className="text-gray-300">
            Full theme customization with CSS variables, dark mode support, and
            the ability to create custom theme variants.
          </p>
        </div>
      </section>
    </main>
  );
}
