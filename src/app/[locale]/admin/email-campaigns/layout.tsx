import { redirect } from "next/navigation";

export default function EmailCampaignsLayout(): never {
  redirect("/admin/messenger/campaigns");
}
