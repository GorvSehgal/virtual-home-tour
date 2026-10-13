import { useState } from "react";
import type { FormEvent } from "react";

const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

export default function BookingForm({ propertyId, propertyTitle }: { propertyId: number; propertyTitle: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [working, setWorking] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (working) return;
    setError(""); setSuccess("");
    if (!base) { setError("Viewing requests are temporarily unavailable."); return; }
    if (phone.replace(/\D/g, "").length < 7) { setError("Enter a valid phone number."); return; }
    setWorking(true);
    try {
      const response = await fetch(`${base}/properties/${propertyId}/viewing-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, preferredDate, message, website }),
      });
      const body = await response.json() as { success?: boolean; data?: { message?: string }; message?: string };
      if (!response.ok || body.success !== true) {
        throw new Error(body.message || "Your request could not be saved. Please try again.");
      }
      setSuccess(body.data?.message || "Your request has been received. This is not a confirmed appointment.");
      setName(""); setEmail(""); setPhone(""); setPreferredDate(""); setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your viewing request.");
    } finally { setWorking(false); }
  }

  if (success) {
    return <div className="booking-success" role="status">
      <h3>Request received</h3>
      <p>{success}</p>
      <button type="button" className="secondary-button" onClick={() => setSuccess("")}>Request another date</button>
    </div>;
  }

  return <form className="booking-form" onSubmit={submit}>
    <p>Request a viewing for <strong>{propertyTitle}</strong>. The realtor will confirm availability with you.</p>
    <label htmlFor="viewing-name">Full name *</label>
    <input className="booking-input" id="viewing-name" name="name" required minLength={2} maxLength={100}
      autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
    <label htmlFor="viewing-email">Email *</label>
    <input className="booking-input" id="viewing-email" name="email" type="email" required maxLength={254}
      autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
    <label htmlFor="viewing-phone">Phone *</label>
    <input className="booking-input" id="viewing-phone" name="phone" type="tel" required maxLength={35}
      autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
    <label htmlFor="viewing-date">Preferred date *</label>
    <input className="booking-input" id="viewing-date" name="date" type="date" required
      min={new Date().toLocaleDateString("en-CA", {year:"numeric",month:"2-digit",day:"2-digit"}).replaceAll("/","-")}
      value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
    <label htmlFor="viewing-message">Message (optional)</label>
    <textarea className="booking-input" id="viewing-message" name="message" maxLength={1500}
      rows={4} value={message} onChange={e => setMessage(e.target.value)} />
    <div aria-hidden="true" style={{position:"absolute",left:"-10000px",height:0,overflow:"hidden"}}>
      <label htmlFor="viewing-website">Do not fill this field</label>
      <input id="viewing-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/>
    </div>
    <p className="booking-privacy-note">Your contact information will be shared with the property realtor to respond to your viewing request. <a href="/privacy">Privacy policy</a>.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="booking-submit" type="submit" disabled={working}>
      {working ? "Sending request..." : "Request Viewing"}
    </button>
  </form>;
}
