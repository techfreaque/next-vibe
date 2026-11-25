export const translations = {
  post: {
    title: "IndexNow submit",
    titleShort: "IndexNow",
    description:
      "Ping Bing, Yandex, Seznam, Naver and Yep with every new or changed sitemap URL. Production only, skips URLs already sent.",
    tag: "SEO",
    container: {
      title: "IndexNow run",
      description: "What was sent to the search engines",
    },
    fields: {
      force: {
        label: "Resubmit everything",
        description:
          "Send every sitemap URL again, not only new or changed ones.",
      },
      dryRun: {
        label: "Dry run",
        description: "Count pending URLs without sending them.",
      },
    },
    response: {
      status: "Status",
      host: "Host",
      totalUrls: "Sitemap URLs",
      pendingUrls: "Pending URLs",
      submittedUrls: "Submitted URLs",
      requests: "Requests sent",
    },
    errors: {
      unauthorized: {
        title: "Not signed in",
        description: "Sign in as an admin to submit URLs.",
      },
      forbidden: {
        title: "Admins only",
        description: "Only admins can submit URLs to IndexNow.",
      },
      server: {
        title: "Submission failed",
        description:
          "IndexNow rejected the submission or the sitemap could not be built. Check the server log.",
      },
      unknown: {
        title: "Unexpected error",
        description: "Something went wrong while submitting URLs.",
      },
      validation: {
        title: "Invalid input",
        description: "Check the submitted options.",
      },
      keyUnreachable: {
        title: "Key file unreachable",
        description:
          "The IndexNow key file at the site root did not answer 200 with the key, so nothing was sent. Check the server log.",
      },
      network: {
        title: "IndexNow unreachable",
        description:
          "The IndexNow API did not answer. The next run retries the pending URLs.",
      },
    },
    success: { title: "Done", description: "IndexNow run finished." },
  },
  enums: {
    status: {
      submitted: "Submitted",
      unchanged: "Nothing new",
      dryRun: "Dry run",
      notProduction: "Skipped (not production)",
    },
  },
  task: {
    description:
      "Hourly: sends new or changed sitemap URLs to IndexNow (Bing, Yandex and partners).",
  },
};
