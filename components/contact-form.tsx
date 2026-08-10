"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><div className="form-heading"><p className="eyebrow">Demo enquiry</p><h2>Send a practice message</h2></div>{sent ? <div className="form-success" role="status"><span><CheckIcon /></span><h3>Demo submitted</h3><p>Your message was not sent or stored. This confirms the local interface state works.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Write another message</button></div> : <><label>Full name<input required name="name" autoComplete="name" placeholder="Your name" /></label><label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label><label>Topic<select name="topic" defaultValue=""><option value="" disabled>Select a topic</option><option>Learning with NEST</option><option>Contributing a course</option><option>Club collaboration</option><option>General question</option></select></label><label>Message<textarea required name="message" rows={5} placeholder="Tell us what you have in mind…" /></label><button className="button button--primary" type="submit">Submit demo message <ArrowRightIcon /></button><small>No information leaves this browser.</small></>}</form>;
}
