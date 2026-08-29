export type PublicationStatus = "draft" | "published" | "archived";

export type ResearchResourceType = "Research paper" | "Video" | "Document";

type ResearchResourceBase = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  type: ResearchResourceType;
  authors: string[];
  href: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type PublishedResearchResource = ResearchResourceBase & {
  status: "published";
  publishedOn: string;
};

export type UnpublishedResearchResource = ResearchResourceBase & {
  status: "draft" | "archived";
  publishedOn: null;
};

export type ResearchResource = PublishedResearchResource | UnpublishedResearchResource;

export function isPublishedResearchResource(
  resource: ResearchResource,
): resource is PublishedResearchResource {
  return resource.status === "published";
}
