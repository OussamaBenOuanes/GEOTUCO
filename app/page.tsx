"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Head from 'next/head';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { translations } from '../translations/translations';
import { pagesTranslations } from '../translations/pages';
import BlogSection from '../components/BlogSection';

const SERVICE_KEYS = ["structural-analysis", "project-management", "site-development", "environmental-consulting"];

const SERVICE_EMOJIS: Record<string, string> = {
  "structural-analysis": "🏗️",
  "project-management": "📋",
  "site-development": "🌍",
  "environmental-consulting": "🌱"
};

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [isMobile, setIsMobile] = useState(false);

  // Detect browser language and set mobile state
  useEffect(() => {
    let lang = localStorage.getItem("lang");
    if (!lang) {
      lang = navigator.language.startsWith("fr") ? "fr" : "en";
      localStorage.setItem("lang", lang);
    }
    setLanguage(lang);
    setIsMobile(typeof window !== "undefined" && window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = translations[language as keyof typeof translations] || translations.en;
  const tPages = pagesTranslations[language] || pagesTranslations.en;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Parallax effect refs
  const TWEEN_FACTOR_BASE = 0.2;
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  // Update selected index on slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Listen to carousel events
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Scroll to slide when dot is clicked
  const scrollTo = useCallback((idx: number) => {
    if (emblaApi) emblaApi.scrollTo(idx);
  }, [emblaApi]);

  // Custom handler for FloatingWhatsApp button click
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      // On mobile, redirect to WhatsApp chat link
      window.open("https://wa.me/21671712233", "_blank");
      e.preventDefault();
      e.stopPropagation();
    }
    // On desktop, let FloatingWhatsApp handle it
  };

  // Set tween nodes for parallax
  const setTweenNodes = useCallback((emblaApi: any): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode: HTMLElement) => {
      return slideNode.querySelector('.embla__parallax__layer') as HTMLElement;
    });
  }, []);

  // Set tween factor for parallax
  const setTweenFactor = useCallback((emblaApi: any) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  // Parallax tween function
  const tweenParallax = useCallback(
    (emblaApi: any, eventName?: string) => {
      if (!emblaApi) return;
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      emblaApi.scrollSnapList().forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem: any) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `translateX(${translate}%)`;
          }
        });
      });
    },
    []
  );

  // Listen to carousel events and parallax
  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);

    // Auto-slide every 4.5 seconds, pause when page/tab is not active, reset on manual slide
    let interval: NodeJS.Timeout | null = null;
    function startInterval() {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (emblaApi && document.visibilityState === "visible") {
          // Prefetch the next image for better LCP
          const nextIdx = (emblaApi.selectedScrollSnap() + 1) % (t.carousel || []).length;
          const nextImg = (t.carousel || [])[nextIdx]?.src;
          if (nextImg) {
            const img = new window.Image();
            img.loading = "lazy";
            img.src = nextImg;
          }
          emblaApi.scrollTo(nextIdx);
        }
      }, 4500);
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        startInterval();
      } else if (interval) {
        clearInterval(interval);
      }
    }
    function handleUserSlide() {
      startInterval(); // reset timer on manual slide
    }
    document.addEventListener("visibilitychange", handleVisibility);
    emblaApi.on('select', handleUserSlide);
    startInterval();

    return () => {
      emblaApi
        .off('reInit', setTweenNodes)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenParallax)
        .off('scroll', tweenParallax)
        .off('slideFocus', tweenParallax)
        .off('select', handleUserSlide);
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenParallax]);

  return (
    <>
      <Head>
        <title>GEOTUCO | GeoTunisie Consulting</title>
        <meta name="description" content={t.description} />
        <meta property="og:title" content="GEOTUCO | GeoTunisie Consulting" />
        <meta property="og:description" content="Innovative solutions for infrastructure, construction, and development. Partner with us for quality, safety, and sustainability." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://geotuco.com/" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GEOTUCO | GeoTunisie Consulting" />
        <meta name="twitter:description" content="Innovative solutions for infrastructure, construction, and development. Partner with us for quality, safety, and sustainability." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" />
      </Head>
      <main style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
        {/* Embla Carousel - moved outside Hero Section */}
        <div
          className="embla"
          ref={emblaRef}
          style={{
            // maxWidth: 1200,
            margin: '2rem auto 2.5rem auto', // Added bottom margin for spacing
            width: '100%'
          }}
        >
          <div
            className="embla__container"
            style={{
              display: 'flex',
              gap: 8, // Increased gap between slides
            }}
          >
            {(t.carousel || []).map((item: any, idx: number) => (
              <div
                className="embla__slide"
                key={idx}
                style={{
                  flex: '0 0 80%',
                  minWidth: 0,
                  padding: '0 8px',
                  background: '#e3ecfa',
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '78vh',
                }}
              >
                {/* Parallax wrapper */}
                <div className="embla__parallax" style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <div
                    className="embla__parallax__layer"
                    style={{ width: '100%', height: '100%', willChange: 'transform', cursor: 'pointer' }}
                    onClick={() => scrollTo(idx)}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      loading={isMobile ? undefined : "lazy"}
                      // Removed explicit width/height to prevent blurriness on high-DPI screens
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 12,
                        display: 'block',
                        imageRendering: 'auto' // Ensures best quality rendering
                      }}
                    />
                    {/* Overlay with fade in/out effect */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(13, 25, 37, 0.55) 100%)',
                        color: '#fff',
                        // Responsive padding and layout
                        padding: isMobile
                          ? '1.1rem 1rem 1.2rem 1rem'
                          : '2.5rem 2.5rem 2.5rem 2.5rem',
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: isMobile
                          ? 'column'
                          : 'row',
                        alignItems: isMobile
                          ? 'flex-start'
                          : 'flex-end',
                        gap: isMobile
                          ? '0.7rem'
                          : '1.1rem',
                        opacity: selectedIndex === idx ? 1 : 0,
                        pointerEvents: selectedIndex === idx ? 'auto' : 'none',
                        transform: selectedIndex === idx ? 'scale(1)' : 'scale(0.92)',
                        transition: 'opacity 0.15s cubic-bezier(.4,0,.2,1), transform 0.15s cubic-bezier(.4,0,.2,1)'
                      }}
                    >
                      {/* Title and Description at the bottom left */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        flex: 1,
                        minWidth: 0
                      }}>
                        <div style={{
                          fontSize: isMobile
                            ? '1.25rem'
                            : '2.2rem',
                          fontWeight: 700,
                          marginBottom: isMobile
                            ? 10
                            : 18,
                          lineHeight: 1.1
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: isMobile
                            ? '0.98rem'
                            : '1.15rem',
                          opacity: 0.92,
                          marginBottom: 0,
                          fontWeight: 400,
                          maxWidth: 340
                        }}>
                          {item.description}
                        </div>
                      </div>
                      {/* Button aligned right */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: isMobile
                            ? 'flex-start'
                            : 'flex-end',
                          marginTop: isMobile
                            ? 12
                            : 0
                        }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'transparent',
                            color: '#fff',
                            border: '2px solid #fff',
                            borderRadius: 12,
                            padding: isMobile
                              ? '0.5em 1.1em'
                              : '0.65em 1.5em',
                            fontWeight: 500,
                            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                            cursor: 'pointer',
                            boxShadow: '0 1px 4px #0002',
                            transition: 'background 0.2s, color 0.2s, border 0.2s'
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            // Add your button logic here
                          }}
                        >
                          <span>More Details</span>
                          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }} viewBox="0 0 24 24">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Carousel Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16
          }}>
            {(t.carousel || []).map((_: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: 'none',
                  background: selectedIndex === idx ? '#4b86b4' : '#c7e0f4',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: selectedIndex === idx ? '0 0 0 2px #4b86b433' : undefined,
                  padding: 0
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          background: 'linear-gradient(90deg, #e3ecfa 60%, #c7e0f4 100%)',
          padding: '4rem 0 5rem 0', // Increased top padding for more space
          overflow: 'hidden'
        }}>
          {/* Curved accent */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 900,
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: '2.8rem',
              color: '#2a4d69',
              fontWeight: 800,
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {t.title}
            </h1>
            <p style={{
              color: '#4b5d67',
              fontSize: '1.25rem',
              maxWidth: 600,
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {t.description}
            </p>
            <Link href="/contact" style={{
              background: '#4b86b4',
              color: '#fff',
              padding: '0.9rem 2.2rem',
              borderRadius: 8,
              fontSize: '1.15rem',
              textDecoration: 'none',
              fontWeight: 600,
              boxShadow: '0 2px 8px #e0e6ed'
            }}>
              {t.getStarted}
            </Link>
          </div>
        </section>

        {/* Services Cards */}
        <section style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          marginTop: '-3rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          zIndex: 3,
          position: 'relative'
        }}>
          {SERVICE_KEYS.map((key) => {
            const service = tPages.items[key];
            if (!service) return null;
            return (
              <ServiceCard
                key={key}
                title={service.title}
                desc={service.description}
                href={`/${key}`}
                emoji={SERVICE_EMOJIS[key]}
              />
            );
          })}
        </section>

        {/* Testimonials */}
        <section style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 900,
          margin: '0 auto 3rem auto',
          padding: '2.5rem 1.5rem',
          boxShadow: '0 2px 16px #e0e6ed',
          position: 'relative'
        }}>
          <h2 style={{ color: '#2a4d69', textAlign: 'center', marginBottom: '2rem' }}>{t.servicesTitle}</h2>
          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {(t.testimonials || []).map((item: any, i: number) => (
              <div key={i} style={{
                background: '#f7f9fa',
                borderRadius: 12,
                padding: '1.5rem',
                minWidth: 260,
                maxWidth: 340,
                boxShadow: '0 1px 6px #e0e6ed'
              }}>
                <p style={{ fontStyle: 'italic', color: '#444', marginBottom: '1rem' }}>"{item.text}"</p>
                <div style={{ fontWeight: 600, color: '#4b86b4' }}>{item.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <BlogSection />

        {/* FAQ */}
        <section style={{
          maxWidth: 900,
          margin: '0 auto 3rem auto',
          padding: '2rem 1.5rem',
          background: '#e3ecfa',
          borderRadius: 16
        }}>
          <h3 style={{ color: '#2a4d69', marginBottom: '1.5rem' }}>{t.faqTitle}</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#333', fontSize: '1.05rem' }}>
            {(t.faq || []).map((item: any, idx: number) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
                <b>{item.question}</b><br />
                {item.answer}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

// Service Card Component
function ServiceCard({ title, desc, href, emoji }: { title: string, desc: string, href: string, emoji: string }) {
  return (
    <Link href={href} style={{
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
      transition: 'transform 0.15s',
      fontWeight: 500
    }}>
      <span style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{emoji}</span>
      <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>{title}</div>
      <div style={{ color: '#4b5d67', fontSize: '1rem', textAlign: 'center' }}>{desc}</div>
    </Link>
  );
}
