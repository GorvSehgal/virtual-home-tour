import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { realtorLogin } from "../services/realtorApi";
import type { RealtorSession } from "../services/realtorApi";
import { manageBlog, saveBlog, changeBlogStatus } from "../services/blogApi";
import type { BlogInput, ManagedBlog } from "../services/blogApi";
import "./Blog.css";

const blank: BlogInput = { slug: "", title: "", excerpt: "", category: "Buyer Guides", body: "" };
function makeSlug(title: string): string {
  return title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 140);
}
export default function BlogAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<RealtorSession | null>(null);
  const [items, setItems] = useState<ManagedBlog[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [fields, setFields] = useState<BlogInput>(blank);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const selected = items.find(item => item.id === selectedId);
  function update(field: keyof BlogInput, value: string) {
    setFields(current => ({
      ...current, [field]: value,
      ...(field === "title" && !selectedId && !current.slug ? { slug: makeSlug(value) } : {}),
    }));
  }
  async function refresh(token: string) {
    setItems(await manageBlog(token));
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setWorking(true);
    try {
      const result = await realtorLogin(email, password);
      if (result.user.role !== "admin") throw new Error("Administrator access required.");
      await refresh(result.accessToken);
      setSession(result); setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally { setWorking(false); }
  }
  function choose(item: ManagedBlog) {
    setSelectedId(item.id);
    setFields({ title: item.title, slug: item.slug, excerpt: item.excerpt, category: item.category, body: item.body });
    setError(""); setNotice("");
  }
  function startNew() {
    setSelectedId(null); setFields(blank); setError(""); setNotice("");
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || working) return;
    setWorking(true); setError(""); setNotice("");
    try {
      const result = await saveBlog(session.accessToken, fields, selectedId || undefined);
      await refresh(session.accessToken);
      setSelectedId(result.id);
      setNotice("Draft saved. Publishing requires a separate approval.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save draft.");
    } finally { setWorking(false); }
  }
  async function doAction(action: "approve" | "reject" | "publish" | "unpublish") {
    if (!session || !selectedId || working) return;
    const label = action === "publish" ? "publish this article publicly" : action === "unpublish" ? "remove this article from public view" : action + " this draft";
    if (!window.confirm(`Are you sure you want to ${label}?`)) return;
    setWorking(true); setError(""); setNotice("");
    try {
      await changeBlogStatus(session.accessToken, selectedId, action);
      await refresh(session.accessToken);
      setNotice(`Article ${action === "publish" ? "published" : action === "unpublish" ? "unpublished" : action === "approve" ? "approved" : "rejected"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change article status.");
    } finally { setWorking(false); }
  }
  return <main className="blog-admin">
    <p className="section-eyebrow">LISTINGVIEW360 ADMINISTRATION</p>
    <h1>Blog editor &amp; approvals</h1>
    <p>Draft privately, review facts and sources, then approve and publish. No AI draft is ever published automatically.</p>
    <p><Link to="/blog">← Visit the public blog</Link></p>
    {error && <p className="blog-admin-error" role="alert">{error}</p>}
    {notice && <p className="blog-admin-message" role="status">{notice}</p>}
    {!session ? <form className="blog-admin-login" onSubmit={login}>
      <h2>Administrator sign in</h2>
      <label>Email<input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)}/></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)}/></label>
      <button type="submit" className="primary-button" disabled={working}>{working ? "Signing in…" : "Sign in"}</button>
    </form> : <>
      <div className="blog-admin-controls">
        <button type="button" className="secondary-button" onClick={startNew}>New article</button>
        <button type="button" className="secondary-button" onClick={() => void refresh(session.accessToken).catch(err => setError(err instanceof Error ? err.message : "Unable to reload."))}>Refresh</button>
        <button type="button" className="secondary-button" onClick={() => {
          setSession(null); setItems([]); setSelectedId(null); setFields(blank); setError(""); setNotice("");
        }}>Sign out</button>
      </div>
      <div className="blog-admin-grid">
        <form className="blog-admin-form" onSubmit={save}>
          <h2>{selected ? `Edit article #${selected.id}` : "New blog draft"}</h2>
          {selected && <p className="blog-admin-status">Status: <strong>{selected.status}</strong> · Revision {selected.revision}</p>}
          <label>Title<input required minLength={8} maxLength={180} value={fields.title} onChange={event => update("title", event.target.value)} /></label>
          <label>URL slug<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={140} value={fields.slug} onChange={event => update("slug", event.target.value)} /></label>
          <label>Category<input required minLength={2} maxLength={70} value={fields.category} onChange={event => update("category", event.target.value)} /></label>
          <label>Short summary<textarea required minLength={20} maxLength={360} rows={3} value={fields.excerpt} onChange={event => update("excerpt", event.target.value)} /></label>
          <label>Article body (plain text, separate paragraphs with blank lines)
            <textarea required minLength={60} maxLength={60000} rows={14} value={fields.body} onChange={event => update("body", event.target.value)} />
          </label>
          <p>Review every factual claim and confirm image rights. Published articles must be unpublished before editing.</p>
          <div className="blog-admin-controls">
            <button type="submit" disabled={working || selected?.status === "published"} className="primary-button">{working ? "Working…" : selected?.status === "published" ? "Unpublish before editing" : "Save as draft"}</button>
            {selected?.status === "draft" && <button type="button" disabled={working} onClick={() => void doAction("approve")} className="secondary-button">Approve</button>}
            {selected && ["draft", "approved"].includes(selected.status) && <button type="button" disabled={working} onClick={() => void doAction("reject")} className="secondary-button">Reject</button>}
            {selected?.status === "approved" && <button type="button" disabled={working} onClick={() => void doAction("publish")} className="primary-button">Publish publicly</button>}
            {selected?.status === "published" && <button type="button" disabled={working} onClick={() => void doAction("unpublish")} className="secondary-button">Unpublish</button>}
          </div>
        </form>
        <aside className="blog-admin-list">
          <h2>Articles ({items.length})</h2>
          {items.length === 0 && <p>No drafts yet. Create the first article.</p>}
          {items.map(item => <button type="button" key={item.id} onClick={() => choose(item)} aria-current={selectedId === item.id ? "true" : undefined}>
            <strong>{item.title}</strong><span className="blog-admin-status"> — {item.status}</span>
          </button>)}
        </aside>
      </div>
    </>}
  </main>;
}
