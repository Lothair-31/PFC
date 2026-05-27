"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string | null;      // ← Primary thumbnail
  images?: string[];          // ← Additional images (for future)
  description?: string | null;
};

const filters = ["All", "T-Shirt", "Sweatshirt", "Hoodie", "New Arrivals"];

export default function CollectionPage() {
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cols, setCols] = useState(3);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && filters.includes(category)) {
      setActiveFilter(category);
    } else {
      setActiveFilter("All");
    }
  }, [searchParams]);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setCols(2);
      else setCols(3);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isMobile = cols === 2;

  /* FILTER */
  const filteredProducts = activeFilter === "All"
    ? products
    : products.filter((p) => p.category === activeFilter);

  /* SORT */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Newest":
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return <div style={{ padding: "200px 20px", textAlign: "center" }}>Loading collection...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* FILTER BAR */}
      <div style={{
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 16px" : "0 32px",
        height: 52,
        position: "fixed",
        top: 53,
        background: "#fff",
        zIndex: 40,
        width: "100%",
        gap: 8,
      }}>
        <div style={{ display: "flex", gap: isMobile ? 8 : 32, overflowX: "auto", scrollbarWidth: "none", flexShrink: 1 }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                background: "none",
                border: activeFilter === filter ? "1px solid #111" : "1px solid transparent",
                padding: "4px 10px",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {isMobile ? "Sort" : `Sort: ${sortBy}`}
            <span style={{ fontSize: 14 }}>+</span>
          </button>

          {sortOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              minWidth: 220,
              zIndex: 50,
            }}>
              {["Featured", "Price: Low to High", "Price: High to Low", "Newest"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setSortOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "11px 16px",
                    background: "none",
                    border: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    color: sortBy === opt ? "#111" : "#666",
                    fontWeight: sortBy === opt ? 600 : 400,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? "0 8px" : "0 24px",
        padding: isMobile ? "120px 12px 60px" : "140px 24px 80px",
      }}>
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{ cursor: "pointer", marginBottom: isMobile ? 28 : 48 }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={{
                width: "100%",
                aspectRatio: "3/4",
                background: "#EFEFEF",
                overflow: "hidden",
                marginBottom: isMobile ? 8 : 14,
              }}>
                <img
                  src={product.image || "/tshirt.png"}   // ← Primary thumbnail
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.7s ease",
                    transform: hoveredId === product.id ? "scale(1.03)" : "scale(1)",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/tshirt.png";
                  }}
                />
              </div>

              <p style={{
                fontSize: isMobile ? "9px" : "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 3,
                color: "#111",
              }}>
                PER FUMUS
              </p>

              <p style={{
                fontSize: isMobile ? "11px" : "12px",
                marginBottom: 4,
                color: "#111",
              }}>
                {product.name}
              </p>

              <p style={{
                fontSize: isMobile ? "11px" : "12px",
                color: "#111",
              }}>
                ₱{(product.price / 100).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}