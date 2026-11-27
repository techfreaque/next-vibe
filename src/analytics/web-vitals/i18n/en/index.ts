export const translations = {
  category: "Analytics",
  tags: {
    performance: "Performance",
    seo: "SEO",
  },

  enums: {
    metric: {
      lcp: "Largest Contentful Paint",
      inp: "Interaction to Next Paint",
      cls: "Cumulative Layout Shift",
      ttfb: "Time to First Byte",
      fcp: "First Contentful Paint",
    },
    rating: {
      good: "Good",
      needsImprovement: "Needs improvement",
      poor: "Poor",
    },
    device: {
      mobile: "Mobile",
      desktop: "Desktop",
    },
    pageType: {
      storyHome: "Home",
      storyPage: "Story page",
      blogIndex: "Blog index",
      blogPost: "Blog post",
      storyCompare: "Compare page",
      models: "Model list",
      modelDetail: "Model page",
      modelCompare: "Model versus",
      modelChangelog: "Model changelog",
      skill: "Skill page",
      skills: "Skill list",
      docs: "Docs",
      help: "Help",
      pricing: "Pricing",
      create: "Media creation",
      threads: "Chat",
      account: "Account",
      tools: "Tools",
      other: "Other",
    },
  },

  fields: {
    metric: "Metric",
    value: "Value",
    rating: "Rating",
    navigationType: "Navigation type",
    path: "Page path",
    device: "Device",
    metrics: "Measurements",
    days: "Days",
    pageType: "Page type",
    samples: "Samples",
    p75: "p75",
    goodShare: "Good",
    poorShare: "Poor",
  },

  post: {
    title: "Report Web Vitals",
    titleShort: "Report vitals",
    description:
      "Store real-user Core Web Vitals (LCP, INP, CLS, TTFB, FCP) for one page view.",
    recorded: "Stored",
    success: {
      title: "Vitals stored",
      description: "The measurements were stored.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Real-user Core Web Vitals per page type: p75 and the share of good and poor visits.",
    empty: "No measurements in this period yet.",
    since: "Since",
    total: "Measurements",
    targets:
      "Targets at p75: LCP under 2.5 s, INP under 200 ms, CLS under 0.1.",
    success: {
      title: "Web Vitals loaded",
      description: "Real-user measurements per page type.",
    },
  },

  errors: {
    validation: {
      title: "Invalid measurements",
      description: "Check the submitted values.",
    },
    network: {
      title: "Network error",
      description: "The request did not reach the server.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to view this report.",
    },
    forbidden: {
      title: "No access",
      description: "Admins only.",
    },
    notFound: {
      title: "Not found",
      description: "Nothing found.",
    },
    server: {
      title: "Server error",
      description: "The measurements could not be processed.",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected happened.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first.",
    },
    conflict: {
      title: "Conflict",
      description: "The data changed in the meantime.",
    },
  },
};
