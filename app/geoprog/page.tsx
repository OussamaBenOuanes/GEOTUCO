"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { softwaresTranslations } from "../../translations/softwares";

export default function GeoprogPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
    }
  }, []);

  const t = softwaresTranslations[lang] || softwaresTranslations.en;

  return (
    <>
      <title>{t.pageTitle} | GEOTUCO</title>
      <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.2rem",
          marginBottom: "2rem"
        }}>
          <img
            src="/GEOPROG Logo.svg"
            alt="GEOPROG"
            style={{ height: 44, width: "auto", display: "block" }}
          />
          <h1 style={{ fontSize: "2.6rem", color: "#023264", fontWeight: 800, margin: 0, textAlign: "center" }}>
            {t.pageTitle}
          </h1>
        </div>
        <div style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {Object.entries(t.items).map(([key, software]: [string, any]) => {
            const imagePath = `/GEOPROG MODULES/${key.toUpperCase()}.jpg`;
            return (
              <Link
                key={key}
                href={`/geoprog/${key}`}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 12px #e0e6ed",
                  overflow: "hidden",
                  minWidth: 220,
                  maxWidth: 260,
                  textDecoration: "none",
                  color: "#2a4d69",
                  display: "flex",
                  flexDirection: "column",
                  fontWeight: 500,
                  transition: "transform 0.15s, box-shadow 0.15s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px #e0e6ed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px #e0e6ed';
                }}
              >
                {/* Thumbnail Image */}
                <div style={{
                  height: 160,
                  overflow: 'hidden',
                  backgroundColor: '#f0f4f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={imagePath}
                    alt={software.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      // Fallback if image doesn't load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Card Content */}
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
                    {software.title}
                  </div>
                  <div style={{ color: "#4b5d67", fontSize: "0.95rem", textAlign: "center", lineHeight: 1.4 }}>
                    {software.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

