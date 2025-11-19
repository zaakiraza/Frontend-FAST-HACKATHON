import { useState } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearch, filters = [], placeholder = 'Search...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch({ search: value, filters: activeFilters });
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value === 'all' ? undefined : value
    };
    setActiveFilters(newFilters);
    onSearch({ search: searchTerm, filters: newFilters });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    onSearch({ search: '', filters: {} });
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

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
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                onSearch({ search: '', filters: activeFilters });
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {filters.length > 0 && (
          <div className="search-actions">
            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button className="clear-all" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="filters-panel">
          {filters.map((filter) => (
            <div key={filter.key} className="filter-group">
              <label className="filter-label">{filter.label}</label>
              <select
                className="filter-select"
                value={activeFilters[filter.key] || 'all'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              >
                <option value="all">All {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
