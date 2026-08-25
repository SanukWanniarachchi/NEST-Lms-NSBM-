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
    title: "Research and publications area prepared",
    date: "2026-08-25",
    category: "Research",
    summary: "A dedicated research area is being prepared for ongoing student projects, publications, and academic collaboration.",
    actionLabel: "View research",
    actionHref: "/research",
  },
];
