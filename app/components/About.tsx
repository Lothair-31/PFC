"use client";
import { useEffect, useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) setTimeout(() => entry.target.classList.add("visible"), i * 150);
        });
      },
      { threshold: 0.1 }
    );
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ padding: "140px 40px", maxWidth: 1400, margin: "0 auto" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
        {/* Left: large statement */}
        <div className="reveal">
          <span
            style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--warm-gray)", display: "block", marginBottom: "32px" }}
          >
            Philosophy
          </span>
          <h2
            className="font-cormorant"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            "Not just
            <br />
            <em style={{ color: "var(--warm-gray)" }}>fashion.</em>
            <br />
            A spiritual
            <br />
            experience."
          </h2>

          {/* Divider */}
          <div style={{ width: 40, height: 1, background: "var(--stone)", margin: "48px 0" }} />

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {[
              { num: "VII", label: "Seasons" },
              { num: "2013", label: "Founded" },
              { num: "LA", label: "Origin" },
              { num: "∞", label: "Vision" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-cormorant" style={{ fontSize: "2.5rem", fontWeight: 300, color: "var(--dark)", letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--warm-gray)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: text + image panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {/* Dark panel */}
          <div
            className="reveal"
            style={{
              background: "var(--dark)",
              padding: "60px 48px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative cross */}
            <div
              style={{
                position: "absolute", top: 32, right: 32,
                width: 24, height: 24,
                display: "grid", gridTemplateRows: "1fr 8px 1fr", gridTemplateColumns: "1fr 8px 1fr",
                opacity: 0.12,
              }}
            >
              <div style={{ gridColumn: "2", background: "var(--cream)" }} />
              <div style={{ gridRow: "2", gridColumn: "1 / 4", background: "var(--cream)" }} />
              <div style={{ gridColumn: "2", gridRow: "3", background: "var(--cream)" }} />
            </div>

            <span
              style={{ fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--warm-gray)", display: "block", marginBottom: "24px" }}
            >
              The Mission
            </span>
            <p
              className="font-cormorant"
              style={{ fontSize: "1.35rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.7, fontStyle: "italic" }}
            >
              "Fear of God is a reflection of the duality between the sacred and the streetwise — 
              architecture of the spirit expressed through cloth."
            </p>
            <div style={{ marginTop: 32, fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--warm-gray)" }}>
              — Jerry Lorenzo, Creative Director
            </div>
          </div>

          {/* Body copy */}
          <div className="reveal">
            <p style={{ fontSize: "12px", lineHeight: 2.2, color: "var(--muted)", letterSpacing: "0.04em", marginBottom: 20 }}>
              Founded in Los Angeles in 2013, Fear of God represents a singular vision at the 
              intersection of luxury tailoring, American sportswear, and spiritual conviction.
            </p>
            <p style={{ fontSize: "12px", lineHeight: 2.2, color: "var(--muted)", letterSpacing: "0.04em" }}>
              Each piece is constructed with intentionality — materials chosen for their ability 
              to age with the wearer, silhouettes built to transcend seasons.
            </p>
          </div>

          {/* CTA */}
          <div className="reveal">
            <button
              style={{
                background: "var(--dark)",
                color: "var(--cream)",
                padding: "16px 36px",
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                border: "none",
                cursor: "none",
                transition: "opacity 0.3s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
            >
              Our Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
