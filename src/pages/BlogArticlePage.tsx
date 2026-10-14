import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlog } from "../services/blogApi";
import type { BlogArticle } from "../services/blogApi";
import "./Blog.css";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!slug) return;
    void getBlog(slug).then(item => {
      if (!active) return;
      setArticle(item);
      document.title = `${item.title} | ListingView360`;
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (description) description.content = item.excerpt;
    }).catch(() => {
      if (active) setError("This article is not available.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  return <main className="blog-page">
    <Link to="/blog" className="back-link">← Back to Insights</Link>
    {loading && <p role="status">Loading article…</p>}
    {error && <p role="alert">{error}</p>}
    {!loading && article && <article className="blog-article">
      <p className="section-eyebrow">{article.category}</p>
      <h1>{article.title}</h1>
      <p className="blog-excerpt">{article.excerpt}</p>
      {article.publishedAt && <time dateTime={article.publishedAt}>Published {new Date(article.publishedAt).toLocaleDateString("en-CA")}</time>}
      <div className="blog-body">{article.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) =>
        <p key={index}>{paragraph}</p>)}</div>
      <aside className="blog-cta">
        <h2>Explore ListingView360</h2>
        <p>Experience immersive property tours or learn how to showcase your listing.</p>
        <Link to="/demo" className="primary-button">Explore 360° demo</Link>
        <Link to="/for-realtors" className="secondary-button">For realtors</Link>
      </aside>
      <p className="blog-disclaimer">General information only. Confirm current property, mortgage, tax and legal details with qualified professionals and official sources.</p>
    </article>}
  </main>;
}
