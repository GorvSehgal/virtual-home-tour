import { useEffect, useState } from "react";
import type { RealtorSession } from "../services/realtorApi";
import { listViewingLeads, listPropertyInsights, updateLead } from "../services/leadApi";
import type { ViewingLead, PropertyInsight } from "../services/leadApi";

export default function LeadsPanel({ session }: { session: RealtorSession }) {
  const [leads, setLeads] = useState<ViewingLead[]>([]);
  const [metrics, setMetrics] = useState<PropertyInsight[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function refresh() {
    setLoading(true); setError("");
    try {
      const [items, insights] = await Promise.all([listViewingLeads(session), listPropertyInsights(session)]);
      setLeads(items); setMetrics(insights);
    } catch(e) { setError(e instanceof Error ? e.message : "Could not load leads."); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let cancelled = false;
    Promise.all([listViewingLeads(session), listPropertyInsights(session)])
      .then(([items, insights]) => {
        if (!cancelled) { setLeads(items); setMetrics(insights); }
      })
      .catch(e => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load leads.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [session]);
  async function changeStatus(id: number, status: ViewingLead["status"]) {
    setSavingId(id); setError("");
    try { await updateLead(session,id,status); setLeads(items => items.map(l => l.id===id?{...l,status}:l)); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update lead."); }
    finally { setSavingId(null); }
  }
  const totalViews=metrics.reduce((n,m)=>n+m.views,0);
  const totalTours=metrics.reduce((n,m)=>n+m.tourStarts,0);
  return <section className="listing-dashboard-card listing-leads-panel" aria-label="Buyer enquiries and listing insights">
    <div className="listing-leads-heading">
      <div>
        <h2>Buyer enquiries and insights</h2>
        <p>Requests are private to the listing realtor and administrators. Viewing times require confirmation.</p>
      </div>
      <button type="button" className="secondary-button" onClick={()=>void refresh()} disabled={loading}>Refresh</button>
    </div>
    <div className="listing-lead-stats">
      <div><strong>{leads.filter(l=>l.status==="new").length}</strong><span>New leads</span></div>
      <div><strong>{leads.length}</strong><span>Total leads shown</span></div>
      <div><strong>{totalViews}</strong><span>Listing views*</span></div>
      <div><strong>{totalTours}</strong><span>360° tour starts*</span></div>
    </div>
    <p className="listing-insights-note">* Approximate counts, deduplicated by visitor for 15 minutes, not a precise audience measure.</p>
    {loading && <p role="status">Loading enquiries...</p>}
    {error && <p role="alert" className="listing-dashboard-error">{error}</p>}
    {!loading && leads.length===0 && <p>No buyer enquiries yet. Approved listings can receive requests from their property pages.</p>}
    {!loading && leads.length>0 && <div className="listing-leads-list">
      {leads.map(lead=><article className="listing-lead-item" key={lead.id}>
        <div>
          <h3>{lead.property.title} — {lead.property.city}</h3>
          <p><strong>{lead.name}</strong> · Received {new Date(lead.createdAt).toLocaleDateString("en-CA")}</p>
          <p>Preferred date: {new Date(lead.preferredDate).toLocaleDateString("en-CA",{timeZone:"UTC"})}</p>
          <p><a href={`mailto:${lead.email}`}>{lead.email}</a> · <a href={`tel:${lead.phone.replace(/[^\d+]/g,"")}`}>{lead.phone}</a></p>
          {lead.message && <p className="listing-lead-message">{lead.message}</p>}
        </div>
        <div className="listing-lead-status"><label htmlFor={`lead-status-${lead.id}`}>Lead status</label>
          <select id={`lead-status-${lead.id}`} value={lead.status} disabled={savingId===lead.id}
            onChange={e=>void changeStatus(lead.id,e.target.value as ViewingLead["status"])}>
            <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
          </select>
        </div>
      </article>)}
    </div>}
    {metrics.length>0 && <details className="listing-metrics-details"><summary>Listing-by-listing performance</summary>
      <div className="listing-metrics-table-wrap"><table><thead><tr><th>Listing</th><th>Views</th><th>Tour starts</th></tr></thead><tbody>
      {metrics.map(item=><tr key={item.propertyId}><td>{item.property.title}</td><td>{item.views}</td><td>{item.tourStarts}</td></tr>)}
      </tbody></table></div>
    </details>}
  </section>;
}
