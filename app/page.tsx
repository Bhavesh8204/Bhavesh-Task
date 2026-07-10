"use client";

import { Toaster } from "react-hot-toast";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";
import PropertyGrid from "../components/PropertyGrid";

export default function Home() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            background: "var(--toast-bg, #ffffff)",
            color: "var(--toast-color, #0f172a)",
            border: "1px solid var(--card-border, #e2e8f0)",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            borderRadius: "10px",
            padding: "12px 16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "var(--accent-green, #10b981)",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Header />

      <main
        className="app-container"
        style={{ flexGrow: 1, paddingBottom: "60px" }}
      >
        <FilterBar />
        <PropertyGrid />
      </main>
    </>
  );
}
