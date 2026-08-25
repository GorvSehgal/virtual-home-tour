import { useState } from "react";
import { properties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

function PropertiesPage() {
  const [search, setSearch] = useState("");
const [city, setCity] = useState("all");
const [propertyType, setPropertyType] = useState("all");
const [bedrooms, setBedrooms] = useState("all");
const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [sortBy, setSortBy] = useState("default");
const filteredProperties = properties.filter(property => {
  const matchesSearch =
    property.title.toLowerCase().includes(search.toLowerCase()) ||
    property.city.toLowerCase().includes(search.toLowerCase()) ||
    property.address.toLowerCase().includes(search.toLowerCase());

  const matchesCity =
    city === "all" || property.city === city;

  const matchesType =
    propertyType === "all" || property.propertyType === propertyType;

  const matchesBedrooms =
    bedrooms === "all" || property.bedrooms >= Number(bedrooms);

  const matchesMinPrice =
    minPrice === "" || property.price >= Number(minPrice);

  const matchesMaxPrice =
    maxPrice === "" || property.price <= Number(maxPrice);

  return (
    matchesSearch &&
    matchesCity &&
    matchesType &&
    matchesBedrooms &&
    matchesMinPrice &&
    matchesMaxPrice
  );
});
const sortedProperties = [...filteredProperties];

if (sortBy === "price-asc") {
  sortedProperties.sort((a, b) => a.price - b.price);
}

if (sortBy === "price-desc") {
  sortedProperties.sort((a, b) => b.price - a.price);
}
const handleResetFilters = () => {
  setSearch("");
  setCity("all");
  setPropertyType("all");
  setBedrooms("all");
  setMinPrice("");
  setMaxPrice("");
  setSortBy("default");
};
    return (
      <div>
        <h1>Properties</h1>
        <PropertyFilters
  search={search}
  city={city}
  propertyType={propertyType}
  bedrooms={bedrooms}
  minPrice={minPrice}
  maxPrice={maxPrice}
  sortBy={sortBy}
  onSearchChange={setSearch}
  onCityChange={setCity}
  onPropertyTypeChange={setPropertyType}
  onBedroomsChange={setBedrooms}
  onMinPriceChange={setMinPrice}
  onMaxPriceChange={setMaxPrice}
  onSortChange={setSortBy}
  onReset={handleResetFilters}
/>
  
        <div className="property-list">
           {sortedProperties.length === 0 ? (
    <p>No properties found.</p>
  ) : sortedProperties.map(property => (
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