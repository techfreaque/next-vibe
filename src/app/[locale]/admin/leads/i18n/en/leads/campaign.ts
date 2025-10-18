export const translations = {
  title: "Email Campaign System",
  description: "Automated email campaigns powered by cron jobs",
  starter: {
    title: "Campaign Starter",
    description: "Processes NEW leads → CONTACTED",
    schedule: "Business Hours",
  },
  emails: {
    title: "Email Campaigns",
    description: "Sends emails to CONTACTED leads",
    schedule: "Every 2 Hours",
  },
  cleanup: {
    title: "Lead Cleanup",
    description: "Maintains data quality",
    schedule: "Daily 2 AM",
  },
  info: "Campaign management is handled automatically by the cron system. Visit the Cron Admin page for detailed monitoring.",
};
