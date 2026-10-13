import type { NewsArticle } from "@/types/news";
import cybersecurityImage from "@/public/images/courses/cybersecurity-foundations.webp";
import campusImage from "@/public/images/illustrations/campus-hero.webp";
import communityImage from "@/public/images/social/nest-lms-social.webp";

export const newsArticles: NewsArticle[] = [
  {
    slug: "cybersecurity-video-lessons-now-available",
    title: "Cybersecurity video lessons are now part of the NEST curriculum",
    summary: "Eight short NEST videos now support the first cybersecurity modules with focused introductions to threats, safer habits, and core security ideas.",
    category: "Learning",
    publishedOn: "2026-09-03",
    author: "NEST Learning Team",
    image: cybersecurityImage,
    imageAlt: "A blue cybersecurity shield connected to a digital network",
    body: [
      "The Cybersecurity Foundations path now includes eight portrait-format video lessons produced for the NEST learning community. Each video is paired with the lesson whose objective most closely matches its topic.",
      "Students can begin with cybersecurity fundamentals before exploring hackers, common threats, malware, phishing, social engineering, and the CIA triad. The videos remain optional learning resources alongside the written objectives, activities, and recaps.",
      "The player is loaded only when requested, helping the public website stay responsive while giving learners a direct route to the official NEST YouTube channel.",
    ],
  },
  {
    slug: "nest-learning-community-is-open",
    title: "The NEST learning community is open",
    summary: "Students can now use the official community area to find the NEST WhatsApp group and follow learning activities and club updates.",
    category: "Community",
    publishedOn: "2026-08-23",
    author: "NEST Club",
    image: communityImage,
    imageAlt: "NEST LMS artwork with the words learn together and build what is next",
    body: [
      "The NEST community area gives students a clear route to the club's official WhatsApp group. It is intended for learning updates, student-led opportunities, and useful discussion around NEST activities.",
      "Everyone joining the space is expected to communicate respectfully, protect personal information, and keep shared material relevant to the club's educational purpose.",
      "Official notices, upcoming projects, workshop highlights, and longer stories now share one home on the News page.",
    ],
  },
  {
    slug: "three-technology-learning-paths-published",
    title: "Three guided technology learning paths are available",
    summary: "The first public NEST LMS release brings together beginner-friendly courses in cybersecurity, networking, and robotics.",
    category: "Platform",
    publishedOn: "2026-08-12",
    author: "NEST Learning Team",
    image: campusImage,
    imageAlt: "Students collaborating with technology resources on a green university campus",
    body: [
      "NEST LMS now offers three structured learning paths covering Cybersecurity Foundations, Networking Essentials, and Robotics Fundamentals. Together they contain 15 modules made for focused, independent study.",
      "Every lesson introduces one core idea, connects it to a practical situation, and closes with an activity or recap. Learners can move through a path in order or revisit individual concepts whenever they need them.",
      "NEST modules do not issue certificates. At the end of each module, learners can instead explore carefully selected university courses that offer their own free or paid certificate routes.",
    ],
  },
];

export function getNewsArticle(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}
