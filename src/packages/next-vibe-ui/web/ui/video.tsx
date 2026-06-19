"use client";

import type { JSX } from "react";

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  track: React.TrackHTMLAttributes<HTMLTrackElement>;
};

export function Video({ track, children, ...props }: VideoProps): JSX.Element {
  return (
    <video {...props}>
      <track kind="captions" {...track} />
      {children}
    </video>
  );
}
