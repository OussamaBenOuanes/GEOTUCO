"use client";
import React, { useEffect, useState, useRef } from "react";
import referencesData from "../../references_data.json";
import { pagesTranslations } from "../../translations/pages";

interface LocalizedString {
    fr: string;
    en: string;
    ar?: string;
    es?: string;
    de?: string;
    it?: string;
    zh?: string;
    sw?: string;
    yo?: string;
}

interface Project {
    name: LocalizedString;
    site: LocalizedString;
    structure: LocalizedString;
    mission: LocalizedString;
    details: {
        fr: string[];
        en: string[];
        ar?: string[];
        es?: string[];
        de?: string[];
        it?: string[];
        zh?: string[];
        sw?: string[];
        yo?: string[];
    };
    image?: string;
}

interface Client {
    name: string;
    url: string;
    logo: string;
}

export default function References() {
    const [lang, setLang] = useState("en");
    const [activeTab, setActiveTab] = useState<"tunisia" | "international">("tunisia");
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const l = localStorage.getItem("lang") || "en";
            setLang(l);
        }
    }, []);

    // Auto-scroll carousel
    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselRef.current) {
                const scrollWidth = carouselRef.current.scrollWidth;
                const clientWidth = carouselRef.current.clientWidth;
                const scrollLeft = carouselRef.current.scrollLeft;

                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const targetLang = pagesTranslations[lang] ? lang : "en";
    const t = pagesTranslations[targetLang]?.career || pagesTranslations.en?.career || {};

    // Helper to get localized text
    const getLoc = (obj: LocalizedString | string) => {
        if (typeof obj === 'string') return obj;
        const key = targetLang as keyof LocalizedString;
        return obj[key] || obj.en || obj.fr || "";
    };

    // Helper to get localized list
    const getLocList = (obj: any | string[]) => {
        if (Array.isArray(obj)) return obj;
        const key = targetLang;
        return obj[key] || obj.en || obj.fr || [];
    };

    // UI translations with fallbacks
    const uiLabels = {
        title: t.title || "Our References",
        intro: t.intro || "Discover our key projects and trusted clients.",
        tunisiaTab: pagesTranslations[targetLang]?.references?.tunisiaTab || "Tunisia",
        internationalTab: pagesTranslations[targetLang]?.references?.internationalTab || "International",
        clientsTitle: pagesTranslations[targetLang]?.references?.clientsTitle || "Our Clients",
        siteLabel: pagesTranslations[targetLang]?.references?.siteLabel || "Site",
        structureLabel: pagesTranslations[targetLang]?.references?.structureLabel || "Structure",
        missionLabel: pagesTranslations[targetLang]?.references?.missionLabel || "Mission",
        detailsLabel: pagesTranslations[targetLang]?.references?.detailsLabel || "Services Provided",
    };

    const projects: Project[] = activeTab === "tunisia"
        ? referencesData.tunisia as unknown as Project[]
        : referencesData.international as unknown as Project[];

    const clients: Client[] = referencesData.clients;

    const isRtl = targetLang === 'ar';

    // Persistence for active tab
    useEffect(() => {
        const savedTab = localStorage.getItem("references_active_tab");
        if (savedTab === "tunisia" || savedTab === "international") {
            setActiveTab(savedTab);
        }
    }, []);

    const handleTabChange = (tab: "tunisia" | "international") => {
        setActiveTab(tab);
        localStorage.setItem("references_active_tab", tab);
    };

    // Tunisia flag SVG (Official)
    const TunisiaFlag = () => (
        <svg width="24" height="16" viewBox="0 0 1200 800" style={{ marginRight: 8, verticalAlign: 'middle', boxShadow: '0 0 2px rgba(0,0,0,0.2)', borderRadius: 1 }}>
            <rect width="1200" height="800" fill="#E70013" />
            <circle cx="600" cy="400" r="200" fill="#fff" />
            <path fill="#E70013" d="M588 285a120 120 0 1 0 0 230 100 100 0 1 1 0-230m42 55l17.6 54.2h57l-46.1 33.5 17.6 54.2-46.1-33.5-46.1 33.5 17.6-54.2-46.1-33.5h57z" />
        </svg>
    );

    return (
        <main style={{
            padding: "2rem",
            fontFamily: "sans-serif",
            maxWidth: 1200,
            margin: "0 auto",
            color: "#333",
            lineHeight: 1.6,
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <title>{uiLabels.title} | GEOTUCO</title>

            {/* Header Section */}
            <section style={{ marginBottom: "2rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", color: "#2a4d69", fontWeight: 800, marginBottom: "1rem" }}>
                    {uiLabels.title}
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#444", maxWidth: 800, margin: "0 auto" }}>
                    {uiLabels.intro}
                </p>
            </section>

            {/* Clients Carousel Section - Now at the top */}
            <section style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                borderRadius: 20,
                padding: "3rem 2rem",
                marginBottom: "2rem"
            }}>
                <h2 style={{
                    textAlign: "center",
                    color: "#2a4d69",
                    fontSize: "1.8rem",
                    marginBottom: "2rem",
                    fontWeight: 700
                }}>
                    {uiLabels.clientsTitle}
                </h2>

                <div
                    ref={carouselRef}
                    style={{
                        display: "flex",
                        gap: "2rem",
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        paddingBottom: "1rem",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#003365 #e0e5ec",
                        direction: 'ltr'
                    }}
                >
                    {clients.map((client, i) => (
                        <a
                            key={i}
                            href={client.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 140,
                                height: 120,
                                background: "#fff",
                                borderRadius: 12,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                textDecoration: "none",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                padding: "1rem",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,51,101,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                            }}
                        >
                            <img
                                src={client.logo}
                                alt={client.name}
                                style={{
                                    width: 48,
                                    height: 48,
                                    objectFit: "contain",
                                    marginBottom: "0.5rem"
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/GEOTUCO Logo Normal.svg";
                                }}
                            />
                            <span style={{
                                fontSize: "0.75rem",
                                color: "#333",
                                fontWeight: 600,
                                textAlign: "center",
                                lineHeight: 1.2
                            }}>
                                {client.name}
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Tab Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
                <button
                    onClick={() => handleTabChange("tunisia")}
                    style={{
                        padding: "0.8rem 2rem",
                        fontSize: "1rem",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: activeTab === "tunisia"
                            ? "linear-gradient(135deg, #E70013 0%, #c4000f 100%)"
                            : "#e0e5ec",
                        color: activeTab === "tunisia" ? "#fff" : "#333",
                        transition: "all 0.3s ease",
                        boxShadow: activeTab === "tunisia" ? "0 4px 15px rgba(231,0,19,0.3)" : "none",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <TunisiaFlag /> {uiLabels.tunisiaTab}
                </button>
                <button
                    onClick={() => handleTabChange("international")}
                    style={{
                        padding: "0.8rem 2rem",
                        fontSize: "1rem",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: activeTab === "international"
                            ? "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)"
                            : "#e0e5ec",
                        color: activeTab === "international" ? "#fff" : "#333",
                        transition: "all 0.3s ease",
                        boxShadow: activeTab === "international" ? "0 4px 15px rgba(0,51,101,0.3)" : "none",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    🌍 {uiLabels.internationalTab}
                </button>
            </div>

            {/* Projects Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
                {projects.map((project, i) => (
                    <article key={i} style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                        }}
                    >
                        {/* Project Image */}
                        {project.image && (
                            <div style={{
                                width: "100%",
                                height: 180,
                                overflow: "hidden",
                                position: "relative"
                            }}>
                                <img
                                    src={project.image}
                                    alt={getLoc(project.name)}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                                {/* Flag overlay for Tunisia projects */}
                                {activeTab === "tunisia" && (
                                    <div style={{
                                        position: "absolute",
                                        top: 10,
                                        [isRtl ? 'left' : 'right']: 10,
                                        background: "rgba(255,255,255,0.9)",
                                        borderRadius: 4,
                                        padding: "4px 8px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <TunisiaFlag />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Project Header */}
                        <div style={{
                            background: activeTab === "tunisia"
                                ? "linear-gradient(135deg, #E70013 0%, #c4000f 100%)"
                                : "linear-gradient(135deg, #003365 0%, #0057AC 100%)",
                            padding: "1rem 1.5rem",
                            color: "#fff"
                        }}>
                            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                                {getLoc(project.name)}
                            </h3>
                        </div>

                        {/* Project Content */}
                        <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#666", fontSize: "0.85rem" }}>
                                <span style={{ fontSize: "1rem" }}>📍</span>
                                <span><strong>{uiLabels.siteLabel}:</strong> {getLoc(project.site)}</span>
                            </div>

                            <div style={{
                                [isRtl ? 'borderRight' : 'borderLeft']: "3px solid #2a4d69",
                                [isRtl ? 'paddingRight' : 'paddingLeft']: "0.8rem"
                            }}>
                                <div style={{ fontWeight: 700, color: "#2a4d69", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                                    {uiLabels.structureLabel}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#444" }}>{getLoc(project.structure)}</div>
                            </div>

                            <div>
                                <div style={{ fontWeight: 700, color: "#2a4d69", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                                    {uiLabels.missionLabel}
                                </div>
                                <div style={{
                                    display: "inline-block",
                                    backgroundColor: activeTab === "tunisia" ? "#ffeaec" : "#e7f1ff",
                                    color: activeTab === "tunisia" ? "#c4000f" : "#0056b3",
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: 4,
                                    fontWeight: 700,
                                    fontSize: "0.85rem"
                                }}>
                                    {getLoc(project.mission)}
                                </div>
                            </div>

                            {getLocList(project.details).length > 0 && (
                                <div>
                                    <div style={{ fontWeight: 700, color: "#2a4d69", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                                        {uiLabels.detailsLabel}
                                    </div>
                                    <ul style={{
                                        [isRtl ? 'paddingRight' : 'paddingLeft']: "1.2rem",
                                        margin: 0,
                                        fontSize: "0.8rem",
                                        color: "#555"
                                    }}>
                                        {getLocList(project.details).map((detail: string, j: number) => (
                                            detail && <li key={j} style={{ marginBottom: "0.15rem" }}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* CTA Section */}
            <section style={{ marginTop: "4rem", textAlign: "center", borderTop: "1px solid #eee", paddingTop: "3rem" }}>
                <h2 style={{ color: "#2a4d69", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                    {targetLang === 'ar' ? 'هل تريد العمل معنا؟' : (targetLang === 'es' ? '¿Quieres trabajar con nosotros?' : (targetLang === 'fr' ? 'Vous souhaitez travailler avec nous ?' : (targetLang === 'de' ? 'Möchten Sie mit uns arbeiten?' : (targetLang === 'it' ? 'Vuoi lavorare con noi?' : (targetLang === 'zh' ? '想与我们合作吗？' : 'Want to work with us?')))))}
                </h2>
                <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: "2rem" }}>
                    {targetLang === 'ar' ? 'تواصل معنا لمناقشة متطلبات مشروعك.' : (targetLang === 'es' ? 'Póngase en contacto para discutir los requisitos de su proyecto.' : (targetLang === 'fr' ? 'Contactez-nous pour discuter de vos besoins.' : (targetLang === 'de' ? 'Kontaktieren Sie uns, um Ihre Projektanforderungen zu besprechen.' : (targetLang === 'it' ? 'Contattaci per discutere i requisiti del tuo progetto.' : (targetLang === 'zh' ? '联系我们讨论您的项目需求。' : 'Get in touch to discuss your project requirements.')))))}
                </p>
                <a
                    href="/contact"
                    style={{
                        display: "inline-block",
                        background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                        color: "#fff",
                        padding: "0.8rem 2.5rem",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontWeight: 700,
                        boxShadow: "0 4px 15px rgba(0,51,101,0.2)",
                        transition: "transform 0.2s"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    {targetLang === 'ar' ? 'اتصل بنا' : (targetLang === 'es' ? 'Contáctenos' : (targetLang === 'fr' ? 'Contactez-nous' : (targetLang === 'de' ? 'Kontaktieren Sie uns' : (targetLang === 'it' ? 'Contattaci' : (targetLang === 'zh' ? '联系我们' : 'Contact Us')))))}
                </a>
            </section>
        </main>
    );
}
