"use client";

import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { Product, toggleFavorite } from "../lib/store/propertySlice";
import { addToCart, setCartOpen } from "../lib/store/cartSlice";

interface PropertyCardProps {
  property: Product;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.properties.favorites);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isFavorite = favorites.includes(property.id);
  const isInCart = cartItems.some((item) => item.id === property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(property.id));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(property));
    toast.success(`${property.title} added to cart!`);
    dispatch(setCartOpen(true));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="property-card fade-in">
      <div className="card-image-wrapper">
        <span className="card-badge">{property.category}</span>

        <button
          onClick={handleFavoriteClick}
          className={`card-favorite-btn ${isFavorite ? "active" : ""}`}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        <img
          src={property.thumbnail || property.images[0]}
          alt={property.title}
          className="property-card-img"
          loading="lazy"
        />
      </div>

      <div className="card-info">
        <h3 className="card-title">{property.title}</h3>

        <div className="card-meta-row">
          <div className="card-price-box">
            <span className="card-price-label">Price</span>
            <span className="card-price-value">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        <div className="card-actions-row">
          <Link href={`/property/${property.id}`} className="card-detail-link">
            View Property
          </Link>
          <button
            onClick={handleAddToCart}
            className={`card-add-cart-btn ${isInCart ? "in-cart" : ""}`}
            title={isInCart ? "In Cart" : "Add to Cart"}
            aria-label="Add to cart"
          >
            {isInCart ? <FaCheck /> : <FaShoppingCart />}
          </button>
        </div>
      </div>
    </div>
  );
}
