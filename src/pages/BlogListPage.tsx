import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listBlog } from "../services/blogApi";
import type { BlogSummary } from "../services/blogApi";
import "./Blog.css";

export default function BlogListPage() {
  const [articles, setArticles] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void listBlog().then(rows => { if (active) setArticles(rows); })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : "Could not load articles."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <main className="blog-page">
    <header className="blog-hero">
      <p className="section-eyebrow">REAL ESTATE KNOWLEDGE</p>
      <h1>ListingView360 Insights</h1>
      <p>Practical homebuying guides, Ontario neighbourhood insights and smarter real estate marketing.</p>
    </header>
    {loading && <p role="status">Loading articles…</p>}
    {error && <p role="alert">Articles are temporarily unavailable. Please check back soon.</p>}
    {!loading && !error && articles.length === 0 && <div className="blog-empty">
      <h2>Helpful real estate guides are on the way.</h2>
      <p>We're preparing practical, reviewed articles for Canadian homebuyers and realtors.</p>
      <Link className="primary-button" to="/demo">Explore our 360° demo</Link>
    </div>}
    <section className="blog-card-grid" aria-label="Published articles">
      {articles.map(article => <article key={article.slug} className="blog-card">
        <p className="section-eyebrow">{article.category}</p>
        <h2><Link to={`/blog/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        {article.publishedAt && <time dateTime={article.publishedAt}>Published {new Date(article.publishedAt).toLocaleDateString("en-CA")}</time>}
        <Link to={`/blog/${article.slug}`} className="blog-readmore">Read article →</Link>
      </article>)}
    </section>
  </main>;
}
