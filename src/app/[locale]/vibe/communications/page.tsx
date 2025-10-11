"use client";

import {
  BarChart,
  Eye,
  Link,
  Mail,
  MessageSquare,
  MousePointer,
  Send,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  emailTemplate: `// Beautiful email templates with React components
// src/app/api/[locale]/v1/users/welcome-email.tsx
import { EmailTemplate, EmailHeader, EmailFooter, TrackedLink, TrackedCTAButton } from "next-vibe/email";

interface WelcomeEmailProps {
  userName: string;
  verificationLink: string;
  leadId: string;
  campaignId: string;
}

export function WelcomeEmail({ userName, verificationLink, leadId, campaignId }: WelcomeEmailProps) {
  return (
    <EmailTemplate
      leadId={leadId}
      campaignId={campaignId}
      subject="Welcome to Vibe! 🚀"
    >
      <EmailHeader />
      
      <mj-section background-color="#ffffff" padding="40px 20px">
        <mj-column>
          <mj-text font-size="24px" font-weight="bold" color="#1a1a1a">
            Welcome aboard, {userName}! 👋
          </mj-text>
          
          <mj-text font-size="16px" line-height="24px" color="#666666">
            We're thrilled to have you join the Vibe community. 
            Your journey to better productivity starts here.
          </mj-text>
          
          <mj-spacer height="20px" />
          
          <TrackedCTAButton
            href={verificationLink}
            trackingId="verify-email"
            backgroundColor="#7c3aed"
            color="#ffffff"
          >
            Verify Your Email
          </TrackedCTAButton>
          
          <mj-spacer height="30px" />
          
          <mj-text font-size="14px" color="#666666">
            Here's what you can do next:
          </mj-text>
          
          <mj-text font-size="14px" color="#666666" padding-left="20px">
            • Complete your profile<br/>
            • Explore our features<br/>
            • Join our community
          </mj-text>
          
          <mj-spacer height="20px" />
          
          <mj-text font-size="14px" color="#999999">
            Need help? Check out our 
            <TrackedLink href="/help" trackingId="help-link">
              help center
            </TrackedLink> or reply to this email.
          </mj-text>
        </mj-column>
      </mj-section>
      
      <EmailFooter />
    </EmailTemplate>
  );
}`,

  tracking: `// Advanced email tracking system
// Automatic tracking for opens, clicks, and conversions

// Send email with full tracking
const { sendEmail } = await import("next-vibe/email");

await sendEmail({
  to: user.email,
  template: WelcomeEmail,
  props: {
    userName: user.name,
    verificationLink: generateVerifyLink(user),
    leadId: user.leadId,
    campaignId: "welcome-campaign-2024",
  },
  tracking: {
    opens: true,      // Track email opens with pixel
    clicks: true,     // Track all link clicks
    conversions: true // Track goal completions
  },
});

// Tracking components automatically generate tracked URLs
<TrackedLink 
  href="/features" 
  trackingId="features-link"
  leadId={leadId}
  campaignId={campaignId}
>
  Explore Features
</TrackedLink>
// Generates: /features?utm_source=email&utm_campaign=welcome&lead=xxx&track=yyy

// View tracking statistics
$ vibe email:stats welcome-campaign-2024
📊 Email Campaign Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Campaign: Welcome Campaign 2024
Period: Last 30 days

Delivery:
  Sent: 12,847
  Delivered: 12,523 (97.5%)
  Bounced: 324 (2.5%)

Engagement:
  Opened: 8,421 (67.2%)
  Clicked: 3,156 (25.2%)
  Unsubscribed: 42 (0.3%)

Top Links:
  1. Verify Email Button - 2,847 clicks
  2. Help Center - 189 clicks
  3. Features Link - 120 clicks`,

  batchSending: `// High-performance batch email sending
// Handles thousands of emails with parallel processing

import { EmailBatchProcessor } from "next-vibe/email/batch";

// Configure batch processor
const processor = new EmailBatchProcessor({
  // Multiple SMTP accounts for load balancing
  smtpAccounts: [
    { id: "smtp1", capacity: 100, perHour: 1000 },
    { id: "smtp2", capacity: 100, perHour: 1000 },
    { id: "smtp3", capacity: 50, perHour: 500 },
  ],
  
  // Parallel processing settings
  concurrency: 10,
  batchSize: 100,
  retryAttempts: 3,
  
  // Rate limiting
  rateLimit: {
    perSecond: 50,
    perMinute: 2000,
    perHour: 10000,
  },
});

// Send newsletter to thousands
const campaign = await processor.sendBatch({
  template: NewsletterEmail,
  recipients: await getNewsletterSubscribers(), // 50,000 users
  
  // Dynamic props for each recipient
  propsGenerator: (recipient) => ({
    userName: recipient.name,
    interests: recipient.interests,
    unsubscribeToken: generateUnsubscribeToken(recipient),
  }),
  
  // Progress tracking
  onProgress: (stats) => {
    console.log(\`Sent: \${stats.sent}/\${stats.total}\`);
    console.log(\`Failed: \${stats.failed}\`);
    console.log(\`Rate: \${stats.perSecond}/s\`);
  },
});

// Results
console.log(\`
Campaign completed:
  Total: \${campaign.total}
  Sent: \${campaign.sent}
  Failed: \${campaign.failed}
  Duration: \${campaign.duration}ms
  Average rate: \${campaign.averageRate}/s
\`);`,

  sms: `// SMS integration with templates and tracking
// src/app/api/[locale]/v1/notifications/sms.ts

import { createSMSTemplate, sendSMS } from "next-vibe/sms";

// Define SMS template with variables
const verificationSMS = createSMSTemplate({
  id: "verification-code",
  template: "Your Vibe verification code is {{code}}. Valid for {{minutes}} minutes.",
  
  // Validation schema
  variables: z.object({
    code: z.string().length(6),
    minutes: z.number().default(10),
  }),
});

// Send SMS with automatic formatting
await sendSMS({
  to: user.phone,
  template: verificationSMS,
  variables: {
    code: generateOTP(),
    minutes: 10,
  },
  
  // Optional settings
  options: {
    priority: "high",
    expires: 600, // 10 minutes
    trackDelivery: true,
  },
});

// Bulk SMS with rate limiting
const campaign = await sendBulkSMS({
  template: marketingSMS,
  recipients: phoneNumbers,
  
  // Respect time zones and quiet hours
  scheduling: {
    respectTimezone: true,
    quietHours: { start: 21, end: 9 }, // 9 PM to 9 AM
    preferredTime: 14, // 2 PM local time
  },
  
  rateLimit: {
    perSecond: 10,
    perNumber: { count: 1, period: "day" },
  },
});`,

  emailBuilder: `// Visual email builder integration
$ vibe email:create welcome-series
🎨 Opening Email Builder...

Features:
  ✅ Drag-and-drop components
  ✅ Responsive preview
  ✅ Dark mode testing
  ✅ Spam score check
  ✅ A/B test variants

// Export as React component
$ vibe email:export welcome-series --format react
✅ Exported to: src/emails/welcome-series.tsx

// Test email rendering
$ vibe email:test welcome-series --to test@example.com
📧 Sending test email...
✅ Test email sent successfully

// Preview in browser
$ vibe email:preview welcome-series
🌐 Opening preview...
  Local: http://localhost:3000/email-preview/welcome-series
  
  Features:
    • Desktop/Mobile toggle
    • Dark mode toggle
    • Variable substitution
    • Client testing (Gmail, Outlook, etc.)`,

  automation: `// Email automation and workflows
import { createEmailWorkflow } from "next-vibe/email/automation";

// Define automated email sequence
const onboardingWorkflow = createEmailWorkflow({
  id: "user-onboarding",
  trigger: "user.created",
  
  steps: [
    {
      delay: 0, // Immediate
      email: WelcomeEmail,
      condition: async (user) => !user.emailVerified,
    },
    {
      delay: "3 days",
      email: OnboardingTipsEmail,
      condition: async (user) => user.onboardingProgress < 50,
    },
    {
      delay: "7 days",
      email: FeatureHighlightEmail,
      skipIf: async (user) => user.subscriptionLevel === "pro",
    },
    {
      delay: "14 days",
      email: SurveyEmail,
      once: true, // Only send once per user
    },
  ],
  
  // Global settings
  settings: {
    stopOnUnsubscribe: true,
    respectQuietHours: true,
    maxEmailsPerDay: 2,
  },
});

// Monitor workflow performance
$ vibe workflow:stats user-onboarding
📊 Workflow Statistics: User Onboarding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Recipients: 3,247
Completed: 8,921

Step Performance:
┌─────────────────────┬──────┬────────┬──────────┐
│ Email               │ Sent │ Opened │ Clicked  │
├─────────────────────┼──────┼────────┼──────────┤
│ Welcome Email       │ 12K  │ 78.2%  │ 34.5%    │
│ Onboarding Tips     │ 8.5K │ 65.3%  │ 28.1%    │
│ Feature Highlight   │ 6.2K │ 61.8%  │ 22.4%    │
│ Survey Email        │ 4.1K │ 42.1%  │ 15.2%    │
└─────────────────────┴──────┴────────┴──────────┘`,
};

