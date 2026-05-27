import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
