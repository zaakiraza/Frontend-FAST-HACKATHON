import { useState } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearch, filters = [], placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (term, filtersData) => {
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term, filtersData);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    if (!value) {
      delete newFilters[filterKey];
    }
    setActiveFilters(newFilters);
    handleSearch(searchTerm, newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    handleSearch('', {});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="advanced-search">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value, activeFilters)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn" 
              onClick={() => handleSearch('', activeFilters)}
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {filters.length > 0 && (
          <button 
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fas fa-filter"></i>
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
          </button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="filters-panel">
          <div className="filters-header">
            <h4>Filter Options</h4>
            {activeFilterCount > 0 && (
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="filters-grid">
            {filters.map((filter) => (
              <div key={filter.key} className="filter-item">
                <label>{filter.label}</label>
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <div className="active-filters">
              <span className="active-filters-label">Active Filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => {
                const filter = filters.find(f => f.key === key);
                const option = filter?.options.find(o => o.value === value);
                return (
                  <span key={key} className="filter-badge">
                    {filter?.label}: {option?.label}
                    <button onClick={() => handleFilterChange(key, '')}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
