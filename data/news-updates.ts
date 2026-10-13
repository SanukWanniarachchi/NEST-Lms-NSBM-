import { announcements } from "@/data/announcements";
import { newsArticles } from "@/data/news";

// These notices and stories describe the same original releases. Keep the
// published notice text and link its full story instead of showing two cards.
const relatedStories: Record<string, string> = {
  "2026-08-23|NEST learning community is open": "nest-learning-community-is-open",
  "2026-08-12|Technology micro-lessons published": "three-technology-learning-paths-published",
};

export const newsUpdates = (() => {
  const includedStories = new Set<string>();
  const notices = announcements.map(announcement => {
    const story = newsArticles.find(article => article.slug === relatedStories[`${announcement.date}|${announcement.title}`]);
    if (story) includedStories.add(story.slug);
    return {
      ...announcement, storyHref: story ? `/news/${story.slug}` : undefined,
      actionHref: announcement.actionHref?.replace(/\/$/, "") === "/news" ? undefined : announcement.actionHref,
      publishedNotice: true,
    };
  });
  const stories = newsArticles.filter(article => !includedStories.has(article.slug)).map(article => ({
    title: article.title, date: article.publishedOn, category: article.category,
    summary: article.summary, featured: false, storyHref: `/news/${article.slug}`,
    actionHref: undefined, actionLabel: undefined, publishedNotice: false,
  }));
  return [...notices, ...stories].sort((a, b) => b.date.localeCompare(a.date));
})();
