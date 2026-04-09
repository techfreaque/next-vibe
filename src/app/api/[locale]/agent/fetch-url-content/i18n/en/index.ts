export const translations = {
  category: "Information",
  get: {
    title: "Fetch URL Content",
    description:
      "Fetch and extract content from any URL, converting it to readable markdown format. Use this when you need to read or analyze web page content.",
    form: {
      title: "URL Fetch Parameters",
      description: "Configure the URL to fetch content from",
    },
    fields: {
      url: {
        title: "URL",
        description:
          "The complete URL to fetch (must include http:// or https://)",
        placeholder: "https://example.com",
      },
      query: {
        title: "Search Query (optional)",
        description:
          "Regex filter applied after fetching. Only paragraphs matching the pattern are returned, ranked by match count, up to the character limit. Omit to get the full page (middle-truncated if large). Syntax: any JS regex - 'authentication', '(login|signup)', 'class\\s+\\w+'. Invalid regex falls back to literal match.",
        placeholder: "authentication",
      },
    },
    response: {
      message: {
        title: "Message",
        description: "Status message about the fetch operation",
      },
      content: {
        title: "Content",
        description: "The extracted content in markdown format",
      },
      truncated: {
        title: "Truncated",
        description: "Whether the content was truncated due to size",
      },
      truncatedNote: {
        title: "Truncation Note",
        description: "Details about truncation and how to get more content",
      },
      url: {
        title: "View Original",
        description: "The URL that was fetched",
      },
      statusCode: {
        title: "Status Code",
        description: "HTTP status code of the response",
      },
      timeElapsed: {
        title: "Time Elapsed (ms)",
        description: "Time taken to fetch the content in milliseconds",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The URL is invalid or missing",
      },
      internal: {
        title: "Fetch Error",
        description: "An error occurred while fetching the URL",
      },
    },
    success: {
      title: "Fetch Successful",
      description: "The URL content was fetched successfully",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Web",
    content: "Content",
  },
  cleanup: {
    post: {
      title: "URL Cache Cleanup",
      description: "Delete stale URL cache files older than 7 days",
      container: {
        title: "Cleanup Results",
        description: "Summary of deleted cache files",
      },
      response: {
        deletedCount: "Deleted Files",
        totalScanned: "Total Scanned",
        retentionDays: "Retention Days",
      },
      success: {
        title: "Cache Cleaned",
        description: "Stale URL cache files have been removed",
      },
    },
    errors: {
      server: {
        title: "Cleanup Error",
        description: "An error occurred while cleaning up the URL cache",
      },
    },
    name: "URL Cache Cleanup",
    description: "Weekly cleanup of stale URL fetch cache files",
  },
};
