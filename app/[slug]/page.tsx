"use client";

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import ContactFormWithTitle from './ContactFormWithTitle';
import React, { useEffect, useState } from 'react';
import Geology from './Geology';
import Training from './Training';
import About from './About';
import Career from './Career';
import { pagesTranslations } from '../../translations/pages';

export default function DynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const l = localStorage.getItem("lang") || "en";
      setLang(l);
    }
  }, []);

  const t = pagesTranslations[lang] || pagesTranslations.en;

  if (!slug) return notFound();

  // Handle generic services list
  if (slug === "services") {
    // Services keys to display
    const servicesKeys = ["structural-analysis", "project-management", "site-development", "environmental-consulting"];

    return (
      <>
        <title>{t.servicesTitle} | GEOTUCO</title>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#2a4d69', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
            {t.servicesTitle}
          </h1>
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {servicesKeys.map((key) => {
              const service = t.items[key];
              if (!service) return null;

              return (
                <Link
                  key={key}
                  href={`/${key}`}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px #e0e6ed',
                    padding: '2rem 1.5rem',
                    minWidth: 220,
                    maxWidth: 260,
                    textDecoration: 'none',
                    color: '#2a4d69',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontWeight: 500,
                    transition: 'transform 0.15s'
                  }}
                >
                  <span style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
                    {key === "structural-analysis" && "🏗️"}
                    {key === "project-management" && "📋"}
                    {key === "site-development" && "🌍"}
                    {key === "environmental-consulting" && "🌱"}
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>{service.title}</div>
                  <div style={{ color: '#4b5d67', fontSize: '1rem', textAlign: 'center' }}>{service.description}</div>
                </Link>
              );
            })}
          </div>
        </main>
      </>
    );
  }

  // Handle specific Hardcoded Pages (Refactored to use translations)
  if (slug === "geotechnical-engineering") {
    const geoT = t.geotechnicalEngineering;
    return (
      <>
        <title>{geoT.title} | GEOTUCO</title>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#2a4d69', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
            {geoT.title}
          </h1>
          <div style={{ color: '#444', fontSize: '1.15rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {geoT.description}
          </div>
          <ul style={{ color: '#4b5d67', fontSize: '1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            {geoT.bullets.map((b: string, i: number) => (
              <li key={i}>✔️ {b}</li>
            ))}
          </ul>
        </main>
      </>
    );
  }

  if (slug === "geotechnical-tests") {
    const geoTestT = t.geotechnicalTests;
    return (
      <>
        <title>{geoTestT.title} | GEOTUCO</title>
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.2rem', color: '#2a4d69', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
            {geoTestT.title}
          </h1>
          <div style={{ color: '#444', fontSize: '1.15rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {geoTestT.description}
          </div>
          <ul style={{ color: '#4b5d67', fontSize: '1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            {geoTestT.bullets.map((b: string, i: number) => (
              <li key={i}>✔️ {b}</li>
            ))}
          </ul>
        </main>
      </>
    );
  }

  if (slug === "training") {
    return <Training />; // Training component handles its own translations internally or need update
  }

  if (slug === "about") {
    return <About />;
  }

  if (slug === "careers" || slug === "career") {
    return <Career />;
  }

  if (slug === "softwares") {
    if (typeof window !== "undefined") {
      window.location.replace("/geoprog");
      return null;
    }
    return null;
  }

  if (slug === "contact") {
    return (
      <>
        <ContactFormWithTitle />
      </>
    );
  }

  if (slug === "geology") {
    return <Geology />; // Geology component handles its own translations internally or need update
  }

  // Handle generic pages from t.items
  const service = t.items[slug];
  if (!service) {
    // If not found in our translation items, maybe it is a 404
    // Since this is a client component, we can return notFound() but it might behave differently on client.
    // Better to render a custom 404 message or use the Next.js notFound() which triggers the error boundary.
    return notFound();
  }

  return (
    <>
      <title>{`${service.title} | GEOTUCO`}</title>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#003365', marginBottom: '1rem' }}>{service.title}</h1>
        <p style={{ fontSize: '1.15rem', color: '#444' }}>{service.description}</p>
      </main>
    </>
  );
}

