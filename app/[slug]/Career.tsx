"use client";
import React, { useEffect, useState } from "react";
import { pagesTranslations } from "../../translations/pages";

export default function Career() {
    const [lang, setLang] = useState("en");
    useEffect(() => {
        if (typeof window !== "undefined") {
            const l = localStorage.getItem("lang") || "en";
            setLang(l);
        }
    }, []);

    const targetLang = pagesTranslations[lang] ? lang : "en";
    const t = pagesTranslations[targetLang]?.career || pagesTranslations.en?.career || {};

    if (!t.title) {
        return (
            <main style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Page not available</h1>
                <p>Sorry, this content is currently unavailable. Please try again later.</p>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 1100, margin: "0 auto", color: "#333", lineHeight: 1.6 }}>
            <title>{t.title} | GEOTUCO</title>

            {/* Header Section */}
            <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: "2.5rem", color: "#2a4d69", fontWeight: 800, marginBottom: "1rem" }}>
                    {t.title}
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#444", maxWidth: 800, margin: '0 auto' }}>
                    {t.intro}
                </p>
            </section>

            {/* Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {Array.isArray(t.projects) && t.projects.map((project: any, i: number) => (
                    <article key={i} style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        cursor: 'default'
                    }}>
                        {/* Project Image */}
                        <div style={{ height: 220, overflow: 'hidden', position: 'relative', backgroundColor: '#eee' }}>
                            <img
                                src={project.image}
                                alt={project.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80'; // Fallback
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                padding: '1rem',
                                color: '#fff'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{project.name}</h3>
                            </div>
                        </div>

                        {/* Project Content */}
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>📍</span>
                                <span>{project.site}</span>
                            </div>

                            <div style={{ borderLeft: '3px solid #2a4d69', paddingLeft: '0.8rem' }}>
                                <div style={{ fontWeight: 700, color: '#2a4d69', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Structure</div>
                                <div style={{ fontSize: '0.95rem', color: '#444' }}>{project.structure}</div>
                            </div>

                            <div>
                                <div style={{ fontWeight: 700, color: '#2a4d69', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Mission</div>
                                <div style={{ display: 'inline-block', backgroundColor: '#e7f1ff', color: '#0056b3', padding: '0.2rem 0.6rem', borderRadius: 4, fontWeight: 700, fontSize: '0.9rem' }}>
                                    {project.mission}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontWeight: 700, color: '#2a4d69', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Services Provided</div>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: '#555' }}>
                                    {project.details.map((detail: string, j: number) => (
                                        detail && <li key={j} style={{ marginBottom: '0.2rem' }}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <section style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
                <h2 style={{ color: "#2a4d69", fontSize: '1.8rem', marginBottom: '1.5rem' }}>Want to work with us?</h2>
                <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '2rem' }}>
                    We are always looking for talented engineers and specialists to join our team. Send us your CV.
                </p>
                <a
                    href="/contact"
                    style={{
                        display: 'inline-block',
                        background: 'linear-gradient(85deg, #003365 54.3%, #0057AC 100%)',
                        color: '#fff',
                        padding: '0.8rem 2.5rem',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(0,51,101,0.2)'
                    }}
                >
                    Contact Us / Apply
                </a>
            </section>
        </main>
    );
}
