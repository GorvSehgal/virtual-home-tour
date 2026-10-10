import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { properties as demoProperties } from "../data/properties";

/**
 * Independently accessible sample inventory: never depends on API availability.
 * All examples are fictional and cannot accept real viewing requests.
 */
function DemoListingsPage() {
  return (
    <main className="properties-page demo-page">
      <header className="properties-header">
        <p className="section-eyebrow">INTERACTIVE PLATFORM PREVIEW</p>
        <h1>Explore the 360° Demo</h1>
        <p>
          Preview how a ListingView360 property page looks and works.
          Choose a sample property, explore room panoramas, and see the listing experience.
        </p>
      </header>

      <div className="demo-notice" role="note">
        <strong>Demonstration only.</strong> All six properties are fictional.
        Sample photos and 360° room imagery are illustrative, not photos of real listings.
        These properties are not for sale, rent, or viewing.
      </div>

      <section className="demo-listings" aria-label="Fictional example properties">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">SAMPLE PROPERTY PAGES</p>
            <h2>Choose a home to tour</h2>
          </div>
        </div>
        <div className="properties-grid">
          {demoProperties.map((property) => (
            <PropertyCard key={property.id} property={property} detailsBasePath="/demo" />
          ))}
        </div>
      </section>

      <section className="demo-bottom-cta">
        <h2>Want this experience for your own listing?</h2>
        <p>Showcase your property with a branded listing page and interactive virtual tour.</p>
        <div className="demo-actions">
          <Link className="primary-button" to="/list-property">List Your Property</Link>
          <Link className="secondary-button" to="/contact">Contact ListingView360</Link>
        </div>
      </section>
    </main>
  );
}

export default DemoListingsPage;
