import { Link } from "react-router-dom";
import type { Property } from "../types/Property";

type PropertyCardProps = {
  property: Property;
};

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="property-card">
      <div className="property-card-image">
        <img
          src={property.image}
          alt={property.title}
        />
      </div>

      <div className="property-card-content">
        <p className="property-price">
          ${property.price.toLocaleString("en-CA")}
        </p>

        <h3>{property.title}</h3>

        <p className="property-location">
          {property.city}, {property.province}
        </p>

        <p className="property-meta">
          {property.bedrooms} Beds · {property.bathrooms} Baths
        </p>

        <div className="property-card-actions">
          <Link
            to={`/properties/${property.id}`}
            className="card-secondary-button"
          >
            View Details
          </Link>

          <Link
            to={`/properties/${property.id}`}
            className="card-primary-button"
          >
            360° Tour
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;