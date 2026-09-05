import type { StaticImageData } from "next/image";

export type NewsCategory = "Community" | "Learning" | "Platform" | "Research";

export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  category: NewsCategory;
  publishedOn: string;
  author: string;
  image: StaticImageData;
  imageAlt: string;
  body: string[];
}
