"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{
      width: "100%",
      height: isMobile ? "100svh" : "100vh",
      position: "relative",
      overflow: "hidden",
      background: "#DCDCDC",
    }}>
      <img
        src="/hero.png"
        alt="Per Fumus"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: isMobile ? "75% 15%" : "center top",
        }}
      />

      {/* Fallback background if no image yet */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #D0D0D0 0%, #C4C4C4 50%, #D8D8D8 100%)",
        zIndex: -1,
      }} />

      {/* Brand watermark */}
      <div style={{
        position: "absolute",
        bottom: isMobile ? 24 : 32,
        left: isMobile ? "50%" : 32,
        transform: isMobile ? "translateX(-50%)" : "none",
        fontSize: "10px", letterSpacing: "0.25em",
        textTransform: "uppercase", color: "rgba(0,0,0,0.35)",
        fontWeight: 500, zIndex: 2,
        whiteSpace: "nowrap",
      }}>
        Per Fumus Collective
      </div>
    </section>
  );
}