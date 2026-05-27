"use client";

import { useCart } from "./CartContext";
import Link from "next/link";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, increaseQty, decreaseQty, cartTotal } = useCart();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
          zIndex: 998,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(760px, 100%)",
          height: "100vh",
          background: "#F5F5F3",
          zIndex: 999,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "22px 32px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#111",
              fontWeight: 600,
            }}
          >
            SHOPPING CART ({cart.length})
          </p>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#111",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, padding: "20px 32px", overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <p style={{ fontSize: "16px", color: "#666" }}>Your cart is empty</p>
              <Link href="/collection" onClick={onClose}>
                <button
                  style={{
                    marginTop: 20,
                    padding: "12px 24px",
                    background: "#111",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr auto",
                  gap: 20,
                  marginBottom: 32,
                  alignItems: "start",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    aspectRatio: "3/4",
                    background: "#ECECEA",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.image || "/tshirt.png"}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Info */}
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: "13px", color: "#666", marginBottom: 12 }}>
                    ₱{(item.price / 100).toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => decreaseQty(item.id)}
                      style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer" }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: "15px", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price + Remove */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "16px", fontWeight: 500 }}>
                    ₱{(item.price * item.quantity / 100).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      marginTop: 12,
                      background: "none",
                      border: "none",
                      color: "#999",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #111",
              padding: "28px 32px 40px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                SUBTOTAL
              </span>
              <span style={{ fontSize: "18px", fontWeight: 500 }}>
                ₱{(cartTotal / 100).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                height: 56,
                background: "#000",
                color: "#fff",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}