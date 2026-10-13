import type { MetadataRoute } from "next";
import { courses } from "@/data/courses";
import { newsArticles } from "@/data/news";
import { publicPageUrl } from "@/lib/public-site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "about/", "community/", "courses/", "news/", "privacy/"];
  for (const course of courses) {
    paths.push(`courses/${course.slug}/`);
    for (const courseModule of course.modules) {
      paths.push(`courses/${course.slug}/checkpoints/${courseModule.id}/`);
      for (const lesson of courseModule.lessons) paths.push(`courses/${course.slug}/lessons/${lesson.slug}/`);
    }
  }
  for (const article of newsArticles) paths.push(`news/${article.slug}/`);
  return paths.map(path => ({ url: publicPageUrl(path) }));
}
