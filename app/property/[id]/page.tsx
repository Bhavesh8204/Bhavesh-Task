"use client";

import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaCheck,
} from "react-icons/fa";
import Header from "../../../components/Header";
import Loader from "../../../components/Loader";
import { useAppDispatch, useAppSelector } from "../../../lib/store";
import {
  loadFavorites,
  Product,
  toggleFavorite,
} from "../../../lib/store/propertySlice";
import { addToCart, setCartOpen } from "../../../lib/store/cartSlice";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const [property, setProperty] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favorites = useAppSelector((state) => state.properties.favorites);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isFavorite = property ? favorites.includes(property.id) : false;
  const isInCart = property
    ? cartItems.some((item) => item.id === property.id)
    : false;

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }
        const data: Product = await response.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching details");
        toast.error(`Error: ${err.message || "Failed to fetch details"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!property) return;
    dispatch(toggleFavorite(property.id));
    if (!isFavorite) {
      toast.success("Added to your favorite spaces!");
    } else {
      toast.success("Removed from your favorite spaces.");
    }
  };

  const handleAddToCart = () => {
    if (!property) return;
    dispatch(addToCart(property));
    toast.success(`${property.title} added to cart!`);
    dispatch(setCartOpen(true));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="app-container" style={{ paddingTop: "80px" }}>
          <Loader />
        </main>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <main
          className="app-container"
          style={{ padding: "60px 20px", textAlign: "center" }}
        >
          <Toaster position="top-right" />
          <h2 style={{ marginBottom: "16px", color: "var(--heart-active)" }}>
            Could not load property details
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
            {error || "Property details not found."}
          </p>
          <Link href="/" className="back-btn-link">
            <FaArrowLeft /> Back
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--toast-bg, #ffffff)",
            color: "var(--toast-color, #0f172a)",
            border: "1px solid var(--card-border, #e2e8f0)",
            fontFamily: "var(--font-sans)",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />

      <Header />

      <main className="app-container detail-page-wrapper">
        <Link href="/" className="back-btn-link">
          <FaArrowLeft /> Back
        </Link>

        <div className="detail-grid fade-in">
          <div className="detail-gallery-sec">
            <div className="detail-main-img-wrapper">
              <img
                src={property.images[0] || property.thumbnail}
                alt={property.title}
                className="detail-main-img"
              />
            </div>
          </div>

          <div className="detail-info-sec">
            <span className="detail-category-badge">{property.category}</span>

            <div className="detail-title-row">
              <h1 className="detail-title">{property.title}</h1>
              <button
                onClick={handleFavoriteClick}
                className={`detail-fav-btn ${isFavorite ? "active" : ""}`}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <div className="detail-stats-row">
              <div className="detail-stat-item">
                <span className="detail-stat-label">Price</span>
                <span
                  className="detail-stat-value"
                  style={{ color: "var(--accent)" }}
                >
                  {formatPrice(property.price)}
                </span>
              </div>
              <div className="detail-stat-item">
                <span className="detail-stat-label">Rating</span>
                <span className="detail-stat-value">
                  <FaStar className="star-icon" />
                  {property.rating.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="detail-actions-box">
              <button
                onClick={handleAddToCart}
                className={`detail-add-cart-btn ${isInCart ? "in-cart" : ""}`}
              >
                {isInCart ? (
                  <FaCheck style={{ marginRight: "6px" }} />
                ) : (
                  <FaShoppingCart style={{ marginRight: "6px" }} />
                )}
                <span>{isInCart ? "Add Another to Cart" : "Add to Cart"}</span>
              </button>
            </div>

            <div className="detail-desc-box">
              <h3 className="detail-desc-title">Description</h3>
              <p className="detail-desc-text">{property.description}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
