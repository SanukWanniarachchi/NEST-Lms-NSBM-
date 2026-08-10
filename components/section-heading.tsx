import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, copy, action, align = "left" }: { eyebrow: string; title: string; copy?: string; action?: ReactNode; align?: "left" | "center" }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  );
}
