import { useParams } from "react-router-dom";
import { properties } from "../data/properties";
import { useState } from "react";
import VirtualTourViewer from "../components/VirtualTourViewer";
import BookingForm from "../components/BookingForm";
import { Link } from "react-router-dom";

function PropertyDetailsPage() {
    const [showTour, setShowTour] = useState(false);
    const { slug } = useParams<{ slug: string }>();
    const propertyId = Number(slug?.split("-").pop());
 
  const property = properties.find(
    property => property.id === Number(propertyId)
  );


  if (!property) {
    return <h1>Property not found</h1>;
  }

  return (
    <div className="property-details-page">
  <Link to="/properties" className="back-link">
    ← Back to Properties
  </Link>

  <div className="property-details-header">
    <div>
      <h1>{property.title}</h1>
      <p>
        {property.city}, {property.province}
      </p>
    </div>

    <p className="details-price">
      ${property.price.toLocaleString("en-CA")}
    </p>
  </div>

  <img
    className="property-hero-image"
    src={property.image}
    alt={property.title}
  />

  <div className="property-stats">
    <span>{property.bedrooms} Beds</span>
    <span>{property.bathrooms} Baths</span>
    <span>{property.propertyType}</span>
    {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
  </div>

  <section className="property-about">
    <h2>About this property</h2>
    <p>{property.description}</p>
  </section>

  <div className="property-experience-grid">
    <section className="tour-section">
      <h2>360° Virtual Tour</h2>
      <p className="tour-description">
    Explore this property interactively in 360° before booking an in-person viewing.
  </p>
      <button
        className="primary-button"
        onClick={() => setShowTour(prev => !prev)}
      >
        {showTour ? "Close Virtual Tour" : "Start 360° Tour"}
      </button>

      {showTour && (
        <VirtualTourViewer panoramas={property.panoramas} />
      )}
    </section>

    <aside className="booking-panel">
      <h2>Book a Viewing</h2>
      <BookingForm />
    </aside>
  </div>
</div> 
  );
}

export default PropertyDetailsPage;