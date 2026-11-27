import type { ResponseType } from "next-vibe/core/route/response.schema";

export interface PeppolDeliveryRequest {
  companyId: string;
  invoiceId: string;
  sender: { scheme: string; id: string };
  recipient: { scheme: string; id: string };
  customizationId: string;
  profileId: string;
  xml: string;
}

export interface PeppolAccessPoint {
  send(
    request: PeppolDeliveryRequest,
  ): Promise<ResponseType<{ deliveryId: string }>>;
}
