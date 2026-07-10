"use client";

import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../lib/store";
import {
  setPriceRange,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
} from "../lib/store/propertySlice";

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory, priceRange, sortBy, items } =
    useAppSelector((state) => state.properties);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const categories = React.useMemo(() => {
    const list = items.map((item) => item.category);
    return ["all", ...Array.from(new Set(list))];
  }, [items]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value as any));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : Math.max(0, Number(e.target.value));
    dispatch(setPriceRange({ ...priceRange, min: val }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val =
      e.target.value === "" ? 99999 : Math.max(0, Number(e.target.value));
    dispatch(setPriceRange({ ...priceRange, max: val }));
  };

  return (
    <div className="filter-bar-wrapper fade-in">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">Search Property</label>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Price Range ($)</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min || ""}
              onChange={handleMinPriceChange}
              className="price-input"
              min="0"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max === 99999 ? "" : priceRange.max}
              onChange={handleMaxPriceChange}
              className="price-input"
              min="0"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
