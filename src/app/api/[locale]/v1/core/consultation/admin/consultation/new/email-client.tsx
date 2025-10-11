/**
 * Admin Consultation New Email Templates (Client-side)
 * Pure React components for email templates without server logic
 */

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Props for Partner Email Template
 */
export interface PartnerEmailProps {
  name: string;
  businessName: string;
  preferredDate: string;
  message: string;
  locale: CountryLanguage;
}

/**
 * Props for Internal Email Template
 */
export interface InternalEmailProps {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string;
  businessType: string;
  preferredDate: string;
  priority: string;
  message: string;
  internalNotes: string;
  appName: string;
  locale: CountryLanguage;
}

/**
 * Partner Email Template Component
 */
export function PartnerEmailTemplate({
  name,
  businessName,
  preferredDate,
  message,
  locale,
}: PartnerEmailProps): React.JSX.Element {
  const { t } = simpleT(locale);
  return (
    <Html>
      <Head />
      <Preview>
        {t(
          "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.preview",
          { businessName },
        )}
      </Preview>
      <Body>
        <Container>
          <Section>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.title",
                { name },
              )}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.greeting",
                { name },
              )}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.message",
              )}
            </Text>

            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.details",
              )}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.preferredDate",
              )}
              : {preferredDate}
            </Text>

            {message && (
              <>
                <Text>
                  {t(
                    "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.additionalMessage",
                  )}
                </Text>
                <Text>{message}</Text>
              </>
            )}

            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.partner.nextSteps",
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Internal Email Template Component
 */
export function InternalEmailTemplate({
  contactName,
  contactEmail,
  contactPhone,
  businessName,
  businessType,
  preferredDate,
  priority,
  message,
  internalNotes,
  locale,
}: InternalEmailProps): React.JSX.Element {
  const { t } = simpleT(locale);
  return (
    <Html>
      <Head />
      <Preview>
        {t(
          "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.preview",
          { businessName },
        )}
      </Preview>
      <Body>
        <Container>
          <Section>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.title",
              )}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.greeting",
              )}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.message",
              )}
            </Text>

            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.details",
              )}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.contactName",
              )}
              : {contactName}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.contactEmail",
              )}
              : {contactEmail}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.contactPhone",
              )}
              : {contactPhone}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.businessName",
              )}
              : {businessName}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.businessType",
              )}
              : {businessType}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.preferredDate",
              )}
              : {preferredDate}
            </Text>
            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.priority",
              )}
              : {priority}
            </Text>

            {message && (
              <>
                <Text>
                  {t(
                    "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.messageContent",
                  )}
                </Text>
                <Text>{message}</Text>
              </>
            )}

            {internalNotes && (
              <>
                <Text>
                  {t(
                    "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.internalNotes",
                  )}
                </Text>
                <Text>{internalNotes}</Text>
              </>
            )}

            <Text>
              {t(
                "app.api.v1.core.consultation.admin.consultation.new.post.emailTemplates.internal.closing",
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
