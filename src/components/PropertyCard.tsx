import type { Property } from "../types/Property";
import { Link } from "react-router-dom";

type PropertyCardProps = {
  property: Property;
};

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div>
      <img src={property.image} alt={property.title} />

      <h2>{property.title}</h2>

      <p>{property.location}</p>

      <p>${property.price}</p>

      <p>
        {property.bedrooms} Beds | {property.bathrooms} Baths
      </p>
      <Link to={`/properties/${property.id}`}>
  View Property
</Link>
    </div>
  );
}

export default PropertyCard;