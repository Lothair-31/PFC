"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        // Sign Up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

        if (signUpError) throw signUpError;
        
        alert("Account created successfully! Please check your email to confirm.");
        setMode("signin"); // Switch to sign in after signup

      } else {
        // Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        router.push("/account"); // or /dashboard if you have one
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f1", display: "flex", justifyContent: "center", alignItems: "center", padding: "120px 20px 40px" }}>
      <div style={{ width: "100%", maxWidth: 670, background: "#f4f4f1", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
        
        <div style={{ padding: "42px 56px 34px" }}>
          <h1 style={{ fontSize: "54px", fontWeight: 300, textAlign: "center", color: "#111", marginBottom: 4, letterSpacing: "-0.04em" }}>
            Hello!
          </h1>

          <p style={{ textAlign: "center", color: "#444", fontSize: 18, marginBottom: 28 }}>
            Please choose how you want to proceed
          </p>

          {/* Toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid rgba(0,0,0,0.25)", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <button onClick={() => setMode("signup")} style={{ height: 62, border: "none", cursor: "pointer", background: mode === "signup" ? "#C8A94A" : "transparent", color: "#333", fontSize: 18, fontWeight: 500 }}>
              Sign up
            </button>
            <button onClick={() => setMode("signin")} style={{ height: 62, border: "none", cursor: "pointer", background: mode === "signin" ? "#C8A94A" : "transparent", color: "#333", fontSize: 18, fontWeight: 500 }}>
              Sign in
            </button>
          </div>

          <p style={{ textAlign: "center", color: "#555", fontSize: 15, marginBottom: 34 }}>
            {mode === "signup" ? "You can create an account." : "Welcome back to Per Fumus."}
          </p>

          {error && <p style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{error}</p>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {mode === "signup" && (
              <div>
                <p style={{ fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, color: "#222" }}>Name</p>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", height: 66, border: "none", borderRadius: 12, padding: "0 18px", background: "#ECECEF", fontSize: 18, outline: "none" }}
                  required
                />
              </div>
            )}

            <div>
              <p style={{ fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, color: "#222" }}>Email Address</p>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", height: 66, border: "none", borderRadius: 12, padding: "0 18px", background: "#ECECEF", fontSize: 18, outline: "none" }}
                required
              />
            </div>

            <div>
              <p style={{ fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, color: "#222" }}>Password</p>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", height: 66, border: "none", borderRadius: 12, padding: "0 18px", background: "#ECECEF", fontSize: 18, outline: "none" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 66,
                border: "none",
                borderRadius: 12,
                background: "#000",
                color: "#fff",
                fontSize: 20,
                fontWeight: 300,
                cursor: "pointer",
                marginTop: 4,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "18px 20px", textAlign: "center", background: "#EFEFEF" }}>
          <p style={{ fontSize: 15, color: "#444", marginBottom: 4 }}>Need some help?</p>
          <button style={{ background: "none", border: "none", color: "#C8A94A", cursor: "pointer", fontSize: 15, fontWeight: 500 }}>Contact us</button>
        </div>
      </div>
    </div>
  );
}