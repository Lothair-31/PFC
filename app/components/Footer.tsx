"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const menuLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/collection" },
    { label: "Account", href: "/account" },
    { label: "Contacts", href: "/contact" },
    { label: "About", href: "/#about" },
  ];

  const categoryLinks = [
    { label: "T-Shirts", href: "/collection?category=T-Shirt" },
    { label: "Sweatshirts", href: "/collection?category=Sweatshirt" },
    { label: "Hoodies", href: "/collection?category=Hoodie" },
    { label: "New Arrivals", href: "/collection?category=New Arrivals" },
  ];

  const helpLinks = [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns & Exchange", href: "/returns" },
    { label: "Product Care", href: "/care" },
  ];

  return (
    <>
      {/* Newsletter */}
      <section
        style={{
          background: "#1E1C1A",
          padding: isMobile ? "64px 24px" : "100px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/brand-bg.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.12,
            zIndex: 0,
          }}
        />

        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--gold)",
            fontWeight: 500,
            marginBottom: 20,
            zIndex: 1,
            position: "relative",
          }}
        >
          Stay Connected
        </span>

        <h2
          className="font-cormorant"
          style={{
            fontSize: isMobile ? "2rem" : "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 400,
            color: "rgb(208,208,208)",
            letterSpacing: "0.02em",
            marginBottom: 10,
            lineHeight: 1.2,
            zIndex: 1,
            position: "relative",
          }}
        >
          Monthly Newsletter
        </h2>

        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.03em",
            lineHeight: 1.8,
            maxWidth: 300,
            marginBottom: 30,
            zIndex: 1,
            position: "relative",
          }}
        >
          Sign up to receive updates from our shop, including new
          selections and upcoming events.
        </p>

        {subscribed ? (
          <p
            style={{
              color: "var(--gold)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Thank you for subscribing.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              maxWidth: 400,
              zIndex: 1,
              position: "relative",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSubscribe()
              }
              placeholder="Your email address"
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRight: "none",
                padding: "14px 20px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "11px",
                letterSpacing: "0.05em",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            <button
              onClick={handleSubscribe}
              style={{
                background: "var(--gold)",
                border: "none",
                padding: "14px 28px",
                color: "#111",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "0.85")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              Subscribe
            </button>
          </div>
        )}
      </section>

      {/* Main Footer */}
      <footer
        style={{
          background: "#111111",
          padding: isMobile ? "48px 28px 0" : "64px 48px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "1.8fr 1fr 1fr 1fr",
            gap: isMobile ? 36 : 48,
            paddingBottom: 60,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <img
                src="/logo.png"
                alt="Per Fumus"
                style={{
                  height: 60,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1.9,
                letterSpacing: "0.02em",
                maxWidth: 220,
                marginBottom: 24,
              }}
            >
              A collective of elevated fashion where smoke meets
              style. Curated pieces for those who drift in luxury.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                {
                  label: "IG",
                  href: "https://instagram.com",
                },
                {
                  label: "FB",
                  href: "https://facebook.com",
                },
                {
                  label: "TW",
                  href: "https://twitter.com",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    border:
                      "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    transition:
                      "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--gold)";
                    e.currentTarget.style.color =
                      "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color =
                      "rgba(255,255,255,0.4)";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div
            style={{
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <p
              style={{
                fontSize: "8px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Menu
            </p>

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 20,
              }}
            />

            {menuLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  marginBottom: 14,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    "var(--gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(255,255,255,0.4)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div
            style={{
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <p
              style={{
                fontSize: "8px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Categories
            </p>

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 20,
              }}
            />

            {categoryLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  marginBottom: 14,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    "var(--gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(255,255,255,0.4)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Help */}
          <div
            style={{
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <p
              style={{
                fontSize: "8px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Help
            </p>

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 20,
              }}
            />

            {helpLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  marginBottom: 14,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color =
                    "var(--gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgba(255,255,255,0.4)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 0",
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: isMobile ? 8 : 0,
            textAlign: isMobile ? "center" : undefined,
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.05em",
            }}
          >
            © 2026{" "}
            <span
              style={{
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Per Fumus Collective
            </span>
            . All rights reserved.
          </p>

          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Language / City ®
          </p>
        </div>
      </footer>
    </>
  );
}