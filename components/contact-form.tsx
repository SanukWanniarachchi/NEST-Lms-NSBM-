"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  return <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setPrepared(true); }}><div className="form-heading"><p className="eyebrow">Start a conversation</p><h2>Prepare your enquiry</h2></div>{prepared ? <div className="form-success" role="status"><span><CheckIcon /></span><h3>Your enquiry is ready</h3><p>Keep this page open and share the message through an official NEST Club channel. The website has not transmitted or stored your details.</p><button type="button" className="text-link" onClick={() => setPrepared(false)}>Edit your message</button></div> : <><label>Full name<input required name="name" autoComplete="name" placeholder="Your name" /></label><label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label><label>Topic<select name="topic" defaultValue=""><option value="" disabled>Select a topic</option><option>Learning with NEST</option><option>Contributing a course</option><option>Club collaboration</option><option>General question</option></select></label><label>Message<textarea required name="message" rows={5} placeholder="Tell us what you have in mind…" /></label><button className="button button--primary" type="submit">Prepare enquiry <ArrowRightIcon /></button><small>Your information remains in this browser and is not transmitted.</small></>}</form>;
}
