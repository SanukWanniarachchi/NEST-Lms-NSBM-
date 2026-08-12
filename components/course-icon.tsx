import type { CourseCategory } from "@/types/lms";
import { NetworkIcon, RobotIcon, ShieldIcon } from "@/components/icons";

export function CourseIcon({ category }: { category: CourseCategory }) {
  if (category === "Cybersecurity") return <ShieldIcon />;
  if (category === "Networking") return <NetworkIcon />;
  return <RobotIcon />;
}
