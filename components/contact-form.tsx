"use client";

import { useState, type ChangeEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { community } from "@/data/community";

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: "", email: "", topic: "", message: "" });
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const preparedMessage = [
    `Name: ${enquiry.name.trim()}`,
    `Email: ${enquiry.email.trim()}`,
    `Topic: ${enquiry.topic || "General question"}`,
    "",
    enquiry.message.trim(),
  ].join("\n");

  function updateEnquiry(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setEnquiry((current) => ({ ...current, [name]: value }));
    setCopyState("idle");
  }

  async function copyMessage() {
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(preparedMessage);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return <form className="contact-form" onSubmit={(event) => {
    event.preventDefault();
    setCopyState("idle");
    setPrepared(true);
  }}>
    <div className="form-heading"><p className="eyebrow">Start a conversation</p><h2>Prepare your enquiry</h2></div>
    {prepared ? <div className="form-success">
      <span><CheckIcon /></span>
      <h3>Your enquiry is ready</h3>
      <p>Open a draft addressed to NEST Club in your email app, or copy the message. You review and send it yourself; this website has not sent your enquiry.</p>
      <label className="form-message-preview">Prepared enquiry<textarea readOnly rows={8} value={preparedMessage} onFocus={(event) => event.currentTarget.select()} /></label>
      <div className="form-success-actions">
        <a className="button button--primary" href={`mailto:${community.emailAddress}?subject=${encodeURIComponent(`NEST enquiry: ${enquiry.topic || "General question"}`)}&body=${encodeURIComponent(preparedMessage)}`}>Open email draft</a>
        <button type="button" className="button button--secondary" disabled={copyState === "copying"} onClick={copyMessage}>{copyState === "copying" ? "Copying…" : "Copy message"}</button>
        <button type="button" className="text-link" onClick={() => { setCopyState("idle"); setPrepared(false); }}>Edit your message</button>
      </div>
      <p className="form-copy-status" role="status">{copyState === "copied" ? "Message copied. Paste it into your preferred club channel." : copyState === "error" ? "Automatic copying is unavailable. Select the prepared enquiry above and copy it manually." : ""}</p>
    </div> : <>
      <label>Full name<input required name="name" autoComplete="name" placeholder="Your name" value={enquiry.name} onChange={updateEnquiry} /></label>
      <label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" value={enquiry.email} onChange={updateEnquiry} /></label>
      <label>Topic<select name="topic" value={enquiry.topic} onChange={updateEnquiry}><option value="" disabled>Select a topic</option><option>Learning with NEST</option><option>Contributing a course</option><option>Club collaboration</option><option>General question</option></select></label>
      <label>Message<textarea required name="message" rows={5} placeholder="Tell us what you have in mind…" value={enquiry.message} onChange={updateEnquiry} /></label>
      <button className="button button--primary" type="submit">Prepare enquiry <ArrowRightIcon /></button>
      <small>Your information remains in this browser and is not transmitted.</small>
    </>}
  </form>;
}
