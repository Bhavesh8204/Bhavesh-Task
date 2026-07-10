"use client";

import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaInbox, FaRedo } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../lib/store";
import {
  fetchProperties,
  incrementVisibleCount,
  loadFavorites,
} from "../lib/store/propertySlice";
import Loader from "./Loader";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid() {
  const dispatch = useAppDispatch();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    items,
    status,
    error,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    favorites,
    showFavoritesOnly,
    visibleCount,
  } = useAppSelector((state) => state.properties);

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProperties());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(`Error: ${error}`, {
        id: "property-fetch-error",
        duration: 4000,
      });
    }
  }, [status, error]);

  const filteredAndSortedProperties = React.useMemo(() => {
    let result = [...items];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    result = result.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max,
    );

    if (showFavoritesOnly) {
      result = result.filter((item) => favorites.includes(item.id));
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    items,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    favorites,
    showFavoritesOnly,
  ]);

  useEffect(() => {
    if (status !== "succeeded") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          visibleCount < filteredAndSortedProperties.length
        ) {
          dispatch(incrementVisibleCount());
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [status, visibleCount, filteredAndSortedProperties.length, dispatch]);

  const handleRetry = () => {
    dispatch(fetchProperties());
  };

  if (status === "loading" && items.length === 0) {
    return <Loader />;
  }

  if (status === "failed" && items.length === 0) {
    return (
      <div className="empty-state-wrapper fade-in">
        <FaInbox className="empty-state-icon" style={{ color: "#ef4444" }} />
        <h4 className="empty-state-title">Failed to load properties</h4>
        <p className="empty-state-desc">
          There was an issue connecting to the property server. Please check
          your connection and try again.
        </p>
        <button onClick={handleRetry} className="empty-state-btn">
          <FaRedo style={{ marginRight: "8px", verticalAlign: "middle" }} />{" "}
          Retry Load
        </button>
      </div>
    );
  }

  if (filteredAndSortedProperties.length === 0) {
    return (
      <div className="empty-state-wrapper fade-in">
        <FaInbox className="empty-state-icon" />
        <h4 className="empty-state-title">Not found</h4>
        <p className="empty-state-desc">
          We couldn't find any properties matching your current search criteria.
        </p>
      </div>
    );
  }

  const visibleProperties = filteredAndSortedProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedProperties.length;

  return (
    <div className="fade-in">
      <div className="dashboard-title-section">
        <h2 className="dashboard-title">
          {showFavoritesOnly ? "Your Favorite Spaces" : "Explore Spaces"}
        </h2>
        <span className="dashboard-count">
          Showing {visibleProperties.length} of{" "}
          {filteredAndSortedProperties.length} spaces
        </span>
      </div>

      <div className="property-grid-container">
        {visibleProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}

        {hasMore && (
          <div ref={observerRef} className="infinite-scroll-trigger">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
