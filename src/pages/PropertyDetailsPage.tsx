import { useParams } from "react-router-dom";
import { useProperty } from "../hooks/useProperties";
import { useEffect, useState } from "react";
import { recordPropertyEvent } from "../services/propertyApi";
import VirtualTourViewer from "../components/VirtualTourViewer";
import BookingForm from "../components/BookingForm";
import PropertyImageGallery from "../components/PropertyImageGallery";
import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { properties as demoProperties } from "../data/properties";

function PropertyDetailsPage({ demoMode = false }: { demoMode?: boolean }) {
    const [showTour, setShowTour] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { id } = useParams<{ id: string }>();

  const requestedId = id ? Number(id) : undefined;
  // Demo data is always local; a configured API must never hide demonstration tours.
  const { property: apiProperty, loading, error } = useProperty(demoMode ? undefined : requestedId);
  useEffect(() => {
    if (!demoMode && apiProperty?.id) void recordPropertyEvent(apiProperty.id, "view");
  }, [demoMode, apiProperty?.id]);
  const property = demoMode
    ? demoProperties.find((item) => item.id === requestedId) ?? null
    : apiProperty;

  if (loading) return <p role="status">Loading property...</p>;
  if (error) return <p role="alert">Could not load property: {error}</p>;
  if (!property) {
    return <h1>Property not found</h1>;
  }

  return (
    <div className="property-details-page">
  <Link to={demoMode ? "/demo" : "/properties"} className="back-link">
    ← Back to {demoMode ? "Demo Listings" : "Properties"}
  </Link>

  <div className="property-details-header">
    <div>
      <h1>{property.title}</h1>
      <p>
        {property.city}, {property.province}
      </p>
    </div>

    <div className="details-actions">
      <button type="button" className="secondary-button" aria-pressed={isFavorite(property)}
        onClick={() => toggleFavorite(property)}>
        {isFavorite(property) ? "♥ Saved to favourites" : "♡ Save to favourites"}
      </button>
      <p className="details-price">
      ${property.price.toLocaleString("en-CA")}
      </p>
    </div>
  </div>

  {property.isDemo && (
    <p role="note" className="property-demo-notice">
      DEMO LISTING — Fictional property for website testing. Not available for sale, rent, or viewing.
    </p>
  )}

  <PropertyImageGallery
    key={property.id}
    photos={property.images?.length ? property.images : [property.image]}
    title={property.title}
  />

  <div className="property-stats">
    <span>{property.bedrooms} Beds</span>
    <span>{property.bathrooms} Baths</span>
    <span>{property.propertyType}</span>
    {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
  </div>

  {!property.isDemo && (
    <section className="property-location-map" aria-label="Property location">
      <h2>Location</h2>
      <p>{property.address}, {property.city}, {property.province} {property.postalCode}</p>
      <iframe title={`Map of ${property.title}`} loading="lazy" referrerPolicy="no-referrer"
        src={`https://maps.google.com/maps?q=${encodeURIComponent([property.address, property.city, property.province, property.postalCode].join(", "))}&output=embed`} />
      <p><a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([property.address, property.city, property.province, property.postalCode].join(", "))}`}>Open location in Google Maps ↗</a></p>
    </section>
  )}
  <section className="property-about">
    <h2>About this property</h2>
    <p>{property.description}</p>
  </section>

  <div className="property-experience-grid">
    <section className="tour-section">
      <h2>360° Virtual Tour</h2>
      <p className="tour-description">
    {property.isDemo ? "Explore the sample rooms in 360°. These are demonstration images, not a real home for sale." : "Explore this property interactively in 360° before booking an in-person viewing."}
  </p>
      {property.panoramas.length > 0 ? (
        <>
          <button
            className="primary-button"
            onClick={() => {
              if (!showTour && !demoMode) void recordPropertyEvent(property.id, "tour_start");
              setShowTour((prev) => !prev);
            }}
          >
            {showTour ? "Close Virtual Tour" : "Start 360° Tour"}
          </button>
          {showTour && <VirtualTourViewer panoramas={property.panoramas} />}
        </>
      ) : (
        <p>A 360° virtual tour is not yet available for this property.</p>
      )}
    </section>

    <aside className="booking-panel">
      <h2>Book a Viewing</h2>
      {property.isDemo ? (
        <p>This is a fictional demonstration property; viewings cannot be booked.</p>
      ) : (
        <BookingForm propertyId={property.id} propertyTitle={property.title} />
      )}
    </aside>
  </div>
</div> 
  );
}

export default PropertyDetailsPage;