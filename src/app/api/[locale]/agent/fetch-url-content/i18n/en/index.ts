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
};
