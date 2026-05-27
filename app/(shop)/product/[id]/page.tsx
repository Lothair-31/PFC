"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/components/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string | null;
  images?: string[] | string;
  description?: string | null;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [quantity, setQuantity] = useState<number | string>(1);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { addToCart } = useCart();

  // Fetch current product
  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Fetch recommended
  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const allProducts = data.products || [];
        const others = allProducts.filter((p: Product) => p.id !== id);
        setRecommended(others.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    }
    fetchRecommended();
  }, [id]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSlide(i); },
        { threshold: 0.6 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [isMobile, product]);

  const formatPrice = (price: number) => `₱${(price / 100).toLocaleString()}`;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, Number(quantity) || 1);

    const btn = document.activeElement as HTMLButtonElement;
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  };

  if (loading) return <div style={{ padding: 100, textAlign: "center" }}>Loading product...</div>;
  if (!product) return <div style={{ padding: 80, textAlign: "center" }}>Product not found</div>;

  // === MAIN FIX: Get first image from images array ===
  const imagesArray = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string"
      ? JSON.parse(product.images)
      : [];

  const mainImage = imagesArray[0] || product.image || "/tshirt.png";

  const images = imagesArray.length > 0
    ? imagesArray
    : product.image ? [product.image] : ["/tshirt.png"];

  const safeSrc = (src?: string) => src || "/tshirt.png";

  /* ==================== MOBILE VERSION ==================== */
  if (isMobile) {
    return (
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* Image Carousel */}
        <div style={{ position: "relative", paddingTop: "60px" }}>
          <div style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {images.map((img, i) => (
              <div
                key={i}
                ref={el => { slideRefs.current[i] = el; }}
                style={{
                  flex: "0 0 100%",
                  scrollSnapAlign: "start",
                  aspectRatio: "3/4",
                  background: "#eee",
                  overflow: "hidden",
                }}
              >
                <img
                  src={safeSrc(img)}
                  alt={`${product.name} ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/tshirt.png"; }}
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, position: "absolute", bottom: 12, left: 0, right: 0 }}>
              {images.map((_, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: activeSlide === i ? "#111" : "rgba(0,0,0,0.25)" }} />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div style={{ padding: "28px 24px 40px", textAlign: "center" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 500, color: "#111" }}>{product.name}</h1>
          <p style={{ fontSize: "16px", color: "#333" }}>{formatPrice(product.price)}</p>
          <p style={{ fontSize: "13px", color: "#666", margin: "16px 0", lineHeight: 1.7 }}>
            {product.description}
          </p>

          <hr style={{ border: "none", borderTop: "1px solid #ddd", width: "100%", margin: "4px 0" }} />

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#444" }}>
              <span>Dimensions</span><span>15 in x 12 in x 16 in</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#444" }}>
              <span>Weight</span><span>19 kg</span>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #ddd", width: "100%", margin: "4px 0" }} />

          <div style={{ width: "100%" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, color: "#111" }}>
              Quantity
            </p>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              style={{
                width: 90,
                height: 56,
                border: "1px solid #cfcfcf",
                background: "#fff",
                fontSize: "16px",
                padding: "0 14px",
                outline: "none",
              }}
            />
            <button
              onClick={handleAddToCart}
              disabled={!quantity || Number(quantity) <= 0}
              style={{
                width: "100%",
                background: !quantity || Number(quantity) <= 0 ? "#999" : "#111",
                color: "#fff",
                border: "none",
                padding: "16px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: !quantity || Number(quantity) <= 0 ? "not-allowed" : "pointer",
                opacity: !quantity || Number(quantity) <= 0 ? 0.6 : 1,
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Recommended Section */}
        <div style={{ padding: "0 12px 60px", borderTop: "1px solid #eee" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#111", margin: "24px 0 16px", textAlign: "center" }}>
            You May Also Like
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0 8px" }}>
            {recommended.map(p => (
              <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ aspectRatio: "3/4", background: "#f0f0f0", marginBottom: 8, overflow: "hidden" }}>
                    <img src={p.image || "/tshirt.png"} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontSize: "12px", color: "#111", marginBottom: 3 }}>{p.name}</p>
                  <p style={{ fontSize: "12px", color: "#555" }}>{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ==================== DESKTOP VERSION ==================== */
  return (
    <div style={{ background: "#f6f6f6", minHeight: "100vh", padding: "130px 40px 100px" }}>
      <div style={{ maxWidth: 1220, margin: "0 auto", display: "grid", gridTemplateColumns: "60% 40%", gap: 20, alignItems: "start" }}>
        {/* Images - Main image now uses first from images array */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 4, height: 640 }}>
          <div style={{ background: "#ececec", overflow: "hidden" }}>
            <img
              src={safeSrc(mainImage)}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {images.slice(1, 3).map((img, i) => (
              <div key={i} style={{ flex: 1, background: "#ececec", overflow: "hidden" }}>
                <img
                  src={safeSrc(img)}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ paddingTop: 8, maxWidth: 460 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 400, color: "#111", lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.02em" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: "16px", color: "#444", marginBottom: 28 }}>{formatPrice(product.price)}</p>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#777", marginBottom: 28 }}>
            {product.description}
          </p>

          <div style={{ borderTop: "1px solid #cfcfcf", marginBottom: 28 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 34 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" }}>
              <span>Dimensions</span><span>15 in x 12 in x 16 in</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555" }}>
              <span>Weight</span><span>19 kg</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e1e1e1", marginBottom: 30 }} />

          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18, color: "#111" }}>
            Quantity
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              style={{
                width: 90,
                height: 56,
                border: "1px solid #cfcfcf",
                background: "#fff",
                fontSize: "16px",
                padding: "0 14px",
                outline: "none",
              }}
            />
            <button
              onClick={handleAddToCart}
              disabled={!quantity || Number(quantity) <= 0}
              style={{
                flex: 1,
                height: 56,
                background: !quantity || Number(quantity) <= 0 ? "#999" : "#111",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: !quantity || Number(quantity) <= 0 ? "not-allowed" : "pointer",
                opacity: !quantity || Number(quantity) <= 0 ? 0.6 : 1,
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div style={{ maxWidth: 1920, margin: "150px 0 0", borderTop: "1px solid #e2e2e2", paddingTop: 40 }}>
        <p style={{ fontSize: "18px", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "#111", marginBottom: 30 }}>
          You May Also Like
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {recommended.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div>
                <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#ececec", marginBottom: 12 }}>
                  <img src={p.image || "/tshirt.png"} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ fontSize: "14px", color: "#111", marginBottom: 4 }}>{p.name}</p>
                <p style={{ fontSize: "14px", color: "#555" }}>{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const safeSrc = (src?: string) => src || "/tshirt.png";