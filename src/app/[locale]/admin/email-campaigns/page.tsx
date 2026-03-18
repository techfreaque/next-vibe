import { redirect } from "next/navigation";

export interface EmailCampaignsPageData {
  locale: string;
}

export async function tanstackLoader(): Promise<never> {
  redirect("/admin/messenger/campaigns");
}

// oxlint-disable-next-line no-unused-vars
export function TanstackPage(_props: EmailCampaignsPageData): never {
  redirect("/admin/messenger/campaigns");
}

export default function EmailCampaignsPage(): never {
  redirect("/admin/messenger/campaigns");
}
