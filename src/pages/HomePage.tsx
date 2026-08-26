import { Link } from "react-router-dom";
import { properties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";


function HomePage() {
  const featuredProperties = properties.slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
        <h2>
  Turn Your Listings Into Immersive Experiences
</h2>

<p>
  ListingView360 helps Realtors showcase properties
  with interactive 360° tours, professional listing pages,
  and direct buyer viewing requests.
</p>

          <div className="hero-actions">
            <Link to="/properties" className="primary-button">
              Browse Properties
            </Link>

            <Link to="/list-property" className="secondary-button">
              List Your Property
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
            alt="Modern Canadian home interior"
          />
        </div>
      </section>
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">EXPLORE HOMES</p>
            <h2>Featured Properties</h2>
          </div>

          <Link to="/properties" className="view-all-link">
            View all properties →
          </Link>
        </div>

        <div className="featured-grid">
          {featuredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
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
      <a href="/list-property" className="primary-button">
        List Your Property
      </a>

      <a href="/contact" className="secondary-button">
        Request a Demo
      </a>
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