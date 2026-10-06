import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { publicPageUrl, publicSiteUrl } from "@/lib/public-site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: publicSiteUrl,
  title: {
    default: "NEST LMS | Learn, Create, Share",
    template: "%s | NEST LMS",
  },
  description:
    "A student-led learning experience from NEST Club, exploring cybersecurity, networking, and robotics through focused digital lessons.",
  applicationName: "NEST LMS",
  openGraph: {
    title: "NEST LMS | Learn, Create, Share",
    description: "Student-led technology learning through focused, visual courses.",
    type: "website",
    siteName: "NEST LMS",
    images: [{
      url: publicPageUrl("images/social/nest-lms-social.webp"),
      width: 1200,
      height: 630,
      alt: "NEST LMS — Learn together. Build what's next.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEST LMS | Learn, Create, Share",
    description: "Student-led technology learning through focused, visual courses.",
    images: [publicPageUrl("images/social/nest-lms-social.webp")],
  },
};

const themeScript = `
  try {
    const saved = localStorage.getItem('nest-theme');
    const theme = saved === 'dark' || saved === 'light'
      ? saved
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><a href="#main-content" className="skip-link">Skip to main content</a>{children}</body>
    </html>
  );
}
