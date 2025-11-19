import { useState } from 'react';
import './AdvancedSearch.css';

<<<<<<< HEAD
const AdvancedSearch = ({ onSearch, filters = [], placeholder = 'Search...' }) => {
=======
const AdvancedSearch = ({ onSearch, filters = [], placeholder = "Search..." }) => {
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

<<<<<<< HEAD
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
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7

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
<<<<<<< HEAD
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                onSearch({ search: '', filters: activeFilters });
              }}
=======
            onChange={(e) => handleSearch(e.target.value, activeFilters)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn" 
              onClick={() => handleSearch('', activeFilters)}
              aria-label="Clear search"
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {filters.length > 0 && (
<<<<<<< HEAD
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
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="filters-panel">
<<<<<<< HEAD
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
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
