"use client";

import { useState, type CSSProperties } from "react";
import { PlayIcon } from "@/components/icons";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
} from "@/lib/youtube";

type LessonVideoProps = {
  title: string;
  youtubeUrl: string;
  duration?: string;
};

export function LessonVideo({ title, youtubeUrl, duration }: LessonVideoProps) {
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const videoId = getYouTubeVideoId(youtubeUrl);

  if (!videoId) return null;

  if (playerLoaded) {
    return <iframe
      src={getYouTubeEmbedUrl(videoId)}
      title={`${title} video lesson`}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />;
  }

  const facadeStyle = {
    "--video-thumbnail": `url("${getYouTubeThumbnailUrl(videoId)}")`,
  } as CSSProperties;

  return <button
    className="lesson-video-facade"
    type="button"
    style={facadeStyle}
    onClick={() => setPlayerLoaded(true)}
    aria-label={`Load video player for ${title}`}
  >
    <span className="lesson-video-facade__play" aria-hidden="true"><PlayIcon /></span>
    <span className="lesson-video-facade__copy">
      <small>{duration ? `${duration} video` : "Video lesson"}</small>
      <strong>{title}</strong>
      <span>Load the YouTube player</span>
    </span>
  </button>;
}
