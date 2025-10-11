/**
 * Audience Enums with Translation Options
 * Enum definitions for audience data with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Gender options for target audience
 */
export const {
  enum: Gender,
  options: GenderOptions,
  Value: GenderValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.businessData.audience.enums.gender.all",
  MALE: "app.api.v1.core.businessData.audience.enums.gender.male",
  FEMALE: "app.api.v1.core.businessData.audience.enums.gender.female",
  NON_BINARY: "app.api.v1.core.businessData.audience.enums.gender.nonBinary",
  OTHER: "app.api.v1.core.businessData.audience.enums.gender.other",
});

/**
 * Age range options
 */
export const {
  enum: AgeRange,
  options: AgeRangeOptions,
  Value: AgeRangeValue,
} = createEnumOptions({
  TEENS: "app.api.v1.core.businessData.audience.enums.ageRange.teens",
  YOUNG_ADULTS:
    "app.api.v1.core.businessData.audience.enums.ageRange.youngAdults",
  MILLENNIALS:
    "app.api.v1.core.businessData.audience.enums.ageRange.millennials",
  GEN_X: "app.api.v1.core.businessData.audience.enums.ageRange.genX",
  MIDDLE_AGED:
    "app.api.v1.core.businessData.audience.enums.ageRange.middleAged",
  BABY_BOOMERS:
    "app.api.v1.core.businessData.audience.enums.ageRange.babyBoomers",
  SENIORS: "app.api.v1.core.businessData.audience.enums.ageRange.seniors",
  ALL_AGES: "app.api.v1.core.businessData.audience.enums.ageRange.allAges",
});

/**
 * Income level options
 */
export const {
  enum: IncomeLevel,
  options: IncomeLevelOptions,
  Value: IncomeLevelValue,
} = createEnumOptions({
  LOW: "app.api.v1.core.businessData.audience.enums.incomeLevel.low",
  LOWER_MIDDLE:
    "app.api.v1.core.businessData.audience.enums.incomeLevel.lowerMiddle",
  MIDDLE: "app.api.v1.core.businessData.audience.enums.incomeLevel.middle",
  UPPER_MIDDLE:
    "app.api.v1.core.businessData.audience.enums.incomeLevel.upperMiddle",
  HIGH: "app.api.v1.core.businessData.audience.enums.incomeLevel.high",
  LUXURY: "app.api.v1.core.businessData.audience.enums.incomeLevel.luxury",
  ALL_LEVELS:
    "app.api.v1.core.businessData.audience.enums.incomeLevel.allLevels",
});

/**
 * Communication channel preferences
 */
export const {
  enum: CommunicationChannel,
  options: CommunicationChannelOptions,
  Value: CommunicationChannelValue,
} = createEnumOptions({
  EMAIL:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.email",
  SOCIAL_MEDIA:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.socialMedia",
  PHONE:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.phone",
  SMS: "app.api.v1.core.businessData.audience.enums.communicationChannel.sms",
  IN_PERSON:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.inPerson",
  WEBSITE:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.website",
  MOBILE_APP:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.mobileApp",
  DIRECT_MAIL:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.directMail",
  ADVERTISING:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.advertising",
  WORD_OF_MOUTH:
    "app.api.v1.core.businessData.audience.enums.communicationChannel.wordOfMouth",
});

// Create DB arrays for database schema
export const GenderDB = [
  Gender.ALL,
  Gender.MALE,
  Gender.FEMALE,
  Gender.NON_BINARY,
  Gender.OTHER,
] as const;

export const AgeRangeDB = [
  AgeRange.TEENS,
  AgeRange.YOUNG_ADULTS,
  AgeRange.MILLENNIALS,
  AgeRange.GEN_X,
  AgeRange.MIDDLE_AGED,
  AgeRange.BABY_BOOMERS,
  AgeRange.SENIORS,
  AgeRange.ALL_AGES,
] as const;

export const IncomeLevelDB = [
  IncomeLevel.LOW,
  IncomeLevel.LOWER_MIDDLE,
  IncomeLevel.MIDDLE,
  IncomeLevel.UPPER_MIDDLE,
  IncomeLevel.HIGH,
  IncomeLevel.LUXURY,
  IncomeLevel.ALL_LEVELS,
] as const;

export const CommunicationChannelDB = [
  CommunicationChannel.EMAIL,
  CommunicationChannel.SOCIAL_MEDIA,
  CommunicationChannel.PHONE,
  CommunicationChannel.SMS,
  CommunicationChannel.IN_PERSON,
  CommunicationChannel.WEBSITE,
  CommunicationChannel.MOBILE_APP,
  CommunicationChannel.DIRECT_MAIL,
  CommunicationChannel.ADVERTISING,
  CommunicationChannel.WORD_OF_MOUTH,
] as const;
