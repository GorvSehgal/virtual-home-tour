type PropertyFiltersProps = {
    search: string;
    city: string;
    propertyType: string;
    bedrooms: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
  
    onSearchChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onPropertyTypeChange: (value: string) => void;
    onBedroomsChange: (value: string) => void;
    onMinPriceChange: (value: string) => void;
    onMaxPriceChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onReset: () => void;
  };

function PropertyFilters({search,
    city,
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
    sortBy,
    onSearchChange,
    onCityChange,
    onPropertyTypeChange,
    onBedroomsChange,
    onMinPriceChange,
    onMaxPriceChange,
onSortChange,
onReset} : PropertyFiltersProps) { 
   
return (
    <div className="filters-panel">
      <div className="filters-grid">
        <input
          className="filter-control search-control"
          type="text"
          placeholder="Search city, address..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />

        <select
          className="filter-control"
          value={city}
          onChange={e => onCityChange(e.target.value)}
        >
          <option value="all">All Cities</option>
          <option value="Vancouver">Vancouver</option>
          <option value="Toronto">Toronto</option>
          <option value="Calgary">Calgary</option>
          <option value="Ottawa">Ottawa</option>
          <option value="Montreal">Montreal</option>
          <option value="Kelowna">Kelowna</option>
        </select>

        <select
          className="filter-control"
          value={propertyType}
          onChange={e => onPropertyTypeChange(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Detached">Detached</option>
          <option value="Condo">Condo</option>
          <option value="Townhouse">Townhouse</option>
        </select>

        <select
          className="filter-control"
          value={bedrooms}
          onChange={e => onBedroomsChange(e.target.value)}
        >
          <option value="all">All Bedrooms</option>
          <option value="1">1+ Beds</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
        </select>

        <input
          className="filter-control"
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => onMinPriceChange(e.target.value)}
        />

        <input
          className="filter-control"
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => onMaxPriceChange(e.target.value)}
        />

        <select
          className="filter-control"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        <button className="reset-filter-button" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
)
}
export default PropertyFilters;
