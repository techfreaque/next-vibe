import type { TemplateStatusValue } from "../enum";

export interface NotificationType {
  id: string;
  type: "created" | "updated" | "published" | "deleted";
  name: string;
  status: TemplateStatusValue;
  message?: string;
}
