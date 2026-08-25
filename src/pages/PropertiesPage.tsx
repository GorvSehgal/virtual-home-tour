import { properties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";

function PropertiesPage() {
    return (
      <div>
        <h1>Properties</h1>
  
        <div className="property-list">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </div>
    );
  }
  
  export default PropertiesPage;