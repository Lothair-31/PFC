export default function Marquee() {
  const items = [
    "Season VII",
    "Faith Over Fear",
    "Los Angeles",
    "Constructed in California",
    "MMXXV",
    "Jerry Lorenzo",
    "Season VII",
    "Faith Over Fear",
    "Los Angeles",
    "Constructed in California",
    "MMXXV",
    "Jerry Lorenzo",
  ];

  return (
    <div
      style={{
        borderTop: "1px solid rgba(28,25,22,0.12)",
        borderBottom: "1px solid rgba(28,25,22,0.12)",
        padding: "14px 0",
        overflow: "hidden",
        background: "var(--dark)",
      }}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} style={{ color: "var(--stone)", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", marginRight: "4rem" }}>
            {item}
            <span style={{ margin: "0 2rem", opacity: 0.3 }}>—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
