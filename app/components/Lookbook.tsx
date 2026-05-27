"use client";
import { useEffect, useRef } from "react";

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 120);
          }
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
      id="lookbook"
      style={{ background: "var(--dark)", padding: "100px 0", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "80px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span
              style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--warm-gray)", display: "block", marginBottom: "12px" }}
            >
              Editorial
            </span>
            <h2
              className="font-cormorant"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300, color: "var(--cream)", letterSpacing: "-0.01em", lineHeight: 1 }}
            >
              The Lookbook
            </h2>
          </div>
          <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--warm-gray)" }}>
            SS25
          </span>
        </div>

        {/* Large editorial panel */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 2 }}>
          {/* Large left */}
          <div
            style={{
              aspectRatio: "4/5",
              background: "linear-gradient(135deg, #3A3530, #252220)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 40 }}>
              <div
                style={{
                  position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
                  width: "60%", textAlign: "center",
                }}
              >
                <span className="font-cormorant" style={{ fontSize: "5rem", color: "rgba(244,240,234,0.08)", fontWeight: 300 }}>I</span>
              </div>
              <div style={{ position: "absolute", top: 0, right: 0, width: "70%", height: "70%", background: "radial-gradient(circle at top right, rgba(160,149,106,0.08), transparent 60%)" }} />
              <span style={{ color: "var(--cream)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>Look 01</span>
              <h3 className="font-cormorant" style={{ color: "var(--cream)", fontSize: "1.8rem", fontWeight: 300, marginTop: 8 }}>The Pilgrim</h3>
            </div>
          </div>

          {/* Right column split */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                flex: 1, background: "linear-gradient(145deg, #4A4540, #2E2B27)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                <span style={{ color: "var(--cream)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>Look 02</span>
                <p className="font-cormorant" style={{ color: "var(--cream)", fontSize: "1.3rem", fontWeight: 300, marginTop: 4 }}>The Recluse</p>
              </div>
              <div style={{ position: "absolute", top: "40%", left: "40%", width: 80, height: 80, border: "1px solid rgba(244,240,234,0.06)", borderRadius: "50%" }} />
            </div>
            <div
              style={{
                flex: 1, background: "linear-gradient(145deg, #1C1916, #3A3530)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                <span style={{ color: "var(--cream)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>Look 03</span>
                <p className="font-cormorant" style={{ color: "var(--cream)", fontSize: "1.3rem", fontWeight: 300, marginTop: 4 }}>The Faithful</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
          {["The Shepherd", "The Seeker", "The Prophet"].map((title, i) => (
            <div
              key={title}
              style={{
                aspectRatio: "3/4",
                background: `linear-gradient(${130 + i * 20}deg, #${["252220", "3A3530", "2E2B27"][i]}, #${["3A3530", "1C1916", "4A4540"][i]})`,
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <span style={{ color: "var(--cream)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4 }}>Look 0{4 + i}</span>
                <p className="font-cormorant" style={{ color: "var(--cream)", fontSize: "1.1rem", fontWeight: 300, marginTop: 4, opacity: 0.8 }}>{title}</p>
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, border: "1px solid rgba(244,240,234,0.05)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
