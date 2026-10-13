"use client";

import { useRef } from "react";

export function SiteCredits() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return <>
    <button type="button" className="credits-trigger" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
      Site credits <span aria-hidden="true">↗</span>
    </button>
    <dialog ref={dialogRef} className="credits-dialog" aria-labelledby="credits-title" aria-describedby="credits-intro" onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      <button type="button" className="credits-close" aria-label="Close site credits" onClick={() => dialogRef.current?.close()}>×</button>
      <p className="eyebrow">Site credits</p>
      <h2 id="credits-title">The people behind NEST LMS</h2>
      <p id="credits-intro" className="credits-intro">Created together by</p>
      <ul className="credits-names">
        {["Sanuk Wanniarachchi", "Vidumini Gamage", "Dulen Dayarathna"].map(name => <li key={name}><span aria-hidden="true" />{name}</li>)}
      </ul>
    </dialog>
  </>;
}
