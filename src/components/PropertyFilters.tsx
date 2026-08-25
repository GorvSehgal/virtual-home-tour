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
    <div>
        <h2>Filters</h2>
        <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
        />
        <select value={city} onChange={e => onCityChange(e.target.value)}>
        <option value="all">All Cities</option>
        <option value="Vancouver">Vancouver</option>
        <option value="Toronto">Toronto</option>
        <option value="Calgary">Calgary</option>
        </select>
        <select value={propertyType} onChange={e => onPropertyTypeChange(e.target.value)}>
        <option value="all">All Types</option>
        <option value="Detached">Detached</option>
        <option value="Condo">Condo</option>
        <option value="Townhouse">Townhouse</option>

        </select>
        <select value={bedrooms} onChange={e => onBedroomsChange(e.target.value)}>
            <option value="all">All Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
        </select>

        <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => onMinPriceChange(e.target.value)}
        />
        <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => onMaxPriceChange(e.target.value)}
        />
        <select value={sortBy} onChange={e => onSortChange(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
        </select>
          <button onClick={onReset}>Reset Filters</button>
    </div>
)
}
export default PropertyFilters;
