"use client";

import type { JSX } from "react";

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export function Video(props: VideoProps): JSX.Element {
  // eslint-disable-next-line jsx-a11y/media-has-caption, jsx-capitalization/jsx-capitalization
  return <video {...props} />;
}
