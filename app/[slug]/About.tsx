"use client";
import React, { useEffect, useState } from "react";
import { pagesTranslations } from "../../translations/pages";

export default function About() {
    const [lang, setLang] = useState("en");
    useEffect(() => {
        if (typeof window !== "undefined") {
            const l = localStorage.getItem("lang") || "en";
            setLang(l);
        }
    }, []);

    const targetLang = pagesTranslations[lang] ? lang : "en";
    const t = pagesTranslations[targetLang]?.about || pagesTranslations.en?.about || {};

    if (!t.title) {
        return (
            <main style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Page not available</h1>
                <p>Sorry, this content is currently unavailable. Please try again later.</p>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto", color: "#333", lineHeight: 1.6 }}>
            <title>{t.title} | GEOTUCO</title>

            {/* Header Section */}
            <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: "2.5rem", color: "#2a4d69", fontWeight: 800, marginBottom: "1.5rem" }}>
                    {t.title}
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#444", maxWidth: 800, margin: '0 auto' }}>
                    {t.intro}
                </p>
            </section>

            {/* Mission Section */}
            <section style={{ marginBottom: '3rem', backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: 16 }}>
                <h2 style={{ color: "#2a4d69", fontSize: '1.8rem', marginBottom: '1rem' }}>{t.mission.title}</h2>
                <p style={{ fontSize: '1.1rem' }}>{t.mission.content}</p>
            </section>

            {/* Expertise Section */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: "#2a4d69", fontSize: '1.8rem', marginBottom: '1rem' }}>{t.expertise.title}</h2>
                <p style={{ marginBottom: '1.5rem' }}>{t.expertise.content}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {t.expertise.areas.map((area: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                            <span style={{ color: '#2a4d69' }}>✔️</span>
                            <span>{area}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Investigations & Quality Control */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: "#2a4d69", fontSize: '1.8rem', marginBottom: '1rem' }}>{t.investigations.title}</h2>
                <p style={{ marginBottom: '1rem' }}>{t.investigations.content}</p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.2rem' }}>
                    {t.investigations.items.map((item: string, i: number) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                    ))}
                </ul>
                <p style={{ fontStyle: 'italic', color: '#666' }}>{t.investigations.footer}</p>
            </section>

            {/* Normative Framework */}
            <section style={{ marginBottom: '3rem', borderLeft: '4px solid #2a4d69', paddingLeft: '1.5rem' }}>
                <h2 style={{ color: "#2a4d69", fontSize: '1.8rem', marginBottom: '1rem' }}>{t.normative.title}</h2>
                <p style={{ marginBottom: '1rem' }}>{t.normative.content}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    {t.normative.missions.map((m: string, i: number) => (
                        <span key={i} style={{ backgroundColor: '#e9ecef', padding: '0.5rem 1rem', borderRadius: 20, fontSize: '0.9rem', fontWeight: 600 }}>
                            {m}
                        </span>
                    ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#555' }}>{t.normative.footer}</p>
            </section>

            {/* Innovation: GEODATA */}
            <section style={{ marginBottom: '3rem', backgroundColor: '#e7f1ff', padding: '2rem', borderRadius: 16 }}>
                <h2 style={{ color: "#0056b3", fontSize: '1.8rem', marginBottom: '1rem' }}>{t.innovation.title}</h2>
                <p style={{ marginBottom: '1.2rem' }}>{t.innovation.content}</p>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    {t.innovation.benefits.map((benefit: string, i: number) => (
                        <li key={i} style={{ marginBottom: '0.5rem', fontWeight: 500 }}>{benefit}</li>
                    ))}
                </ul>
            </section>

            {/* Commitment Section */}
            <section style={{ marginBottom: '4rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
                <h2 style={{ color: "#2a4d69", fontSize: '1.8rem', marginBottom: '1.5rem' }}>{t.engagement.title}</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: 850, margin: '0 auto 1.5rem auto' }}>
                    {t.engagement.content}
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2a4d69', maxWidth: 800, margin: '0 auto' }}>
                    {t.engagement.ambition}
                </p>
            </section>
        </main>
    );
}
