"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const items = [
  { id: 1, label: "T-Shirt",    src: "/tshirt.png",     fallback: "linear-gradient(145deg, #C8C0B0, #B0A898)", href: "/collection?category=T-Shirt" },
  { id: 2, label: "Sweatshirt", src: "/sweatshirt.png", fallback: "linear-gradient(145deg, #7CC4A0, #5EA882)", href: "/collection?category=Sweatshirt" },
  { id: 3, label: "Hoodie",     src: "/hoodie.png",     fallback: "linear-gradient(145deg, #2A2A2A, #111111)", href: "/collection?category=Hoodie" },
];

function CollectionCard({ item, index, isMobile }: { item: typeof items[0]; index: number; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add("visible"), index * 120);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="reveal collection-card"
      style={{
        position: "relative", overflow: "hidden", cursor: "pointer",
        flex: isMobile ? "none" : 1,
        width: isMobile ? "100%" : undefined,
      }}
    >
      <Link href={item.href} scroll={false} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          width: "100%",
          paddingBottom: isMobile ? "145%" : "130%",
          position: "relative",
          background: item.fallback,
        }}>
          <img
            src={item.src}
            alt={item.label}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
            }}
          />
          <div
            className="overlay"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
              zIndex: 1,
            }}
          />
          <div style={{
            position: "absolute", bottom: 50, right: 0, left: 0,
            textAlign: "center", color: "#fff", fontWeight: 500,
            fontSize: isMobile ? "18px" : "20px",
            letterSpacing: "0.18em", textTransform: "uppercase", zIndex: 2,
          }}>
            {item.label}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Collections() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add("visible"); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="collection" style={{ padding: "40px 30px 0px", background: "#fff" }}>
      <div ref={titleRef} className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{
          fontSize: "13px", fontWeight: 500,
          letterSpacing: "0.3em", textTransform: "uppercase", color: "#111",
        }}>
          2026 Collections
        </h2>
      </div>

      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 12 : 20,
      }}>
        {items.map((item, i) => (
          <CollectionCard key={item.id} item={item} index={i} isMobile={isMobile} />
        ))}
      </div>

      {/* Tagline */}
      <div style={{
        padding: isMobile ? "48px 16px" : "70px 5px",
        textAlign: "center", background: "#fff",
      }}>
        <h2 className="Montserrat" style={{
          fontSize: isMobile ? "1.5rem" : "2rem",
          fontWeight: 300, color: "#1a1a1a",
          letterSpacing: "0.05em", lineHeight: 1.4, marginBottom: 0,
        }}>
          Where Elegance Meets<br />the Art of Style
        </h2>
        <p style={{ fontSize: "16px", color: "var(--gold)", letterSpacing: "0.08em" }}>
          Drift in Luxury
        </p>
      </div>
    </section>
  );
}