export default function CommunicationsPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("emailTemplate");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Mail className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Communications
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Beautiful email templates, SMS integration, tracking, automation, and
          analytics. Everything you need for modern customer communication.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Complete Communication Platform
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                React Emails
              </h3>
              <p className="text-gray-400 text-sm">
                Component-based email templates with MJML
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Full Tracking
              </h3>
              <p className="text-gray-400 text-sm">
                Opens, clicks, conversions, and engagement metrics
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                SMS Support
              </h3>
              <p className="text-gray-400 text-sm">
                Text messaging with templates and delivery tracking
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Automation
              </h3>
              <p className="text-gray-400 text-sm">
                Workflows, sequences, and triggered campaigns
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
                onClick={() => setActiveExample("emailTemplate")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "emailTemplate"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Email Templates
              </button>
              <button
                onClick={() => setActiveExample("tracking")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "tracking"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Tracking
              </button>
              <button
                onClick={() => setActiveExample("batchSending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "batchSending"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Batch Sending
              </button>
              <button
                onClick={() => setActiveExample("sms")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "sms"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                SMS
              </button>
              <button
                onClick={() => setActiveExample("emailBuilder")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "emailBuilder"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Email Builder
              </button>
              <button
                onClick={() => setActiveExample("automation")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "automation"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Automation
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
        <h2 className="text-2xl font-bold text-white mb-6">
          Email Preview Examples
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Desktop Preview
              </h3>
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-sm text-gray-600">
                      Welcome to Vibe! 🚀
                    </span>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <div className="max-w-md mx-auto">
                    <div className="bg-purple-600 rounded-t-lg p-4 text-center">
                      <div className="text-white text-2xl font-bold">VIBE</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-b-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Welcome aboard, John! 👋
                      </h2>
                      <p className="text-gray-600 mb-4">
                        We're thrilled to have you join the Vibe community. Your
                        journey to better productivity starts here.
                      </p>
                      <div className="text-center mb-4">
                        <a className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                          Verify Your Email
                        </a>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p className="mb-2">Here's what you can do next:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Complete your profile</li>
                          <li>Explore our features</li>
                          <li>Join our community</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Mobile Preview
              </h3>
              <div
                className="bg-gray-900 rounded-3xl p-4 mx-auto"
                style={{ maxWidth: "320px" }}
              >
                <div className="bg-black rounded-2xl overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 text-center">
                    <div className="text-xs text-gray-400">9:41 AM</div>
                  </div>
                  <div className="bg-white">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="text-xs text-gray-500">
                        From: Vibe Team
                      </div>
                      <div className="font-semibold text-sm text-gray-900">
                        Welcome to Vibe! 🚀
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="bg-purple-600 rounded-lg p-3 text-center mb-4">
                        <div className="text-white text-xl font-bold">VIBE</div>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2">
                        Welcome aboard, John! 👋
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        We're thrilled to have you join the Vibe community.
                      </p>
                      <a className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-center text-sm">
                        Verify Your Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-black/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Email Client Compatibility
              </span>
              <span className="text-sm text-green-400">
                ✓ All major clients tested
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2 text-center">
              <div className="text-xs text-gray-500">
                <div className="text-green-400 mb-1">✓</div>
                <div>Gmail</div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-green-400 mb-1">✓</div>
                <div>Outlook</div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-green-400 mb-1">✓</div>
                <div>Apple Mail</div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-green-400 mb-1">✓</div>
                <div>Yahoo</div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-green-400 mb-1">✓</div>
                <div>iOS Mail</div>
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-green-400 mb-1">✓</div>
                <div>Android</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Dark Mode Support
            </h3>
            <p className="text-gray-300 mb-3">
              All email templates automatically adapt to dark mode preferences
              with proper color adjustments and contrast ratios.
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Light Mode</span>
                <span className="text-sm text-gray-400">Dark Mode</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-500 to-gray-800 rounded-full" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Responsive Design
            </h3>
            <p className="text-gray-300 mb-3">
              Emails automatically adjust layout, font sizes, and spacing for
              optimal reading on any device or screen size.
            </p>
            <div className="bg-black/30 rounded-lg p-4 flex justify-around items-center">
              <div className="text-center">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs text-gray-400">Mobile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs text-gray-400">Tablet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💻</div>
                <div className="text-xs text-gray-400">Desktop</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Email Tracking Insights
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Open Tracking
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Invisible pixel tracking to know when emails are opened. Respects
              privacy settings and provides aggregate statistics.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-400">
              <div>• Device type detection</div>
              <div>• Email client identification</div>
              <div>• Time-to-open metrics</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <MousePointer className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Click Tracking
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              Every link is automatically tracked with proper UTM parameters and
              lead attribution for complete journey mapping.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-400">
              <div>• Click heatmaps</div>
              <div>• Link performance</div>
              <div>• Conversion tracking</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Link className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Smart URLs</h3>
            </div>
            <p className="text-gray-300 mb-3">
              Automatic URL shortening, personalization, and tracking parameters
              for better deliverability and insights.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-400">
              <div>• Dynamic redirects</div>
              <div>• A/B test routing</div>
              <div>• Personalized CTAs</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Enterprise-Scale Performance
          </h2>
          <p className="text-gray-300 mb-6">
            Our email infrastructure handles millions of messages daily with
            industry-leading delivery rates and performance.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Delivery Excellence
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ 99.5% delivery rate</li>
                <li>✓ SPF, DKIM, DMARC configured</li>
                <li>✓ IP warming and reputation management</li>
                <li>✓ Automatic bounce handling</li>
                <li>✓ Spam score optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Scale & Reliability
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ 10,000+ emails per second</li>
                <li>✓ Multi-region SMTP pools</li>
                <li>✓ Automatic failover</li>
                <li>✓ Queue persistence</li>
                <li>✓ Real-time monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Template Library
            </h3>
            <p className="text-gray-300 mb-3">
              Pre-built, tested email templates for common use cases:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Welcome series</li>
              <li>• Password reset</li>
              <li>• Order confirmations</li>
              <li>• Newsletters</li>
              <li>• Promotional campaigns</li>
              <li>• Transactional emails</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Compliance Built-in
            </h3>
            <p className="text-gray-300 mb-3">
              Stay compliant with email regulations automatically:
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• GDPR compliance</li>
              <li>• CAN-SPAM adherence</li>
              <li>• Unsubscribe handling</li>
              <li>• Data retention policies</li>
              <li>• Consent management</li>
              <li>• Audit trails</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Communication That Converts
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From beautiful templates to powerful automation, Vibe gives you
          everything needed to build lasting customer relationships through
          effective communication.
        </p>
        <div className="inline-flex gap-4">
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">$ vibe email:create welcome</div>
            <div className="text-gray-500 mt-1"># Design beautiful emails</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">$ vibe email:send campaign</div>
            <div className="text-gray-500 mt-1"># Reach your audience</div>
          </div>
        </div>
      </section>
    </main>
  );
}
