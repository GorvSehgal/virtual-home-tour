import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { realtorApiConfigured, realtorLogin } from "../services/realtorApi";
import type { RealtorSession } from "../services/realtorApi";
import { listManaged, reviewListing, saveListing, uploadPhoto } from "../services/listingManagerApi";
import type { ManagedListing, SaveListing } from "../services/listingManagerApi";
import "./ListingDashboardPage.css";

type Fields = {
  title: string; address: string; city: string; province: string; postalCode: string;
  listingType: "sale" | "rent"; price: string; bedrooms: string; bathrooms: string;
  propertyType: string; yearBuilt: string; description: string; realtorName: string;
  realtorBrokerage: string; panoramas: string;
};
type Photo = { key: number; src: string; file?: File; url?: string };
const empty: Fields = {
  title: "", address: "", city: "", province: "ON", postalCode: "",
  listingType: "sale", price: "", bedrooms: "2", bathrooms: "1",
  propertyType: "Condo", yearBuilt: "", description: "", realtorName: "",
  realtorBrokerage: "", panoramas: "",
};
function fieldsFor(item: ManagedListing): Fields {
  return {
    title: item.title, address: item.address, city: item.city, province: item.province,
    postalCode: item.postalCode, listingType: item.listingType, price: String(item.price),
    bedrooms: String(item.bedrooms), bathrooms: String(item.bathrooms),
    propertyType: item.propertyType, yearBuilt: item.yearBuilt ? String(item.yearBuilt) : "",
    description: item.description, realtorName: item.realtorName,
    realtorBrokerage: item.realtorBrokerage ?? "",
    panoramas: item.panoramas.map((p) => `${p.name} | ${p.url}`).join("\n"),
  };
}
function toListing(fields: Fields, images: string[]): SaveListing {
  const price = Number(fields.price), bedrooms = Number(fields.bedrooms), bathrooms = Number(fields.bathrooms);
  const yearBuilt = fields.yearBuilt.trim() ? Number(fields.yearBuilt) : undefined;
  if (!Number.isSafeInteger(price) || price < 1 || !Number.isInteger(bedrooms) || bedrooms < 0 ||
      !Number.isFinite(bathrooms) || bathrooms < 0 ||
      (yearBuilt !== undefined && (!Number.isInteger(yearBuilt) || yearBuilt < 1800 || yearBuilt > 2200))) {
    throw new Error("Enter a valid price, number of rooms and year built.");
  }
  if (fields.title.trim().length < 2 || fields.description.trim().length < 10 ||
      fields.address.trim().length < 3 || fields.city.trim().length < 2 ||
      fields.province.trim().length < 2 || fields.postalCode.trim().length < 3 ||
      fields.realtorName.trim().length < 2 || fields.propertyType.trim().length < 2) {
    throw new Error("Complete required property details and a description of at least 10 characters.");
  }
  if (images.length < 1 || images.length > 15) throw new Error("Add between 1 and 15 property photos.");
  const panoramas = fields.panoramas.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const i = line.indexOf("|"), name = i < 0 ? "" : line.slice(0, i).trim();
    const url = i < 0 ? "" : line.slice(i + 1).trim();
    if (!name || !/^https:\/\//.test(url)) throw new Error("Use Room | https://... on each panorama line.");
    return { name, url };
  });
  return {
    title: fields.title.trim(), address: fields.address.trim(), city: fields.city.trim(),
    province: fields.province.trim(), postalCode: fields.postalCode.trim(),
    listingType: fields.listingType, price, bedrooms, bathrooms,
    propertyType: fields.propertyType.trim(), ...(yearBuilt ? { yearBuilt } : {}),
    description: fields.description.trim(), realtorName: fields.realtorName.trim(),
    realtorBrokerage: fields.realtorBrokerage.trim(), images, panoramas,
  };
}

