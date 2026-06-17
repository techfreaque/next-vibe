"use client";

import type { JSX } from "react";

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export function Video(props: VideoProps): JSX.Element {
  return <video {...props} />;
}
