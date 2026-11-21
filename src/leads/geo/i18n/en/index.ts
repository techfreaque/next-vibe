export const translations = {
  update: {
    post: {
      title: "Update visitor country database",
      titleShort: "Geo IP update",
      description:
        "Loads the monthly DB-IP country table into the database and fills the country of leads that have none yet. Offline lookups, no per-visit API call.",
      tag: "Geo IP",
      container: {
        title: "Geo IP database",
        description: "IP to country data by DB-IP (CC BY 4.0)",
      },
      fields: {
        force: {
          label: "Force download",
          description:
            "Download the current release even when it is already stored",
        },
      },
      response: {
        status: "Status",
        version: "Release",
        v4Ranges: "IPv4 ranges",
        v6Ranges: "IPv6 ranges",
        backfilled: "Leads resolved",
        unresolved: "Leads still unresolved",
      },
      errors: {
        unauthorized: {
          title: "Not signed in",
          description: "Sign in as an admin to update the geo database.",
        },
        forbidden: {
          title: "Not allowed",
          description: "Only admins can update the geo database.",
        },
        server: {
          title: "Update failed",
          description: "The geo database could not be updated. Check the logs.",
        },
        unknown: {
          title: "Unexpected error",
          description: "Something went wrong while updating the geo database.",
        },
        validation: {
          title: "Invalid input",
          description: "Check the request fields.",
        },
        network: {
          title: "Network error",
          description: "The geo source could not be reached.",
        },
      },
      success: {
        title: "Geo database checked",
        description: "The country table is current.",
      },
    },
    task: {
      description:
        "Monthly DB-IP country update plus hourly lead country backfill",
    },
  },
  enums: {
    updateStatus: {
      updated: "Updated",
      current: "Already current",
      unavailable: "Download failed",
    },
  },
};