export default function ListingDashboardPage() {
  const [session, setSession] = useState<RealtorSession | null>(null);
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [listings, setListings] = useState<ManagedListing[]>([]);
  const [fields, setFields] = useState<Fields>(empty);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [working, setWorking] = useState(false), [loading, setLoading] = useState(false);
  const [error, setError] = useState(""), [notice, setNotice] = useState("");
  const nextKey = useRef(1), objectUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = objectUrls.current;
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); urls.clear(); };
  }, []);
  function clearPhotos() {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear(); setPhotos([]);
  }
  function resetForm() { clearPhotos(); setFields(empty); setEditingId(undefined); }
  function change(name: keyof Fields, value: string) { setFields((old) => ({ ...old, [name]: value })); }
  async function refresh(signedIn: RealtorSession) {
    setLoading(true);
    try { setListings(await listManaged(signedIn)); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load listings."); }
    finally { setLoading(false); }
  }
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setNotice(""); setWorking(true);
    try {
      const user = await realtorLogin(email, password);
      setSession(user); setPassword("");
      setNotice(`Signed in as ${user.user.role}. Listing changes require administrator approval.`);
      await refresh(user);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
    finally { setWorking(false); }
  }
  function logout() { setSession(null); setListings([]); resetForm(); setError(""); setNotice(""); }
  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; setError("");
    if (photos.length + files.length > 15) { setError("You can upload a maximum of 15 photos per listing."); return; }
    const bad = files.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024);
    if (bad) { setError(`${bad.name}: use JPEG, PNG or WebP, maximum 5 MB.`); return; }
    const added = files.map((file) => {
      const src = URL.createObjectURL(file); objectUrls.current.add(src);
      return { key: nextKey.current++, src, file };
    });
    setPhotos((previous) => [...previous, ...added]);
  }
  function removePhoto(key: number) {
    const removed = photos.find((p) => p.key === key);
    if (removed?.file) { URL.revokeObjectURL(removed.src); objectUrls.current.delete(removed.src); }
    setPhotos((old) => old.filter((p) => p.key !== key));
  }
  function movePhoto(index: number, step: number) {
    const destination = index + step;
    if (destination < 0 || destination >= photos.length) return;
    setPhotos((old) => {
      const next = [...old];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }
  function edit(item: ManagedListing) {
    if (session?.user.role !== "admin" && item.ownerId !== session?.user.id) {
      setError("You can only edit your own listings."); return;
    }
    clearPhotos();
    setPhotos(item.images.map((url) => ({ key: nextKey.current++, src: url, url })));
    setFields(fieldsFor(item)); setEditingId(item.id); setError("");
    setNotice("Editing an approved listing will return it to pending review.");
    document.getElementById("listing-form")?.scrollIntoView({ behavior: "smooth" });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!session || working) return;
    setWorking(true); setError(""); setNotice("");
    try {
      if (photos.length === 0) throw new Error("Select at least one property photo.");
      // Validate all listing fields before uploading photos to avoid orphan uploads.
      toListing(fields, photos.map((p) => p.url ?? "https://placeholder.invalid/pending-upload"));
      const images: string[] = [];
      for (const photo of photos) {
        if (photo.url) images.push(photo.url);
        else if (photo.file) images.push(await uploadPhoto(session, photo.file));
      }
      await saveListing(session, toListing(fields, images), editingId);
      resetForm();
      setNotice("Listing submitted for review. It will only be public after administrator approval.");
      await refresh(session);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save listing."); }
    finally { setWorking(false); }
  }
  async function review(item: ManagedListing, status: "approved" | "rejected") {
    if (!session || session.user.role !== "admin" || working) return;
    setWorking(true); setError(""); setNotice("");
    try {
      await reviewListing(session, item.id, status);
      setNotice(`Listing #${item.id} ${status}.`);
      await refresh(session);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to review listing."); }
    finally { setWorking(false); }
  }
  return (
    <main className="listing-dashboard">
      <header className="listing-dashboard-header">
        <p className="section-eyebrow">LISTINGVIEW360</p>
        <h1>Listing management</h1>
        <p>Realtors upload photos and submit properties. An administrator approves each listing before public display.</p>
      </header>
      {!realtorApiConfigured ? (
        <p role="alert" className="listing-dashboard-error">The property API is not connected. Set VITE_API_BASE_URL to the API HTTPS URL ending in /api/v1.</p>
      ) : !session ? (
        <form className="listing-dashboard-card listing-login" onSubmit={login}>
          <h2>Realtor / Admin sign in</h2>
          <p>Accounts are provisioned privately by ListingView360. Public registration is not available.</p>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="primary-button" disabled={working}>{working ? "Signing in..." : "Sign in"}</button>
        </form>
      ) : (
        <>
          <div className="listing-dashboard-toolbar">
            <p>Signed in as <strong>{session.user.email}</strong> ({session.user.role})</p>
            <button className="secondary-button" type="button" onClick={logout}>Sign out</button>
          </div>
          <div className="listing-dashboard-layout">
            <form id="listing-form" className="listing-dashboard-card listing-editor" onSubmit={submit}>
              <h2>{editingId ? `Edit listing #${editingId}` : "Add a property"}</h2>
              <p>Required fields are marked *. Upload multiple photos and choose the cover image by moving it to the first position.</p>
              <div className="listing-input-pair">
                <label>Title *<input required value={fields.title} onChange={(e) => change("title", e.target.value)} /></label>
                <label>Property type *<select value={fields.propertyType} onChange={(e) => change("propertyType", e.target.value)}>
                  {["Condo", "Detached", "Semi-Detached", "Townhouse", "Apartment", "Other"].map((type) => <option key={type}>{type}</option>)}
                </select></label>
              </div>
              <label>Address *<input required value={fields.address} onChange={(e) => change("address", e.target.value)} /></label>
              <div className="listing-input-pair">
                <label>City *<input required value={fields.city} onChange={(e) => change("city", e.target.value)} /></label>
                <label>Province *<input required value={fields.province} onChange={(e) => change("province", e.target.value)} /></label>
              </div>
              <div className="listing-input-pair">
                <label>Postal code *<input required value={fields.postalCode} onChange={(e) => change("postalCode", e.target.value)} /></label>
                <label>Listing type *<select value={fields.listingType} onChange={(e) => change("listingType", e.target.value)}>
                  <option value="sale">For sale</option><option value="rent">For rent</option>
                </select></label>
              </div>
              <div className="listing-input-pair">
                <label>Price (CAD) *<input type="number" min="1" step="1" required value={fields.price} onChange={(e) => change("price", e.target.value)} /></label>
                <label>Year built<input type="number" min="1800" max="2200" value={fields.yearBuilt} onChange={(e) => change("yearBuilt", e.target.value)} /></label>
              </div>
              <div className="listing-input-pair">
                <label>Bedrooms *<input type="number" min="0" step="1" required value={fields.bedrooms} onChange={(e) => change("bedrooms", e.target.value)} /></label>
                <label>Bathrooms *<input type="number" min="0" step="0.5" required value={fields.bathrooms} onChange={(e) => change("bathrooms", e.target.value)} /></label>
              </div>
              <label>Realtor name *<input required value={fields.realtorName} onChange={(e) => change("realtorName", e.target.value)} /></label>
              <label>Brokerage<input value={fields.realtorBrokerage} onChange={(e) => change("realtorBrokerage", e.target.value)} /></label>
              <label>Property description *<textarea required minLength={10} rows={5} value={fields.description} onChange={(e) => change("description", e.target.value)} /></label>
              <fieldset className="listing-photo-fieldset">
                <legend>Property photos * ({photos.length}/15)</legend>
                <label htmlFor="listing-photo-upload" className="listing-upload-label">Select photos (multiple)</label>
                <input id="listing-photo-upload" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} disabled={working} />
                <p>JPG, PNG or WebP, maximum 5 MB each. First photo becomes the cover. Use the arrows to reorder.</p>
                {photos.length > 0 && <div className="listing-photo-grid">
                  {photos.map((photo, index) => (
                    <div key={photo.key} className="listing-photo-item">
                      <img src={photo.src} alt={`Photo ${index + 1} preview`} />
                      <span>{index === 0 ? "Cover photo" : `Photo ${index + 1}`}</span>
                      <div>
                        <button type="button" disabled={working || index === 0} onClick={() => movePhoto(index, -1)} aria-label={`Move photo ${index + 1} left`}>←</button>
                        <button type="button" disabled={working || index === photos.length - 1} onClick={() => movePhoto(index, 1)} aria-label={`Move photo ${index + 1} right`}>→</button>
                        <button type="button" disabled={working} onClick={() => removePhoto(photo.key)} aria-label={`Remove photo ${index + 1}`}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>}
              </fieldset>
              <label>Optional 360° panoramas (one per line: Room | https://...jpg)
                <textarea rows={3} value={fields.panoramas} onChange={(e) => change("panoramas", e.target.value)} placeholder="Living Room | https://example.com/360.jpg" />
              </label>
              <div className="listing-form-actions">
                <button className="primary-button" type="submit" disabled={working}>{working ? "Uploading photos / saving..." : editingId ? "Save changes for review" : "Submit listing for approval"}</button>
                {editingId && <button className="secondary-button" type="button" onClick={resetForm} disabled={working}>Cancel edit</button>}
              </div>
            </form>
            <section className="listing-dashboard-card listing-queue">
              <h2>{session.user.role === "admin" ? "All listings and approval queue" : "My listings"}</h2>
              <p>{session.user.role === "admin" ? "Review photos and property details before publishing." : "Pending and rejected listings are private until approved."}</p>
              {loading && <p role="status">Loading listings...</p>}
              {!loading && listings.length === 0 && <p>No submitted listings yet.</p>}
              {listings.map((item) => (
                <article className="listing-queue-item" key={item.id}>
                  {item.images[0] && <img src={item.images[0]} alt={item.title} loading="lazy" />}
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.city}, {item.province} · ${item.price.toLocaleString("en-CA")}</p>
                    <p><strong>Status: {item.status}</strong> · {item.images.length} photos</p>
                    {item.status === "approved" && <a href={`/properties/${item.id}`} target="_blank" rel="noopener noreferrer">View public listing</a>}
                    <div className="listing-queue-actions">
                      <button type="button" className="secondary-button" disabled={working} onClick={() => edit(item)}>Edit</button>
                      {session.user.role === "admin" && (
                        <>
                          {item.status !== "approved" && <button type="button" className="primary-button" disabled={working} onClick={() => review(item, "approved")}>Approve</button>}
                          {item.status !== "rejected" && <button type="button" className="secondary-button" disabled={working} onClick={() => review(item, "rejected")}>Reject / Unpublish</button>}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </>
      )}
      {notice && <p className="listing-dashboard-success" role="status">{notice}</p>}
      {error && <p className="listing-dashboard-error" role="alert">{error}</p>}
      <p className="listing-dashboard-footnote">For security, this page does not store your login token in localStorage. Refreshing the page requires signing in again.</p>
    </main>
  );
}
