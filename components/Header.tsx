"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setShowFavoritesOnly } from "../lib/store/propertySlice";
import { loadCart, setCartOpen } from "../lib/store/cartSlice";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const dispatch = useAppDispatch();
  const showFavoritesOnly = useAppSelector(
    (state) => state.properties.showFavoritesOnly,
  );
  const favorites = useAppSelector((state) => state.properties.favorites);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleToggleFavorites = () => {
    dispatch(setShowFavoritesOnly(!showFavoritesOnly));
  };

  const handleToggleCart = () => {
    dispatch(setCartOpen(true));
  };

  return (
    <>
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

            <button
              onClick={handleToggleCart}
              className={`cart-toggle-btn ${cartItemCount > 0 ? "has-items" : ""}`}
              aria-label="Open cart"
            >
              <FaShoppingCart />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
