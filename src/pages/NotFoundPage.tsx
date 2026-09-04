import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="properties-page">
      <div className="properties-header">
        <p className="section-eyebrow">404</p>
        <h1>Page Not Found</h1>
        <p>The page you requested does not exist or may have moved.</p>
        <Link to="/" className="primary-button">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
