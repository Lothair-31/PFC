"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";

type Address = {
  id?: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

const emptyAddress: Address = {
  label: "Home",
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  province: "",
  postal_code: "",
  country: "Philippines",
  is_default: false,
};

const Skel = ({ w, h, radius = 8 }: { w: string | number; h: number; radius?: number }) => (
  <div style={{
    width: w, height: h, borderRadius: radius,
    background: "linear-gradient(90deg, #e8e8e5 25%, #f0f0ed 50%, #e8e8e5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    flexShrink: 0,
  }} />
);

export default function AccountPage() {
  const supabase = createSupabaseClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>(emptyAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await loadProfile(session.user.id);
      }
      setAuthReady(true);
    };
    load();
  }, []);

  const loadProfile = async (uid: string) => {
    const { data: profile } = await supabase
      .from("User")
      .select("name, phone")
      .eq("id", uid)
      .single();

    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }

    const { data: addrs } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", uid)
      .order("is_default", { ascending: false });

    if (addrs) setAddresses(addrs);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: { data: { name: authName } },
        });
        if (error) throw error;
        alert("Account created! Please check your email to confirm.");
        setMode("signin");
        setAuthName("");
        setAuthPassword("");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setUserId(data.user.id);
        await loadProfile(data.user.id);
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setName("");
    setPhone("");
    setAddresses([]);
    setMode("signin");
  };

  const saveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    setProfileMessage("");

    console.log("Saving profile for userId:", userId);
    console.log("Data being saved:", { name, phone });

    const { data, error } = await supabase
      .from("User")
      .update({ name, phone })
      .eq("id", userId)
      .select(); // .select() forces Supabase to return the updated row

    console.log("Save result — data:", data, "error:", error);

    setSaving(false);
    setProfileMessage(error ? `Failed: ${error.message}` : "Profile updated!");
    setTimeout(() => setProfileMessage(""), 5000);
  };

  const saveAddress = async () => {
    if (!userId) return;
    setSaving(true);

    if (newAddress.is_default) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    }

    const { error } = await supabase
      .from("addresses")
      .insert({ ...newAddress, user_id: userId });

    if (!error) {
      await loadProfile(userId);
      setNewAddress(emptyAddress);
      setShowAddressForm(false);
    }

    setSaving(false);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 54,
    border: "none",
    borderRadius: 10,
    padding: "0 16px",
    background: "#ECECEF",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#222",
  };

  const shimmerStyle = `
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  // ─────────────────────────────────────────
  // SKELETON
  // ─────────────────────────────────────────
  if (!authReady) {
    return (
      <>
        <style>{shimmerStyle}</style>
        <div style={{ minHeight: "100vh", background: "#f4f4f1", padding: "120px 20px 60px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <Skel w={180} h={36} />
              <Skel w={80} h={36} />
            </div>
            <Skel w={160} h={18} radius={6} />
            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", marginTop: 12, marginBottom: 24 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
              <div>
                <Skel w={60} h={13} radius={4} />
                <div style={{ marginTop: 8 }}><Skel w="100%" h={54} /></div>
              </div>
              <div>
                <Skel w={120} h={13} radius={4} />
                <div style={{ marginTop: 8 }}><Skel w="100%" h={54} /></div>
              </div>
            </div>
            <Skel w={140} h={50} />
            <div style={{ marginTop: 48 }}>
              <Skel w={180} h={18} radius={6} />
              <div style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", marginTop: 12, marginBottom: 24 }} />
              <Skel w={200} h={15} radius={4} />
              <div style={{ marginTop: 20 }}><Skel w={160} h={50} /></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────
  // LOGGED OUT
  // ─────────────────────────────────────────
  if (!userId) {
    return (
      <>
        <style>{shimmerStyle}</style>
        <div style={{ minHeight: "100vh", background: "#f4f4f1", display: "flex", justifyContent: "center", alignItems: "center", padding: "120px 20px 40px" }}>
          <div style={{ width: "100%", maxWidth: 670, background: "#f4f4f1", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ padding: "42px 56px 34px" }}>
              <h1 style={{ fontSize: 54, fontWeight: 300, textAlign: "center", color: "#111", marginBottom: 4, letterSpacing: "-0.04em" }}>
                Hello!
              </h1>
              <p style={{ textAlign: "center", color: "#444", fontSize: 18, marginBottom: 28 }}>
                Please choose how you want to proceed
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid rgba(0,0,0,0.25)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                {(["signup", "signin"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setAuthError(""); }}
                    style={{
                      height: 62, border: "none", cursor: "pointer",
                      background: mode === m ? "#C8A94A" : "transparent",
                      color: "#333", fontSize: 18, fontWeight: 500,
                    }}
                  >
                    {m === "signup" ? "Sign up" : "Sign in"}
                  </button>
                ))}
              </div>

              <p style={{ textAlign: "center", color: "#555", fontSize: 15, marginBottom: 34 }}>
                {mode === "signup" ? "You can create an account." : "Welcome back to Per Fumus."}
              </p>

              {authError && (
                <p style={{ color: "red", textAlign: "center", marginBottom: 16, fontSize: 14 }}>
                  {authError}
                </p>
              )}

              <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {mode === "signup" && (
                  <div>
                    <p style={labelStyle}>Name</p>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      style={{ ...inputStyle, height: 66, fontSize: 18 }}
                      required
                    />
                  </div>
                )}
                <div>
                  <p style={labelStyle}>Email Address</p>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ ...inputStyle, height: 66, fontSize: 18 }}
                    required
                  />
                </div>
                <div>
                  <p style={labelStyle}>Password</p>
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ ...inputStyle, height: 66, fontSize: 18 }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    width: "100%", height: 66, border: "none", borderRadius: 12,
                    background: "#000", color: "#fff", fontSize: 20, fontWeight: 300,
                    cursor: "pointer", marginTop: 4, opacity: authLoading ? 0.7 : 1,
                  }}
                >
                  {authLoading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
                </button>
              </form>
            </div>

            <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "18px 20px", textAlign: "center", background: "#EFEFEF" }}>
              <p style={{ fontSize: 15, color: "#444", marginBottom: 4 }}>Need some help?</p>
              <button style={{ background: "none", border: "none", color: "#C8A94A", cursor: "pointer", fontSize: 15, fontWeight: 500 }}>
                Contact us
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────
  // LOGGED IN
  // ─────────────────────────────────────────
  return (
    <>
      <style>{shimmerStyle}</style>
      <div style={{ minHeight: "100vh", background: "#f4f4f1", padding: "120px 20px 60px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
            <h1 style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.03em" }}>My Account</h1>
            <button
              onClick={handleLogout}
              style={{
                height: 42, padding: "0 22px", border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: 10, background: "transparent", fontSize: 14, cursor: "pointer",
              }}
            >
              Log out
            </button>
          </div>

          {/* Personal Details */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
              Personal Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <p style={labelStyle}>Name</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <p style={labelStyle}>Phone Number</p>
                <input type="tel" placeholder="+63 900 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
              </div>
            </div>
            {profileMessage && (
              <p style={{ color: profileMessage.startsWith("Failed") ? "red" : "#C8A94A", fontSize: 14, marginTop: 12 }}>
                {profileMessage}
              </p>
            )}
            <button
              onClick={saveProfile}
              disabled={saving}
              style={{
                marginTop: 24, height: 50, padding: "0 28px", border: "none",
                borderRadius: 10, background: "#000", color: "#fff",
                fontSize: 15, cursor: "pointer", opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </section>

          {/* Delivery Addresses */}
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
              Delivery Addresses
            </h2>

            {addresses.length === 0 && !showAddressForm && (
              <p style={{ color: "#777", fontSize: 15, marginBottom: 20 }}>No addresses saved yet.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    padding: "16px 20px", background: "#fff", borderRadius: 10,
                    border: addr.is_default ? "1px solid #C8A94A" : "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      {addr.is_default && (
                        <span style={{ fontSize: 11, background: "#C8A94A", color: "#fff", padding: "2px 8px", borderRadius: 4, marginBottom: 6, display: "inline-block" }}>
                          Default
                        </span>
                      )}
                      <p style={{ fontWeight: 500, marginBottom: 2 }}>{addr.label} — {addr.full_name}</p>
                      <p style={{ color: "#555", fontSize: 14 }}>{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}</p>
                      <p style={{ color: "#555", fontSize: 14 }}>{addr.city}, {addr.province} {addr.postal_code}</p>
                      <p style={{ color: "#555", fontSize: 14 }}>{addr.country} · {addr.phone}</p>
                    </div>
                    <button
                      onClick={() => deleteAddress(addr.id!)}
                      style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 13 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddressForm ? (
              <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "24px 28px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>New Address</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Label", key: "label", placeholder: "Home / Work" },
                    { label: "Full Name", key: "full_name", placeholder: "Juan Dela Cruz" },
                    { label: "Phone", key: "phone", placeholder: "+63 900 000 0000" },
                    { label: "Address Line 1", key: "address_line1", placeholder: "Street / Barangay", full: true },
                    { label: "Address Line 2", key: "address_line2", placeholder: "Unit / Floor (optional)", full: true },
                    { label: "City", key: "city", placeholder: "Makati" },
                    { label: "Province", key: "province", placeholder: "Metro Manila" },
                    { label: "Postal Code", key: "postal_code", placeholder: "1200" },
                  ].map(({ label, key, placeholder, full }) => (
                    <div key={key} style={{ gridColumn: full ? "span 2" : "span 1" }}>
                      <p style={labelStyle}>{label}</p>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={(newAddress as any)[key]}
                        onChange={(e) => setNewAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, is_default: e.target.checked }))}
                  />
                  <span style={{ fontSize: 14 }}>Set as default address</span>
                </label>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button
                    onClick={saveAddress}
                    disabled={saving}
                    style={{ height: 50, padding: "0 28px", border: "none", borderRadius: 10, background: "#000", color: "#fff", fontSize: 15, cursor: "pointer" }}
                  >
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                  <button
                    onClick={() => { setShowAddressForm(false); setNewAddress(emptyAddress); }}
                    style={{ height: 50, padding: "0 28px", border: "1px solid rgba(0,0,0,0.2)", borderRadius: 10, background: "transparent", fontSize: 15, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddressForm(true)}
                style={{
                  height: 50, padding: "0 28px", border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: 10, background: "transparent", fontSize: 15, cursor: "pointer",
                }}
              >
                + Add New Address
              </button>
            )}
          </section>
        </div>
      </div>
    </>
  );
}