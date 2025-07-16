// ✅ FilterSortControls.jsx - Fully Enhanced Dropdown UI
import React from 'react';

const FilterSortControls = ({ onSortChange, onFilterChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-gradient-to-br from-white to-green-50 p-5 rounded-2xl shadow-lg border border-green-100">
      <div className="relative w-full md:w-64">
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative w-full md:w-64">
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Filter</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FilterSortControls;
