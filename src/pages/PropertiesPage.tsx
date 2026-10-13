import { useState } from "react";
import { Link } from "react-router-dom";
import { useProperties } from "../hooks/useProperties";
import { properties as demoProperties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

function PropertiesPage() {
  const { properties, loading, error } = useProperties();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The API intentionally exposes only approved, real listings. Never approve
  // fictional seed records to fill the page. Instead use a separately labeled
  // demo catalog when there is no approved inventory.
  const showingDemos = !loading && (properties.length === 0 || properties.every(p => p.isDemo));
  const catalog = showingDemos ? demoProperties : properties;
  const cities = Array.from(new Set(catalog.map(p => p.city))).sort();
  const propertyTypes = Array.from(new Set(catalog.map(p => p.propertyType))).sort();
  const hasActiveFilters = search.trim() !== "" || city !== "all" || propertyType !== "all" ||
    bedrooms !== "all" || minPrice !== "" || maxPrice !== "";

  const filteredProperties = catalog.filter(p => (
    [p.title, p.city, p.address].some(text => text.toLowerCase().includes(search.trim().toLowerCase())) &&
    (city === "all" || p.city === city) &&
    (propertyType === "all" || p.propertyType === propertyType) &&
    (bedrooms === "all" || p.bedrooms >= Number(bedrooms)) &&
    (minPrice === "" || p.price >= Number(minPrice)) &&
    (maxPrice === "" || p.price <= Number(maxPrice))
  ));

  const sortedProperties = [...filteredProperties];
  if (sortBy === "price-asc") sortedProperties.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") sortedProperties.sort((a, b) => b.price - a.price);

  function resetFilters() {
    setSearch("");
    setCity("all");
    setPropertyType("all");
    setBedrooms("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  }

  return (
    <section className="properties-page">
      <header className="properties-header">
        <p className="section-eyebrow">EXPLORE PROPERTIES</p>
        <h1>{showingDemos ? "Explore 360° Demo Homes" : "Properties"}</h1>
        <p>{showingDemos
          ? "Experience how property photos and interactive 360° tours work on ListingView360."
          : "Find your next home with immersive 360° virtual tours."}</p>
      </header>

      {showingDemos && (
        <aside className="properties-demo-banner" aria-label="Demo listings notice">
          <div>
            <strong>Sample properties — not real listings</strong>
            <p>
              {error
                ? "Live listings are temporarily unavailable. Explore these six fictional demos while we restore the connection."
                : "No approved real estate listings are available yet. These six fictional properties are only for exploring the platform and cannot be purchased, rented or booked."}
            </p>
          </div>
          <Link to="/signup" className="secondary-button">Are you a realtor? List a property</Link>
        </aside>
      )}

      <button className="properties-mobile-filter-toggle" type="button"
        aria-expanded={filtersOpen} aria-controls="properties-filters"
        onClick={() => setFiltersOpen(open => !open)}>
        {filtersOpen ? "Hide filters ▲" : "Search and filters ▼"}
      </button>
      <div id="properties-filters" className={`properties-filter-wrapper ${filtersOpen ? "open" : ""}`}>
        <PropertyFilters
          cities={cities} propertyTypes={propertyTypes} search={search}
          city={city} propertyType={propertyType} bedrooms={bedrooms}
          minPrice={minPrice} maxPrice={maxPrice} sortBy={sortBy}
          onSearchChange={setSearch} onCityChange={setCity} onPropertyTypeChange={setPropertyType}
          onBedroomsChange={setBedrooms} onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice}
          onSortChange={setSortBy} onReset={resetFilters}
        />
      </div>

      <div className="results-toolbar" role="status" aria-live="polite">
        {loading
          ? "Loading properties…"
          : `${sortedProperties.length} ${showingDemos ? "demo" : "real"} ${sortedProperties.length === 1 ? "property" : "properties"} found`}
      </div>
      {!loading && (
        <div className="properties-grid">
          {sortedProperties.length === 0 ? (
            <div className="properties-empty-state">
              <h2>No matching properties</h2>
              <p>{hasActiveFilters
                ? "Try clearing your filters to see more properties."
                : "No properties are available right now."}</p>
              {hasActiveFilters && (
                <button type="button" className="secondary-button" onClick={resetFilters}>Clear all filters</button>
              )}
            </div>
          ) : sortedProperties.map(p => (
            <PropertyCard key={`${showingDemos ? "demo" : "real"}-${p.id}`}
              property={p} detailsBasePath={showingDemos ? "/demo" : "/properties"} />
          ))}
        </div>
      )}
      {showingDemos && <p className="properties-demo-footer">
        These properties are fictional demonstrations, not active real estate inventory.
        <Link to="/demo"> View all interactive demos →</Link>
      </p>}
    </section>
  );
}

export default PropertiesPage;
