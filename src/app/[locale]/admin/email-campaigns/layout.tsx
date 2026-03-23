import { redirect } from "next-vibe-ui/lib/redirect";

export default function EmailCampaignsLayout(): never {
  redirect("/admin/messenger/campaigns");
}
