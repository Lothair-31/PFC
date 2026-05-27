"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useCart } from "@/app/components/CartContext";
import CartDrawer from "./CartDrawer";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

const COLLECTION_LINKS = [
  { label: "T-Shirt", href: "/collection?category=T-Shirt" },
  { label: "Sweatshirt", href: "/collection?category=Sweatshirt" },
  { label: "Hoodie", href: "/collection?category=Hoodie" },
  { label: "New Arrivals", href: "/collection?category=New Arrivals" },
];

export default function Nav() {
  const pathname = usePathname();
  const isCollectionPage = pathname === "/collection";
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Training 90s Crewneck Sweatshirt",
      price: 10200,
      image: "/hoodie.png",
      size: "Faded Dune / L",
      quantity: 1,
    },
  ]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [cartOpen, mobileMenuOpen]);

  const removeItem = (id: number) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const increaseQty = (id: number) =>
    setCartItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );

  const decreaseQty = (id: number) =>
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
      )
    );

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCollectionOpen(false);
  };

  const HamburgerIcon = () => (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
      <line x1="0" y1="1" x2="22" y2="1" stroke="#111" strokeWidth="1.5" />
      <line x1="0" y1="7" x2="22" y2="7" stroke="#111" strokeWidth="1.5" />
      <line x1="0" y1="13" x2="22" y2="13" stroke="#111" strokeWidth="1.5" />
    </svg>
  );

  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="#111" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="17" y2="17" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const BagIcon = () => (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <rect x="1" y="6" width="16" height="13" rx="0.5" stroke="#111" strokeWidth="1.5" />
      <path d="M5.5 6V5C5.5 2.79 7.07 1 9 1C10.93 1 12.5 2.79 12.5 5V6" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  // NAV_H = rendered nav height
  const NAV_H = 57;
  // Search panel height (label + input + padding)
  const SEARCH_H = 60;

  return (
    <>
      <style>{`
        /* ── Responsive toggles ── */
        .nav-links-desktop { display: flex; gap: 28px; align-items: center; }
        .nav-hamburger     { display: none; }
        .nav-search-text   { display: block; }
        .nav-search-icon   { display: none; }
        .nav-bag-text      { display: block; }
        .nav-bag-icon      { display: none; }
        .nav-account-text  {display:  block;}

        .nav-link-hover { transition: color 0.2s ease; }
        .nav-link-hover:hover { color: #C9A84C !important; }

        @media (max-width: 768px) {
          .nav-links-desktop { display: none; }
          .nav-hamburger     { display: flex; align-items: center; }
          .nav-search-text   { display: none; }
          .nav-search-icon   { display: flex; align-items: center; }
          .nav-bag-text      { display: none; }
          .nav-bag-icon      { display: flex; align-items: center; position: relative; }
          .nav-account-text  { display: none;}
        }

        /* ── Mobile menu ── */
        .mobile-menu {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100vh;
          background: #F8F8F5;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding: 0 28px;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(.77,0,.18,1);
          box-sizing: border-box;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0 24px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          flex-shrink: 0;
        }
        .mobile-menu-link {
          text-decoration: none;
          color: #111;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 20px 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: block;
        }
        .mobile-collection-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          user-select: none;
        }
        .mobile-collection-label {
          color: #111;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .chevron-icon {
          transition: transform 0.3s ease;
          display: inline-block;
          line-height: 1;
        }
        .chevron-icon.up { transform: rotate(90deg); }
        .mobile-collection-sub {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.38s cubic-bezier(.77,0,.18,1), opacity 0.25s ease;
        }
        .mobile-collection-sub.open { max-height: 400px; opacity: 1; }
        .mobile-sub-link {
          text-decoration: none;
          color: #555;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 13px 0 13px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          display: block;
        }
        .mobile-sub-link:last-child { border-bottom: 1px solid rgba(0,0,0,0.06); }

        

        /* ── Desktop collection dropdown ── */
        .desktop-dropdown-wrapper { position: relative; align-self: center; }
        .desktop-dropdown-wrapper::after {
          content: '';
          position: absolute;
          top: 100%;
          left: -16px; right: -16px;
          height: 16px;
        }
        .desktop-collection-btn {
          background: none; border: none; cursor: pointer;
          color: #111; font-size: 11px; letter-spacing: 0.18em;
          text-transform: uppercase; font-family: inherit;
          padding: 0; display: flex; align-items: center; gap: 5px;
        }
        .desktop-dropdown {
          position: absolute;
          top: calc(100% + 16px);
          left: 50%;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(0,0,0,0.08);
          min-width: 190px;
          padding: 6px 0;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%);
          transition: opacity 0.2s ease;
          z-index: 200;
        }
        .desktop-dropdown.open { opacity: 1; pointer-events: auto; }
        .desktop-dropdown-link {
          display: block; text-decoration: none; color: #111;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          padding: 12px 20px; transition: background 0.15s;
        }
        .desktop-dropdown-link:hover { background: rgba(0,0,0,0.04); }

        /* ── Bag badge ── */
        .bag-badge {
          position: absolute;
          top: -6px; right: -8px;
          background: #111; color: #fff;
          font-size: 9px; width: 16px; height: 16px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600;
        }

        /* ══════════════════════════════════════
           SEARCH — desktop: small panel top-right
                    mobile: full-width below nav
           ══════════════════════════════════════ */

        /*
          Layer order:
          z-997  blur backdrop  (page content)
          z-998  solid white bar (full width, covers nav + search row)
          z-1000 nav
          z-1001 search panel
        */

        /* Full-width solid white bar behind nav + search area */
        .search-white-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 155px;
          background: #fff;
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .search-white-bar.open { opacity: 1; }

        /* Blur backdrop — only below the white bar */
        .search-backdrop {
          position: fixed;
          top: 117px; left: 0; right: 0; bottom: 0;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background: rgba(220,220,220,0.25);
          z-index: 997;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .search-backdrop.open { opacity: 1; pointer-events: auto; }

        /* Search panel — top-right on desktop */
        .search-panel {
          position: fixed;
          top: 57px;
          right: 28px;
          width: 300px;
          background: transparent;
          z-index: 1001;
          padding: 10px 0 14px;
          box-sizing: border-box;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .search-panel.open { opacity: 1; pointer-events: auto; }

        .search-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #111;
          margin-bottom: 8px;
          display: block;
        }
        .search-input-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #111;
          padding-bottom: 6px;
        }

        @media (min-width: 769px) {
          .search-input-row {
            margin-bottom: 16px;
          }
        }
        .search-input {
          flex: 1; border: none; outline: none;
          font-size: 13px; background: transparent;
          color: #111; font-family: inherit; padding: 0;
        }
        .search-close {
          background: none; border: none; cursor: pointer;
          font-size: 20px; color: #111;
          line-height: 1; padding: 0 0 0 12px; flex-shrink: 0;
        }

        /* Mobile overrides */
        @media (max-width: 768px) {
          .search-white-bar { height: 150px; }
          .search-backdrop  { top: 117px; }
          .search-panel {
            right: 0; left: 0;
            width: 100%;
            padding: 10px 28px 14px;
            
          }
        }
      `}</style>

      {/* ── SOLID WHITE BAR (full width, behind nav + search) ── */}
      <div className={`search-white-bar${searchOpen ? " open" : ""}`} />

      {/* ── BLUR BACKDROP (page content below) ── */}
      <div
        className={`search-backdrop${searchOpen ? " open" : ""}`}
        onClick={closeSearch}
      />

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%",
          zIndex: 900,
          padding: "18px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            isCollectionPage
              ? "#fff"
              : searchOpen
                ? "#fff"
                : isScrolled
                  ? "#fff"
                  : "transparent",

          backdropFilter:
            isCollectionPage
              ? "none"
              : searchOpen
                ? "none"
                : isScrolled
                  ? "blur(2px)"
                  : "none",
          transition: "background 0.3s ease",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", minWidth: 80 }}>
          <div className="nav-links-desktop">
            <Link href="/" className="nav-link-hover" onClick={closeSearch} style={{ textDecoration: "none", color: "#111", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Home
            </Link>



            <div
              className="desktop-dropdown-wrapper"
              onMouseEnter={() => setDesktopDropdownOpen(true)}
              onMouseLeave={() => setDesktopDropdownOpen(false)}
            >
              <Link href="/collection" className="desktop-collection-btn nav-link-hover" onClick={closeSearch} style={{ textDecoration: "none", color: "#111" }}>
                Collection
              </Link>
              <div className={`desktop-dropdown${desktopDropdownOpen ? " open" : ""}`}>
                {COLLECTION_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="desktop-dropdown-link" onClick={() => setDesktopDropdownOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/collection?gender=Men"
              className="nav-link-hover"
              onClick={closeSearch}
              style={{
                textDecoration: "none",
                color: "#111",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Men
            </Link>

            <Link
              href="/collection?gender=Women"
              className="nav-link-hover"
              onClick={closeSearch}
              style={{
                textDecoration: "none",
                color: "#111",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Women
            </Link>

          </div>

          <button className="nav-hamburger" onClick={() => { setMobileMenuOpen(true); closeSearch(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} aria-label="Open menu">
            <HamburgerIcon />
          </button>
        </div>

        {/* CENTER */}
        <Link href="/" style={{ textDecoration: "none", color: "#111", fontSize: "18px", fontWeight: "500", letterSpacing: "0.35em", textTransform: "uppercase", position: "absolute", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
          PER FUMUS
        </Link>

        {/* RIGHT */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", minWidth: 80, justifyContent: "flex-end" }}>
          <button className="nav-search-text nav-link-hover" onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#111", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "inherit", padding: 0 }}>
            Search
          </button>
          <button className="nav-search-icon" aria-label="Search" onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <SearchIcon />
          </button>
          <Link
            href="/Account"
            className="nav-account-text nav-link-hover"
            style={{
              textDecoration: "none",
              color: "#111",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            Account
          </Link>

          <button className="nav-bag-text nav-link-hover" onClick={() => { setCartOpen(true); closeSearch(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#111", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "inherit", padding: 0 }}>
            Bag ({cartCount})
          </button>
          <button className="nav-bag-icon" onClick={() => { setCartOpen(true); closeSearch(); }} aria-label={`Shopping bag, ${cartCount} items`} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <BagIcon />
            {cartCount > 0 && <span className="bag-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* ── SEARCH PANEL ── */}
      <div className={`search-panel${searchOpen ? " open" : ""}`}>
        <span className="search-label">Enter Keyword</span>
        <div className="search-input-row">
          <input
            className="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                window.location.href = `/collection?search=${encodeURIComponent(searchQuery.trim())}`;
                closeSearch();
              }
              if (e.key === "Escape") closeSearch();
            }}
            autoFocus={searchOpen}
          />
          <button className="search-close" onClick={closeSearch} aria-label="Close search">×</button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        <div className="mobile-menu-header">
          <span style={{ fontSize: "13px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#111" }}>Menu</span>
          <button onClick={closeMobileMenu} style={{ background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "#111", lineHeight: 1 }} aria-label="Close menu">×</button>
        </div>
        <div style={{ paddingTop: 8 }}>
          <Link href="/" className="mobile-menu-link" onClick={closeMobileMenu}>Home</Link>

          <div>
            <div className="mobile-collection-row">
              <Link href="/collection" className="mobile-collection-label" style={{ textDecoration: "none" }} onClick={closeMobileMenu}>Collection</Link>
              <span className={`chevron-icon${collectionOpen ? " up" : ""}`} onClick={() => setCollectionOpen((p) => !p)} style={{ padding: "4px 0 4px 16px", cursor: "pointer" }}>
                <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
                  <path d="M1 1L6 5.5L1 10" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className={`mobile-collection-sub${collectionOpen ? " open" : ""}`}>
              {COLLECTION_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="mobile-sub-link" onClick={closeMobileMenu}>{link.label}</Link>
              ))}
            </div>
          </div>

          <Link
            href="/collection?gender=Men"
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            Men
          </Link>

          <Link
            href="/collection?gender=Women"
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            Women
          </Link>

          <Link href="/Account" className="mobile-menu-link" onClick={closeMobileMenu}>Account</Link>

        </div>
      </div>

      {/* ── OVERLAY (cart + mobile menu) ── */}
      <div
        onClick={() => { setCartOpen(false); closeMobileMenu(); }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 998, opacity: cartOpen || mobileMenuOpen ? 1 : 0, pointerEvents: cartOpen || mobileMenuOpen ? "auto" : "none", transition: "opacity 0.35s ease" }}
      />

      {/* ── CART DRAWER ── */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}