"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import Header from "../../components/Header";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { clearCart, loadCart } from "../../lib/store/cartSlice";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItemsCount, setOrderItemsCount] = useState(0);

  // Load cart on mount
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const {
      email,
      phone,
      name,
      address,
      city,
      state,
      zip,
      cardNumber,
      expiry,
      cvv,
    } = formData;
    if (
      !email ||
      !phone ||
      !name ||
      !address ||
      !city ||
      !state ||
      !zip ||
      !cardNumber ||
      !expiry ||
      !cvv
    ) {
      toast.error("Please fill in all checkout fields.");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (cardNumber.replace(/\s/g, "").length < 15) {
      toast.error("Please enter a valid card number.");
      return false;
    }
    if (cvv.length < 3) {
      toast.error("Please enter a valid CVV.");
      return false;
    }
    return true;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.08; // 8% mock tax
    const total = subtotal + tax;

    setOrderTotal(total);
    setOrderItemsCount(items.reduce((acc, item) => acc + item.quantity, 0));
    setOrderNumber(`JB-${Math.floor(100000 + Math.random() * 900000)}`);

    // Clear Redux state & localStorage
    dispatch(clearCart());
    setIsSubmitted(true);
    toast.success("Booking placed successfully!");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (isSubmitted) {
    return (
      <>
        <Toaster position="top-right" />
        <Header />
        <main
          className="app-container"
          style={{ flexGrow: 1, paddingBottom: "60px" }}
        >
          <div className="success-card fade-in">
            <div className="success-icon-wrapper">
              <FaCheckCircle />
            </div>
            <h1 className="success-title">Booking Confirmed!</h1>
            <p className="success-desc">
              Thank you for choosing Prop. Your booking has been secured
              successfully. A confirmation email has been sent to{" "}
              <strong>{formData.email}</strong>.
            </p>

            <div className="order-details-box">
              <div className="order-details-row">
                <span className="order-details-label">Booking Reference</span>
                <span className="order-details-value">{orderNumber}</span>
              </div>
              <div className="order-details-row">
                <span className="order-details-label">Guest Name</span>
                <span className="order-details-value">{formData.name}</span>
              </div>
              <div className="order-details-row">
                <span className="order-details-label">Billing Address</span>
                <span className="order-details-value">
                  {formData.address}, {formData.city}
                </span>
              </div>
              <div className="order-details-row">
                <span className="order-details-label">Total Paid</span>
                <span className="order-details-value">
                  {formatPrice(orderTotal)}
                </span>
              </div>
              <div className="order-details-row">
                <span className="order-details-label">Total Spaces</span>
                <span className="order-details-value">{orderItemsCount}</span>
              </div>
            </div>

            <Link href="/" className="success-action-btn">
              Continue Exploring
            </Link>
          </div>
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
      <main className="app-container checkout-container">
        <Link href="/" className="checkout-back-link">
          <FaArrowLeft /> Back to home
        </Link>

        {items.length === 0 ? (
          <div
            className="success-card fade-in"
            style={{ padding: "40px 20px" }}
          >
            <h2 style={{ marginBottom: "16px" }}>Your Cart is Empty</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              Please add spaces to your cart from our listings before attempting
              to checkout.
            </p>
            <Link href="/" className="success-action-btn">
              Explore Spaces
            </Link>
          </div>
        ) : (
          <div className="checkout-grid fade-in">
            {/* Form Column */}
            <form onSubmit={handleCheckoutSubmit} className="checkout-card">
              <div className="checkout-section">
                <h3 className="checkout-section-title">
                  <FaUser
                    className="star-icon"
                    style={{ color: "var(--accent)" }}
                  />
                  Contact Information
                </h3>
                <div className="form-row">
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-section">
                <h3 className="checkout-section-title">
                  <FaMapMarkerAlt
                    className="star-icon"
                    style={{ color: "var(--accent)" }}
                  />
                  Booking & Billing Address
                </h3>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="123 Ocean Drive"
                    required
                  />
                </div>
                <div className="form-row" style={{ marginTop: "16px" }}>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Miami"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">State / Region</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="FL"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">ZIP / Postal Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="33139"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="checkout-section">
                <h3 className="checkout-section-title">
                  <FaCreditCard
                    className="star-icon"
                    style={{ color: "var(--accent)" }}
                  />
                  Payment Details (Mock)
                </h3>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="form-row" style={{ marginTop: "16px" }}>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="checkout-btn">
                Complete Booking ({formatPrice(total)})
              </button>
            </form>

            {/* Summary Column */}
            <div
              className="checkout-card"
              style={{ background: "var(--badge-bg)", borderStyle: "dashed" }}
            >
              <h3
                className="checkout-section-title"
                style={{ fontSize: "16px", marginBottom: "16px" }}
              >
                Order Summary
              </h3>
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="summary-item-img"
                    />
                    <div className="summary-item-info">
                      <h4 className="summary-item-title">{item.title}</h4>
                      <span className="summary-item-meta">
                        {item.category} × {item.quantity}
                      </span>
                    </div>
                    <span className="summary-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="summary-divider" />

              <div className="summary-calc-row">
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="summary-calc-row">
                <span>Estimated Tax (8%)</span>
                <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                  {formatPrice(tax)}
                </span>
              </div>
              <div className="summary-calc-row">
                <span>Service Fee</span>
                <span style={{ fontWeight: 600, color: "var(--accent-green)" }}>
                  Free
                </span>
              </div>

              <div className="summary-total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
