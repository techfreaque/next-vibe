/**
 * Consultation Schedule Email Templates (Client-side)
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

/**
 * Props for Scheduled Email Template
 */
export interface ScheduledEmailProps {
  userName: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
  translations: {
    subject: string;
    title: string;
    preview: string;
    greeting: string;
    message: string;
    details: string;
    date: string;
    joinMeeting: string;
    calendarEvent: string;
    footer: string;
    viewConsultations: string;
  };
}

/**
 * Props for Rescheduled Email Template
 */
export interface RescheduledEmailProps {
  userName: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
  translations: {
    subject: string;
    title: string;
    preview: string;
    greeting: string;
    notice: string;
    message: string;
    newSchedule: string;
    newDate: string;
    meetingLink: string;
    joinMeeting: string;
    apology: string;
    viewConsultations: string;
  };
}

/**
 * Props for Admin Email Template
 */
export interface AdminEmailProps {
  userName: string;
  userEmail: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
  appName: string;
  translations: {
    subject: string;
    title: string;
    preview: string;
    greeting: string;
    message: string;
    details: string;
    userName: string;
    userEmail: string;
    scheduledDate: string;
    meetingLink: string;
    closing: string;
  };
}

/**
 * Scheduled Email Template Component
 */
export function ScheduledEmailTemplate({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userName: _userName, // Currently unused but kept for interface compatibility
  scheduledDate,
  scheduledTime,
  meetingLink,
  translations,
}: ScheduledEmailProps): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>{translations.preview}</Preview>
      <Body>
        <Container>
          <Section>
            <Text>{translations.title}</Text>
            <Text>{translations.greeting}</Text>
            <Text>{translations.message}</Text>

            <Text>{translations.details}</Text>
            <Text>
              {translations.date}: {scheduledDate} {scheduledTime}
            </Text>

            {meetingLink && (
              <>
                <Text>{translations.joinMeeting}</Text>
                <Text>{meetingLink}</Text>
              </>
            )}

            <Text>{translations.calendarEvent}</Text>
            <Text>{translations.footer}</Text>
            <Text>{translations.viewConsultations}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Rescheduled Email Template Component
 */
export function RescheduledEmailTemplate({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userName: _userName, // Currently unused but kept for interface compatibility
  scheduledDate,
  scheduledTime,
  meetingLink,
  translations,
}: RescheduledEmailProps): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>{translations.preview}</Preview>
      <Body>
        <Container>
          <Section>
            <Text>{translations.title}</Text>
            <Text>{translations.greeting}</Text>
            <Text>{translations.notice}</Text>
            <Text>{translations.message}</Text>

            <Text>{translations.newSchedule}</Text>
            <Text>
              {translations.newDate}: {scheduledDate} {scheduledTime}
            </Text>

            {meetingLink && (
              <>
                <Text>{translations.meetingLink}</Text>
                <Text>{meetingLink}</Text>
                <Text>{translations.joinMeeting}</Text>
              </>
            )}

            <Text>{translations.apology}</Text>
            <Text>{translations.viewConsultations}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Admin Email Template Component
 */
export function AdminEmailTemplate({
  userName,
  userEmail,
  scheduledDate,
  scheduledTime,
  meetingLink,
  translations,
}: AdminEmailProps): React.JSX.Element {
  return (
    <Html>
      <Head />
      <Preview>{translations.preview}</Preview>
      <Body>
        <Container>
          <Section>
            <Text>{translations.title}</Text>
            <Text>{translations.greeting}</Text>
            <Text>{translations.message}</Text>

            <Text>{translations.details}</Text>
            <Text>
              {translations.userName}: {userName}
            </Text>
            <Text>
              {translations.userEmail}: {userEmail}
            </Text>
            <Text>
              {translations.scheduledDate}: {scheduledDate} {scheduledTime}
            </Text>

            {meetingLink && (
              <>
                <Text>
                  {translations.meetingLink}: {meetingLink}
                </Text>
              </>
            )}

            <Text>{translations.closing}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
