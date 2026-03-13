import { redirect } from "next/navigation";

export default function EmailCampaignsPage(): never {
  redirect("/admin/messenger/campaigns");
}
