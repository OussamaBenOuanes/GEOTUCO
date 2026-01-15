"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { pagesTranslations } from "../translations/pages";

export default function NotFound() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
    }
  }, []);

  const t = pagesTranslations[lang]?.notFound || pagesTranslations.en.notFound;

  return (
    <main style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: "2rem"
    }}>
      <h1 style={{
        fontSize: "3rem",
        fontWeight: 900,
        color: "#003365",
        marginBottom: "1rem",
        textAlign: "center"
      }}>
        {t.title}
      </h1>
      <p style={{
        fontSize: "1.2rem",
        color: "#495867",
        marginBottom: "2rem",
        textAlign: "center",
        whiteSpace: "pre-line"
      }}>
        {t.description}
      </p>
      <Link
        href="/"
        style={{
          background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
          color: "#fff",
          fontWeight: 700,
          padding: "0.8em 2em",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: "1.1rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
        }}
      >
        {t.goHome}
      </Link>
    </main>
  );
}

