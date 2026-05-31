"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#fff",
      textAlign: "center",
      padding: "40px 24px"
    }}>
      <h1 style={{ fontSize: "28px", fontWeight: 500, color: "#111", marginBottom: 12 }}>
        Thank you for your order!
      </h1>
      <p style={{ fontSize: "15px", color: "#666", marginBottom: 40 }}>
        Your payment was successful. We'll send you a confirmation soon.
      </p>
      <Link 
        href="/collection"
        style={{
          background: "#111",
          color: "#fff",
          padding: "14px 32px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textDecoration: "none",
          fontSize: "13px"
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}