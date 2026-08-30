"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, PlayIcon } from "@/components/icons";
import { LessonVideo } from "@/components/lesson-video";
import { getYouTubeVideoId, getYouTubeWatchUrl } from "@/lib/youtube";
import type { Course } from "@/types/lms";

export function CurriculumAccordion({ course }: { course: Course }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return <div className="module-list">
    {course.modules.map((module, moduleIndex) => <details className="module-card" key={module.id} open={moduleIndex === 0}>
      <summary className="module-card__header">
        <span>{String(moduleIndex + 1).padStart(2, "0")}</span>
        <div><h3>{module.title}</h3><p>{module.description}</p></div>
        <small>{module.lessons.length} lessons</small>
        <i aria-hidden="true" />
      </summary>
      <div className="module-card__panel"><div className="lesson-list">
        {module.lessons.map((lesson, lessonIndex) => {
          const videoId = getYouTubeVideoId(lesson.youtubeUrl);
          const panelId = `lesson-video-${course.slug}-${lesson.slug}`;
          const isOpen = activeVideo === panelId;

          if (!videoId || !lesson.youtubeUrl) {
            return <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`} key={lesson.slug}><span className="lesson-status">{lessonIndex + 1}</span><span><strong>{lesson.title}</strong><small>{lesson.description}</small></span><span className="lesson-duration">{lesson.duration}<ArrowRightIcon /></span></Link>;
          }

          return <div className="lesson-row lesson-row--video" key={lesson.slug}>
            <Link className="lesson-row__link" href={`/courses/${course.slug}/lessons/${lesson.slug}`}>
              <span className="lesson-status">{lessonIndex + 1}</span>
              <span><strong>{lesson.title}</strong><small>{lesson.description}</small></span>
              <span className="lesson-duration">{lesson.duration}<ArrowRightIcon /></span>
            </Link>
            <button
              className="lesson-video-trigger"
              type="button"
              aria-label={`Watch ${lesson.title} video${lesson.videoDuration ? `, ${lesson.videoDuration}` : ""}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setActiveVideo(isOpen ? null : panelId)}
            >
              <PlayIcon />
              <span>Watch</span>
              {lesson.videoDuration ? <small>{lesson.videoDuration}</small> : null}
            </button>
            <div className={`lesson-video-expansion${isOpen ? " is-open" : ""}`} id={panelId} aria-hidden={!isOpen}>
              <div>
                {isOpen && lesson.youtubeUrl ? <div className="lesson-video-panel">
                  <div className="lesson-video-shell"><LessonVideo title={lesson.title} youtubeUrl={lesson.youtubeUrl} duration={lesson.videoDuration} loadOnMount /></div>
                  <a className="lesson-video-external" href={getYouTubeWatchUrl(videoId)} target="_blank" rel="noreferrer">Open on YouTube <ArrowRightIcon /></a>
                </div> : null}
              </div>
            </div>
          </div>;
        })}
      </div></div>
    </details>)}
  </div>;
}
