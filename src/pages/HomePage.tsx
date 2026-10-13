import { Link } from "react-router-dom";
import { useProperties } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import { properties as exampleProperties } from "../data/properties";

function HomePage() {
  const { properties, loading, error } = useProperties();
  const featuredProperties = properties.slice(0, 3);
  // The public API intentionally returns approved real listings only.
  // Until a realtor listing is approved, show clearly labeled sample cards
  // rather than an empty homepage or a text-only link to the demo.
  const showSamples = !loading && (Boolean(error) || featuredProperties.length === 0);
  const visibleProperties = showSamples ? exampleProperties.slice(0, 3) : featuredProperties;

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Immersive 360° Virtual Property Tours for Canadian Real Estate
          </h1>

          <p className="hero-description">
            ListingView360 helps Realtors showcase properties with interactive
            360° tours, professional listing pages, and direct buyer viewing
            requests.
          </p>

          <div className="hero-actions">
            <Link to="/demo" className="primary-button">
              Explore the 360° Demo
            </Link>

            <Link to="/properties" className="secondary-button">
              Browse Properties
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
            alt="Modern Canadian home interior"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">EXPLORE HOMES</p>
            <h2>{showSamples ? "Explore Sample Properties" : "Featured Properties"}</h2>
          </div>

          <Link to={showSamples ? "/demo" : "/properties"} className="view-all-link">
            {showSamples ? "View all six sample homes →" : "View all properties →"}
          </Link>
        </div>

        {showSamples && (
          <p className="demo-prompt" role="note">
            <strong>Interactive demos only.</strong> These sample homes are fictional, not for sale or rent.
            Approved realtor listings will appear here as they become available.
            {error && " Live inventory is temporarily unavailable."}
          </p>
        )}

        <div className="featured-grid">
          {loading && <p role="status">Loading featured properties...</p>}
          {!loading && visibleProperties.map((property) => (
            <PropertyCard
              key={showSamples ? `demo-${property.id}` : property.id}
              property={property}
              detailsBasePath={showSamples ? "/demo" : "/properties"}
            />
          ))}
        </div>
      </section>

      <section className="benefits-section" id="virtual-tours">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">WHY VIRTUAL TOURS?</p>
            <h2>A better way to explore properties</h2>
          </div>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Explore Remotely</h3>
            <p>Walk through properties from anywhere before visiting in person.</p>
          </div>

          <div className="benefit-card">
            <h3>Save Time</h3>
            <p>Shortlist the homes that actually deserve an in-person viewing.</p>
          </div>

          <div className="benefit-card">
            <h3>Better Listings</h3>
            <p>Give buyers a more immersive way to understand your property.</p>
          </div>

          <div className="benefit-card">
            <h3>Easy Booking</h3>
            <p>Request a viewing directly from the property details page.</p>
          </div>
        </div>
      </section>

      <section className="realtor-cta" id="for-realtors">
        <div className="realtor-cta-content">
          <p className="section-eyebrow">FOR REALTORS</p>

          <h2>Show your listings in a more immersive way.</h2>

          <p>
            Give buyers an interactive property experience with a dedicated
            listing page, 360° virtual tour, and direct viewing requests.
          </p>

          <div className="realtor-cta-actions">
            <Link to="/list-property" className="primary-button">
              List Your Property
            </Link>

            <Link to="/demo" className="secondary-button">
              Explore the Demo
            </Link>
          </div>
        </div>

        <div className="realtor-benefits">
          <p>✓ Shareable property page</p>
          <p>✓ Interactive 360° tour</p>
          <p>✓ Mobile-friendly experience</p>
          <p>✓ Direct buyer viewing requests</p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
