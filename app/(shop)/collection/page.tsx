import { Suspense } from "react";
import CollectionPage from "@/app/components/CollectionPage";

export default function Collection() {
  return (
    <main style={{ paddingTop: 60 }}>
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <CollectionPage />
      </Suspense>
    </main>
  );
}
