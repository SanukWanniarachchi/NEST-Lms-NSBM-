import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseForm } from "@admin/components/course-form";
import { getManagedContentRecord } from "@admin/lib/data/admin-data";
import type { CourseContent } from "@/types/lms";

export const metadata = { title: "Edit course" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getManagedContentRecord(id);
  if (!record || record.kind !== "course") notFound();
  return <div className="admin-page admin-page--form"><div className="breadcrumbs"><Link href="/courses">Courses</Link><span>/</span><span>Edit</span></div><header className="page-heading"><div><p className="eyebrow">Working version</p><h1>Edit course</h1><p>All curriculum fields are validated before the working draft can be published.</p></div></header><CourseForm id={record.id} course={record.workingPayload as unknown as CourseContent} /></div>;
}
