"use client";

import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setShowFavoritesOnly } from "../lib/store/propertySlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const showFavoritesOnly = useAppSelector(
    (state) => state.properties.showFavoritesOnly,
  );
  const favorites = useAppSelector((state) => state.properties.favorites);

  const handleToggleFavorites = () => {
    dispatch(setShowFavoritesOnly(!showFavoritesOnly));
  };

  return (
    <header className="header-wrapper">
      <div className="app-container header-container">
        <Link href="/" className="logo-section">
          <span className="logo-text">JB Properties</span>
        </Link>

        <div className="nav-actions">
          <button
            onClick={handleToggleFavorites}
            className={`favorites-toggle-btn ${showFavoritesOnly ? "active" : ""}`}
          >
            <FaHeart />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="favorites-badge">{favorites.length}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
