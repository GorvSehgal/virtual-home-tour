import { useState } from "react";
import type { FormEvent } from "react";
import { realtorApiConfigured, realtorLogin, draftDescription } from "../services/realtorApi";
import type { RealtorSession, DraftInput } from "../services/realtorApi";
import "./RealtorToolsPage.css";

type Fields = {
  title: string; propertyType: string; city: string; province: string;
  bedrooms: string; bathrooms: string; price: string; features: string;
  tone: DraftInput["tone"];
};

const initialFields: Fields = {
  title: "", propertyType: "Condo", city: "", province: "ON",
  bedrooms: "2", bathrooms: "2", price: "", features: "", tone: "professional",
};

function RealtorToolsPage() {
  // A token lives only in component memory; it is never saved to localStorage or a URL.
  const [session, setSession] = useState<RealtorSession | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fields, setFields] = useState<Fields>(initialFields);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const update = (key: keyof Fields, value: string) => {
    setFields((previous) => ({ ...previous, [key]: value }));
  };

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setError("");
    try {
      const signedIn = await realtorLogin(email, password);
      setSession(signedIn);
      setPassword("");
      setStatus("Signed in. You can now draft a listing description.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setWorking(false);
    }
  }

  function logout() {
    setSession(null);
    setDraft("");
    setStatus("");
    setError("");
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    setWorking(true);
    setError("");
    setStatus("");
    setDraft("");
    const price = fields.price.trim() === "" ? undefined : Number(fields.price);
    const bedrooms = Number(fields.bedrooms);
    const bathrooms = Number(fields.bathrooms);
    if ((price !== undefined && (!Number.isSafeInteger(price) || price <= 0)) ||
      !Number.isInteger(bedrooms) || bedrooms < 0 ||
      !Number.isFinite(bathrooms) || bathrooms < 0) {
      setWorking(false);
      setError("Please enter valid positive price and room values.");
      return;
    }
    const input: DraftInput = {
      title: fields.title.trim(),
      propertyType: fields.propertyType,
      city: fields.city.trim(),
      province: fields.province.trim(),
      bedrooms,
      bathrooms,
      ...(price !== undefined ? { price } : {}),
      features: fields.features.split(",").map((value) => value.trim()).filter(Boolean),
      tone: fields.tone,
    };
    try {
      const result = await draftDescription(session.accessToken, input);
      setDraft(result.draft);
      setStatus("Draft created. Verify every claim before publishing.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate a draft.");
    } finally {
      setWorking(false);
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Draft copied. Review it before publishing.");
    } catch {
      setError("Could not copy automatically. Select the description and copy it.");
    }
  }

  return (
    <main className="realtor-tools-page">
      <section className="realtor-tools-heading">
        <p className="section-eyebrow">LISTINGVIEW360 FOR REALTORS</p>
        <h1>Realtor AI Tools</h1>
        <p>Create a first draft of a property description using verified listing details.
          AI suggestions are never published automatically.</p>
      </section>

      {!realtorApiConfigured ? (
        <p role="alert" className="realtor-tools-error">
          The backend connection is not configured. Set VITE_API_BASE_URL to enable these tools.
        </p>
      ) : !session ? (
        <form className="realtor-tools-card" onSubmit={login}>
          <h2>Realtor sign in</h2>
          <p>Accounts must be provisioned by a ListingView360 administrator.</p>
          <label htmlFor="realtor-email">Email</label>
          <input id="realtor-email" type="email" required autoComplete="username"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="realtor-password">Password</label>
          <input id="realtor-password" type="password" required autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary-button" type="submit" disabled={working}>
            {working ? "Signing in..." : "Sign in"}
          </button>
        </form>
      ) : (
        <div className="realtor-tools-layout">
          <form className="realtor-tools-card" onSubmit={generate}>
            <div className="realtor-tools-session">
              <span>Signed in as {session.user.email}</span>
              <button type="button" className="secondary-button" onClick={logout}>Sign out</button>
            </div>
            <h2>Listing description</h2>
            <label htmlFor="ai-title">Listing title</label>
            <input id="ai-title" required minLength={3} maxLength={140} value={fields.title}
              onChange={(e) => update("title", e.target.value)} />
            <div className="realtor-tools-pair">
              <div>
                <label htmlFor="ai-type">Property type</label>
                <select id="ai-type" value={fields.propertyType}
                  onChange={(e) => update("propertyType", e.target.value)}>
                  <option>Condo</option><option>Detached</option><option>Townhouse</option>
                  <option>Semi-Detached</option><option>Apartment</option>
                </select>
              </div>
              <div>
                <label htmlFor="ai-city">City</label>
                <input id="ai-city" required value={fields.city} maxLength={80}
                  onChange={(e) => update("city", e.target.value)} />
              </div>
            </div>
            <div className="realtor-tools-pair">
              <div>
                <label htmlFor="ai-province">Province</label>
                <input id="ai-province" required value={fields.province} maxLength={80}
                  onChange={(e) => update("province", e.target.value)} />
              </div>
              <div>
                <label htmlFor="ai-price">Price (CAD, optional)</label>
                <input id="ai-price" type="number" min={1} step={1} value={fields.price}
                  onChange={(e) => update("price", e.target.value)} />
              </div>
            </div>
            <div className="realtor-tools-pair">
              <div>
                <label htmlFor="ai-bedrooms">Bedrooms</label>
                <input id="ai-bedrooms" type="number" required min={0} max={30} step={1}
                  value={fields.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
              </div>
              <div>
                <label htmlFor="ai-bathrooms">Bathrooms</label>
                <input id="ai-bathrooms" type="number" required min={0} max={30} step={0.5}
                  value={fields.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
              </div>
            </div>
            <label htmlFor="ai-features">Verified features (comma-separated)</label>
            <textarea id="ai-features" rows={3} value={fields.features}
              onChange={(e) => update("features", e.target.value)}
              placeholder="Balcony, Parking, Renovated kitchen" />
            <label htmlFor="ai-tone">Writing style</label>
            <select id="ai-tone" value={fields.tone}
              onChange={(e) => update("tone", e.target.value)}>
              <option value="professional">Professional</option>
              <option value="warm">Warm</option>
              <option value="luxury">Luxury</option>
            </select>
            <button className="primary-button" type="submit" disabled={working}>
              {working ? "Creating draft..." : "Generate draft"}
            </button>
          </form>
          <section className="realtor-tools-card">
            <h2>Your draft</h2>
            <p>Check all claims, measurements, and advertising compliance before use.</p>
            {draft ? (
              <>
                <textarea className="realtor-tools-output" rows={14} readOnly value={draft}
                  aria-label="AI-generated listing draft" />
                <button className="secondary-button" type="button" onClick={copyDraft}>
                  Copy draft
                </button>
              </>
            ) : (
              <p className="realtor-tools-placeholder">
                Your generated description will appear here. No content will be posted automatically.
              </p>
            )}
          </section>
        </div>
      )}
      {status && <p role="status" className="realtor-tools-status">{status}</p>}
      {error && <p role="alert" className="realtor-tools-error">{error}</p>}
      <p className="realtor-tools-footnote">
        For account security, this screen does not remember your sign-in after a page refresh.
      </p>
    </main>
  );
}

export default RealtorToolsPage;
