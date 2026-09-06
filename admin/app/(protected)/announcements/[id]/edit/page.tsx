import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementForm } from "@admin/components/announcement-form";
import { getManagedContentRecord } from "@admin/lib/data/admin-data";
import type { Announcement } from "@/data/announcements";

export const metadata = { title: "Edit announcement" };

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getManagedContentRecord(id);
  if (!record || record.kind !== "announcement") notFound();
  const announcement = record.workingPayload as Announcement;
  return <div className="admin-page admin-page--form"><div className="breadcrumbs"><Link href="/announcements">Announcements</Link><span>/</span><span>Edit</span></div><header className="page-heading"><div><p className="eyebrow">Working version</p><h1>Edit announcement</h1><p>Saving creates draft changes. The last published version remains public until this record is published again.</p></div></header><AnnouncementForm id={record.id} announcement={{ ...announcement, slug: record.slug }} /></div>;
}
