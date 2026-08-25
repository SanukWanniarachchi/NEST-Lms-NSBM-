export type ResearchProject = {
  title: string;
  status: "Ongoing" | "Planning" | "Open for collaborators";
  area: string;
  summary: string;
};

export type Publication = {
  title: string;
  authors: string;
  year: string;
  status: "Planned" | "Drafting" | "Submitted" | "Published";
  summary: string;
  href?: string;
};

export const researchProjects: ResearchProject[] = [
  {
    title: "Research 1",
    status: "Ongoing",
    area: "Research area",
    summary: "Brief research description will be added after the project details are finalized.",
  },
  {
    title: "Research 2",
    status: "Planning",
    area: "Research area",
    summary: "Brief research description will be added after the project details are finalized.",
  },
  {
    title: "Research 3",
    status: "Open for collaborators",
    area: "Research area",
    summary: "Brief research description will be added after the project details are finalized.",
  },
];

export const publications: Publication[] = [
  {
    title: "Publication 1",
    authors: "NEST Research Team",
    year: "2026",
    status: "Planned",
    summary: "Publication details will be added after the content is finalized.",
  },
  {
    title: "Publication 2",
    authors: "NEST Research Team",
    year: "2026",
    status: "Drafting",
    summary: "Publication details will be added after the content is finalized.",
  },
];
