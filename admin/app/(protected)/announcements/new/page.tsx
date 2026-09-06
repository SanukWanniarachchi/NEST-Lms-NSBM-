import Link from "next/link";
import { AnnouncementForm } from "@admin/components/announcement-form";

export const metadata = { title: "New announcement" };

export default function NewAnnouncementPage() {
  return <div className="admin-page admin-page--form"><div className="breadcrumbs"><Link href="/announcements">Announcements</Link><span>/</span><span>New</span></div><header className="page-heading"><div><p className="eyebrow">Working draft</p><h1>New announcement</h1><p>Create a reviewed public notice. It remains private until Publish is selected.</p></div></header><AnnouncementForm defaultDate={new Date().toISOString().slice(0, 10)} /></div>;
}
