// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/app/components/ScrollToTop";
import { CartProvider } from "@/app/components/CartContext";   // ← Make sure this path is correct

export const metadata: Metadata = {
  title: "Per Fumus Collectives",
  description: "Per Fumus Collective. 2026 Collections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>           {/* ← This is the important line */}
          <ScrollToTop />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}