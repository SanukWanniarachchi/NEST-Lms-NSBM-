import snapshot from "@/data/generated/admin-content.json";

export type Announcement = {
  title: string;
  date: string;
  category: "Event" | "Research" | "Workshop" | "Community" | "Notice";
  summary: string;
  actionLabel?: string;
  actionHref?: string;
  featured?: boolean;
};

export const announcements: Announcement[] = snapshot.announcements as Announcement[];
