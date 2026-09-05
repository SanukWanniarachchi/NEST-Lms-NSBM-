export type Announcement = {
  title: string;
  date: string;
  category: "Event" | "Research" | "Workshop" | "Community" | "Notice";
  summary: string;
  actionLabel?: string;
  actionHref?: string;
  featured?: boolean;
};

export const announcements: Announcement[] = [
  {
    title: "NEST learning community is open",
    date: "2026-08-23",
    category: "Community",
    summary: "Students can join the NEST Community WhatsApp group to follow club updates, learning activities, and peer-led opportunities.",
    actionLabel: "Join community",
    actionHref: "/community",
    featured: true,
  },
  {
    title: "Technology micro-lessons published",
    date: "2026-08-12",
    category: "Notice",
    summary: "The first public LMS release includes cybersecurity, networking, and robotics learning paths with structured micro-lessons.",
    actionLabel: "Explore courses",
    actionHref: "/courses",
  },
  {
    title: "NEST News is now available",
    date: "2026-09-03",
    category: "Notice",
    summary: "Course releases, community stories, achievements, partnerships, and research updates now have a shared home in NEST News.",
    actionLabel: "Read NEST News",
    actionHref: "/news",
  },
];
