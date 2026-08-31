import { z } from "zod";

export type ResearchFormValues = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: "research_paper" | "video" | "document";
  authors: string;
  href: string;
  tags: string;
};

export type ResearchFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<keyof ResearchFormValues, string[]>>;
};

const listField = z.string().transform((value) => (
  value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
));

export const researchFormSchema = z.object({
  id: z.string().trim().max(80),
  title: z.string().trim().min(3, "Enter a title of at least 3 characters.").max(120),
  slug: z.string().trim().min(3).max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens."),
  summary: z.string().trim().min(20, "Provide a summary of at least 20 characters.").max(600),
  type: z.enum(["research_paper", "video", "document"]),
  authors: listField.pipe(z.array(z.string().max(100)).min(1, "Add at least one author.").max(12)),
  href: z.url("Enter a valid resource URL.").refine((value) => {
    try {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  }, "Use an HTTP or HTTPS URL."),
  tags: listField.pipe(z.array(z.string().max(40)).min(1, "Add at least one topic tag.").max(10)),
});

export function researchValuesFromFormData(formData: FormData): ResearchFormValues {
  return {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    type: String(formData.get("type") ?? "research_paper") as ResearchFormValues["type"],
    authors: String(formData.get("authors") ?? ""),
    href: String(formData.get("href") ?? ""),
    tags: String(formData.get("tags") ?? ""),
  };
}
