import { Image } from "next-vibe-ui/ui/image";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { cn } from "@/packages/next-vibe/shared";

interface SocialMediaImageProps {
  width?: number;
  height?: number;
  size?: number;
  className?: string;
  locale: CountryLanguage;
}

export const SocialMediaImages = {
  Facebook: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png"
        alt={t("app.socialMedia.platforms.facebook")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={props.className}
      />
    );
  },
  Twitter: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/X_Twitter_icon.svg/512px-X_Twitter_icon.svg.png?20231024193314"
        alt={t("app.socialMedia.platforms.twitter")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={cn(props.className, "dark:invert")}
      />
    );
  },
  Instagram: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png"
        alt={t("app.socialMedia.platforms.instagram")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={props.className}
      />
    );
  },
  LinkedIn: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/1200px-LinkedIn_logo_initials.png"
        alt={t("app.socialMedia.platforms.linkedin")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={props.className}
      />
    );
  },
  YouTube: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png"
        alt={t("app.socialMedia.platforms.youtube")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={props.className}
      />
    );
  },
  Threads: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Threads_%28app%29_logo.svg/1200px-Threads_%28app%29_logo.svg.png"
        alt={t("app.socialMedia.platforms.threads")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={props.className}
      />
    );
  },
  Mastodon: (props: SocialMediaImageProps): JSX.Element => {
    const { t } = simpleT(props.locale);
    return (
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Mastodon_Logotype_%28Simple%29.svg/1200px-Mastodon_Logotype_%28Simple%29.svg.png"
        alt={t("app.socialMedia.platforms.mastodon")}
        width={props.width || props.size || 24}
        height={props.height || props.size || 24}
        className={props.className}
      />
    );
  },
  // Add more social media platforms as needed
};

export const SocialMediaColors = {
  Facebook: "#1877F2",
  Twitter: "#1DA1F2",
  Instagram: "#E4405F",
  LinkedIn: "#0A66C2",
  YouTube: "#FF0000",
  Threads: "#000000",
  Mastodon: "#6364FF",
  // Add more social media platforms as needed
};
