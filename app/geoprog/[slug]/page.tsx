"use client";
import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
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

  // Fallback to English for detailed fields if not available in current language
  const englishSoftware = softwaresTranslations.en.items[slug];
  const features = software.features || englishSoftware?.features || [];
  const benefits = software.benefits || englishSoftware?.benefits || [];
  const technicalSpecs = software.technicalSpecs || englishSoftware?.technicalSpecs || [];

  // Map slug to uppercase image filename
  const imagePath = `/GEOPROG MODULES/${slug.toUpperCase()}.jpg`;

  return (
    <>
      <title>{`${software.title} | GEOTUCO`}</title>
      <main style={{
        minHeight: '80vh',
        background: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
        paddingBottom: '4rem'
      }}>
        {/* Header with Back Navigation */}
        <div style={{
          background: 'linear-gradient(135deg, #2a4d69 0%, #4b86b4 100%)',
          padding: '2rem 1.5rem',
          color: '#fff'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Link
              href="/geoprog"
              style={{
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                opacity: 0.9,
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {t.backToAll || "Back to All Software"}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <img
                src={`/LOGOSV3/${slug.toUpperCase()}_logo.svg`}
                alt={`${software.title} logo`}
                style={{ height: 60, width: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.1
              }}>
                {software.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '3rem 1.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* Left Column - Image */}
            <div style={{
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e0e6ed'
              }}>
                <img
                  src={imagePath}
                  alt={`${software.title} Screenshot`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Overview Section */}
              <section style={{
                background: '#fff',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                <h2 style={{
                  color: '#2a4d69',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: 0,
                  marginBottom: '1rem'
                }}>
                  {t.overview}
                </h2>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#4b5d67',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  {software.description}
                </p>
              </section>

              {/* Features Section */}
              {features && features.length > 0 && (
                <section style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <h2 style={{
                    color: '#2a4d69',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginTop: 0,
                    marginBottom: '1.5rem'
                  }}>
                    {t.keyFeatures}
                  </h2>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {features.map((feature: string, index: number) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        color: '#4b5d67',
                        lineHeight: 1.6
                      }}>
                        <span style={{
                          color: '#4b86b4',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Benefits Section */}
              {benefits && benefits.length > 0 && (
                <section style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <h2 style={{
                    color: '#2a4d69',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginTop: 0,
                    marginBottom: '1.5rem'
                  }}>
                    {t.benefits}
                  </h2>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {benefits.map((benefit: string, index: number) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        color: '#4b5d67',
                        lineHeight: 1.6
                      }}>
                        <span style={{
                          color: '#4b86b4',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>●</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Technical Specifications Section */}
              {technicalSpecs && technicalSpecs.length > 0 && (
                <section style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                  <h2 style={{
                    color: '#2a4d69',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginTop: 0,
                    marginBottom: '1.5rem'
                  }}>
                    {t.technicalSpecs}
                  </h2>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {technicalSpecs.map((spec: string, index: number) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        color: '#4b5d67',
                        lineHeight: 1.6
                      }}>
                        <span style={{
                          color: '#2a4d69',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>▸</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
