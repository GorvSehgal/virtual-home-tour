import { Link } from "react-router-dom";
import type { Property } from "../types/Property";

type PropertyCardProps = {
  property: Property;
  detailsBasePath?: string;
};

function PropertyCard({ property, detailsBasePath = "/properties" }: PropertyCardProps) {
  return (
    <article className="property-card">
      <div className="property-card-image">
        <img
          src={property.image}
          alt={`${property.title} in ${property.city}, ${property.province}`}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="property-card-content">
        <p className="property-price">
          ${property.price.toLocaleString("en-CA")}
        </p>

        {property.isDemo && (
          <span className="property-demo-label">DEMO — not available</span>
        )}
        <h3>{property.title}</h3>

        <p className="property-location">
          {property.city}, {property.province}
        </p>

        <p className="property-meta">
          {property.bedrooms} Beds · {property.bathrooms} Baths
        </p>

        <div className="property-card-actions">
          <Link
            to={`${detailsBasePath}/${property.id}`}
            className="card-secondary-button"
          >
            View Details
          </Link>

          {property.panoramas.length > 0 && (
            <Link
              to={`${detailsBasePath}/${property.id}`}
              className="card-primary-button"
            >
              360° Tour
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
