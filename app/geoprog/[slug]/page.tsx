"use client";
import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { softwaresTranslations } from "../../../translations/softwares";


export default function GeoprogSoftwarePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
    }
  }, []);

  const t = softwaresTranslations[lang] || softwaresTranslations.en;
  const software = t.items[slug];

  if (!software) return notFound();

  return (
    <>
      <title>{`${software.title} | GEOTUCO`}</title>
      <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", color: "#2a4d69", marginBottom: "1rem" }}>{software.title}</h1>
        <p style={{ fontSize: "1.15rem", color: "#444" }}>
          {software.description}
        </p>
      </main>
    </>
  );
}

