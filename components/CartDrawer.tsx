"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../lib/store";
import {
  removeFromCart,
  setCartOpen,
  updateQuantity,
} from "../lib/store/cartSlice";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Close drawer on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement;
        if (!target.closest(".cart-toggle-btn")) {
          dispatch(setCartOpen(false));
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, dispatch]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const handleQtyChange = (id: number, currentQty: number, change: number) => {
    dispatch(updateQuantity({ id, quantity: currentQty + change }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
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

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={handleClose}
      />
      <div ref={drawerRef} className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Your Cart</h3>
          <button
            onClick={handleClose}
            className="cart-drawer-close"
            aria-label="Close cart"
          >
            <FaTimes />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty-state">
            <FaShoppingBag className="cart-empty-icon" />
            <h4 className="cart-empty-title">Your cart is empty</h4>
            <p className="cart-empty-desc">
              Explore our collection and add items to your cart to checkout.
            </p>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-header">
                      <div>
                        <h4 className="cart-item-title">{item.title}</h4>
                        <span className="cart-item-category">
                          {item.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="cart-item-remove-btn"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-qty-control">
                        <button
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity, -1)
                          }
                          className="cart-item-qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>
                        <span className="cart-item-qty-val">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity, 1)
                          }
                          className="cart-item-qty-btn"
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <span className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Subtotal</span>
                <span className="cart-summary-value">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={handleClose}
                className="cart-checkout-btn"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
