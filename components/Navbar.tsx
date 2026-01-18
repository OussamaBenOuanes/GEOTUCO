"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navbarTranslations } from '../translations/navbar';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); // desktop dropdown
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null); // mobile dropdown
  const dropdownTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const langHoverTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    setLanguage(lang);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "lang" && e.newValue) setLanguage(e.newValue);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = navbarTranslations[language] || navbarTranslations.en;

  // Define navbar pages for dynamic rendering
  const NAV_PAGES = [
    { label: t.home, slug: "" },
    { label: t.about, slug: "about" },
    { label: t.career, slug: "career" },
    {
      label: t.services, slug: "services", children: [
        { label: t.geotechnicalEngineering, slug: "geotechnical-engineering" },
        { label: t.geotechnicalTests, slug: "geotechnical-tests" },
        { label: t.training, slug: "training" },
        { label: t.geology, slug: "geology" } // Added Geology
      ]
    },
    {
      label: t.softwares, slug: "geoprog", children: [
        { label: t.geologa || "GEOLOGA®", slug: "geologa" },
        { label: t.geopres || "GEOPRES®", slug: "geopres" },
        { label: t.geoprec || "GEOPREC®", slug: "geoprec" },
        { label: t.geostat || "GEOSTAT®", slug: "geostat" },
        { label: t.geodyna || "GEODYNA®", slug: "geodyna" },
        { label: t.geogran || "GEOGRAN®", slug: "geogran" },
        { label: t.geolima || "GEOLIMA®", slug: "geolima" },
        { label: t.geocomp || "GEOCOMP®", slug: "geocomp" },
        { label: t.geocons || "GEOCONS®", slug: "geocons" },
        { label: t.geogonf || "GEOGONF®", slug: "geogonf" },
        { label: t.geocisa || "GEOCISA®", slug: "geocisa" },
        { label: t.geoproc || "GEOPROC®", slug: "geoproc" }
      ]
    },
    { label: t.blog, slug: "blog" },
    { label: t.contact, slug: "contact" }
  ];

  // Helper to determine if a nav link is active
  const isActive = (slug: string) => {
    if (slug === "") return pathname === "/" || pathname === "";
    // For software children, match /geoprog/[slug]
    if (
      NAV_PAGES.some(
        (p) => p.children && p.children.some((c) => c.slug === slug)
      )
    ) {
      return pathname === `/geoprog/${slug}` || pathname.startsWith(`/geoprog/${slug}/`);
    }
    // Default: match /[slug]
    return pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);
  };

  // Helper to determine if a parent (with children) is active
  const isParentActive = (children: { slug: string }[]) => {
    return children.some(child => isActive(child.slug));
  };

  function setServicesOpen(arg0: (v: any) => boolean): void {
    throw new Error('Function not implemented.');
  }

  // Helper to scroll to top after navigation
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="/GEOTUCO Logo Normal.svg"
              alt="GEOTUCO Logo"
              className="h-10 w-auto"
              style={{ display: 'block' }}
            />
          </Link>
        </div>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex items-center px-2 py-1 rounded text-[#189ab4] focus:outline-none"
          style={{ marginLeft: "auto" }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close navigation menu" : "Toggle navigation menu"}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
              stroke="#189ab4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          {NAV_PAGES.map(({ label, slug, children }) =>
            !children ? (
              <Link
                key={slug || "home"}
                href={slug ? `/${slug}` : '/'}
                className={isActive(slug) ? "font-medium" : "text-[#495867] font-medium hover:text-[#003365]"}
                style={isActive(slug) ? {
                  background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transition: "background 0.3s"
                } : undefined}
                onClick={scrollToTop}
              >
                {label}
              </Link>
            ) : (
              <div
                key={slug}
                className="relative"
                onMouseEnter={() => {
                  if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                  setDropdownOpen(slug);
                }}
                onMouseLeave={() => {
                  dropdownTimeout.current = setTimeout(() => setDropdownOpen(null), 120);
                }}
              >
                <Link
                  href={`/${slug}`}
                  className={(isActive(slug) ||
                    isParentActive(children) ||
                    (slug === "services" &&
                      (
                        isActive("training") ||
                        pathname === "/training" ||
                        isActive("geotechnical-engineering") ||
                        pathname === "/geotechnical-engineering" ||
                        isActive("geotechnical-tests") ||
                        pathname === "/geotechnical-tests"
                      )
                    )
                  ) ? "font-medium" : "text-[#495867] font-medium hover:text-[#003365]"}
                  style={(isActive(slug) ||
                    isParentActive(children) ||
                    (slug === "services" &&
                      (
                        isActive("training") ||
                        pathname === "/training" ||
                        isActive("geotechnical-engineering") ||
                        pathname === "/geotechnical-engineering" ||
                        isActive("geotechnical-tests") ||
                        pathname === "/geotechnical-tests"
                      )
                    )
                  ) ? {
                    background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    transition: "background 0.3s"
                  } : undefined}
                  onClick={scrollToTop}
                >
                  {label}
                </Link>
                {/* Dropdown */}
                <div
                  className={`absolute top-full mt-2 w-max px-2 bg-white border border-gray-100 rounded-lg shadow-lg z-20
                    ${dropdownOpen === slug ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                  style={{
                    left: "50%",
                    transform: dropdownOpen === slug
                      ? "translate(-50%, 0) scale(1)"
                      : "translate(-50%, 16px) scale(0.97)",
                    transition: "opacity 250ms cubic-bezier(.4,0,.2,1), transform 250ms cubic-bezier(.4,0,.2,1)",
                    willChange: "opacity, transform"
                  }}
                  onMouseEnter={() => {
                    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                    setDropdownOpen(slug);
                  }}
                  onMouseLeave={() => {
                    dropdownTimeout.current = setTimeout(() => setDropdownOpen(null), 120);
                  }}
                >
                  <div className="flex flex-col py-2">
                    {children.map((child) => (
                      <Link
                        key={child.slug}
                        href={label === t.softwares ? `/geoprog/${child.slug}` : `/${child.slug}`}
                        className={isActive(child.slug) ? "px-5 py-2 font-medium" : "px-5 py-2 text-[#495867] font-medium hover:text-[#003365]"}
                        style={isActive(child.slug) ? {
                          background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          transition: "background 0.3s"
                        } : undefined}
                        onClick={scrollToTop}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {/* Get Started Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/contact"
            className="hidden md:inline-block text-white font-bold px-6 py-2 rounded-lg transition-colors"
            style={{
              background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: "background 0.35s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)"
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background =
                "linear-gradient(90deg, #0057AC 0%, #00C6FB 100%)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background =
                "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)";
              (e.target as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
            }}
            onClick={scrollToTop}
          >
            {t.getStarted}
          </Link>
          {/* Language Dropdown - only show on desktop */}
          <div className="hidden md:block" style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Select language"
              style={{
                background: "#fff",
                borderRadius: "0.4em",
                padding: "0.4em 0.7em 0.4em 0.7em",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "background 0.2s",
                minWidth: 40,
                minHeight: 40,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
              }}
              onClick={() => setDropdownOpen(dropdownOpen === "lang" ? null : "lang")}
              onMouseEnter={e => {
                // Color effect
                const svgImg = (e.currentTarget as HTMLElement).querySelector("img");
                const svgArrow = (e.currentTarget as HTMLElement).querySelector("svg:last-of-type path");
                if (svgImg) (svgImg as HTMLElement).style.filter = "invert(32%) sepia(97%) saturate(749%) hue-rotate(183deg) brightness(97%) contrast(101%)";
                if (svgArrow) (svgArrow as SVGPathElement).setAttribute("stroke", "#0057AC");
                // UX: open menu after delay, clear any close timer
                if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current);
                langHoverTimeout.current = setTimeout(() => setDropdownOpen("lang"), 120);
              }}
              onMouseLeave={e => {
                // Color effect
                const svgImg = (e.currentTarget as HTMLElement).querySelector("img");
                const svgArrow = (e.currentTarget as HTMLElement).querySelector("svg:last-of-type path");
                if (svgImg) (svgImg as HTMLElement).style.filter = "";
                if (svgArrow) (svgArrow as SVGPathElement).setAttribute("stroke", "#003365");
                // UX: close menu after delay
                if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current);
                langHoverTimeout.current = setTimeout(() => setDropdownOpen(null), 180);
              }}
            >
              <img
                src="https://www.svgrepo.com/show/506518/language.svg"
                alt="Language"
                width={22}
                height={22}
                style={{
                  display: "inline-block",
                  transition: "filter 0.2s",
                  filter: "invert(32%) sepia(7%) saturate(1049%) hue-rotate(176deg) brightness(97%) contrast(87%)"
                }}
              />
              <svg width="14" height="14" style={{ marginLeft: 4, transition: "stroke 0.2s" }} viewBox="0 0 20 20" fill="none">
                <path d="M6 8l4 4 4-4" stroke="#495867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {dropdownOpen === "lang" && (
              <div
                className={`absolute top-full mt-2 w-max px-2 bg-white border border-gray-100 rounded-lg shadow-lg z-20
                  ${dropdownOpen === "lang" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{
                  left: "50%",
                  transform: dropdownOpen === "lang"
                    ? "translate(-50%, 0) scale(1)"
                    : "translate(-50%, 16px) scale(0.97)",
                  transition: "opacity 250ms cubic-bezier(.4,0,.2,1), transform 250ms cubic-bezier(.4,0,.2,1)",
                  willChange: "opacity, transform"
                }}
                onMouseEnter={() => {
                  if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current);
                  setDropdownOpen("lang");
                }}
                onMouseLeave={() => {
                  if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current);
                  langHoverTimeout.current = setTimeout(() => setDropdownOpen(null), 180);
                }}
              >
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "en");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  English
                </button>
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "fr");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Français
                </button>
                {/* Arabic */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "ar");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  العربية
                </button>
                {/* Spanish */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "es");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Español
                </button>
                {/* German */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "de");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Deutsch
                </button>
                {/* Italian */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "it");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Italiano
                </button>
                {/* Chinese */}

                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "zh");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  中文 (Chinese)
                </button>
                {/* Swahili */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "sw");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Kiswahili
                </button>
                {/* Yoruba */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "yo");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Yorùbá
                </button>
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "am");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  አማርኛ (Amharic)
                </button>
                {/* Hausa */}
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "0.5em 1em",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#495867",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                  onClick={() => {
                    localStorage.setItem("lang", "ha");
                    setDropdownOpen(null);
                    window.location.reload();
                  }}
                >
                  Hausa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100vw",
            minHeight: "calc(100vh - 64px)", // adjust if navbar height changes
            zIndex: 100,
            background: "#fff",
            overflowY: "auto",
            transition: "opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)",
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(-32px)",
            pointerEvents: menuOpen ? "auto" : "none"
          }}
        >
          <div
            className="border-t border-gray-100 px-4 pb-4 flex flex-col gap-3 mt-2"
            style={{
              maxWidth: 420,
              margin: "0 auto",
              minHeight: "100vh",
              paddingTop: 24,
              position: "relative"
            }}
          >
            {NAV_PAGES.map(({ label, slug, children }) =>
              !children ? (
                <Link
                  key={slug || "home"}
                  href={slug ? `/${slug}` : '/'}
                  className={
                    isActive(slug)
                      ? "font-medium"
                      : "text-[#495867] font-medium"
                  }
                  style={
                    isActive(slug)
                      ? {
                        background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transition: "background 0.3s"
                      }
                      : undefined
                  }
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  {label}
                </Link>
              ) : (
                <div key={slug}>
                  <button
                    className={
                      (isActive(slug) || isParentActive(children))
                        ? "w-full text-left font-medium py-2 flex items-center justify-between"
                        : "w-full text-left text-[#495867] font-medium hover:text-[#003365] py-2 flex items-center justify-between"
                    }
                    style={
                      (isActive(slug) || isParentActive(children))
                        ? {
                          background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          transition: "background 0.3s"
                        }
                        : undefined
                    }
                    onClick={() =>
                      setMobileDropdownOpen(
                        mobileDropdownOpen === slug ? null : slug
                      )
                    }
                    aria-expanded={mobileDropdownOpen === slug}
                    aria-controls={`mobile-dropdown-${slug}`}
                  >
                    <span>{label}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{
                        transform:
                          mobileDropdownOpen === slug
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s"
                      }}
                    >
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="#495867"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {mobileDropdownOpen === slug && (
                    <div
                      id={`mobile-dropdown-${slug}`}
                      className="flex flex-col pl-4"
                      style={{
                        borderRadius: 8,
                        marginBottom: 8,
                        marginTop: 2
                      }}
                    >
                      {children.map((child) => (
                        <Link
                          key={child.slug}
                          href={
                            label === t.softwares
                              ? `/geoprog/${child.slug}`
                              : `/${child.slug}`
                          }
                          className={
                            isActive(child.slug)
                              ? "font-medium py-2"
                              : "text-[#495867] font-medium py-2"
                          }
                          style={
                            isActive(child.slug)
                              ? {
                                background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                transition: "background 0.3s"
                              }
                              : undefined
                          }
                          onClick={() => {
                            setMenuOpen(false);
                            scrollToTop();
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            <Link
              href="/contact"
              className="text-white font-bold px-6 py-2 rounded-lg transition-colors mt-2 text-center"
              style={{
                background: "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)",
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: "background 0.3s"
              }}
              onClick={() => {
                setMenuOpen(false);
                scrollToTop();
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background =
                  "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)";
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background =
                  "linear-gradient(85deg, #003365 54.3%, #0057AC 100%)";
              }}
            >
              {t.getStarted}
            </Link>
            {/* Language menu for mobile */}
            <div className="flex flex-col gap-1 mt-4">
              <div
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, cursor: "pointer" }}
                onClick={() =>
                  setMobileDropdownOpen(
                    mobileDropdownOpen === "lang" ? null : "lang"
                  )
                }
                aria-label="Toggle language menu"
                aria-expanded={mobileDropdownOpen === "lang"}
                aria-controls="mobile-lang-dropdown"
              >
                <img
                  src="https://www.svgrepo.com/show/506518/language.svg"
                  alt="Language"
                  width={22}
                  height={22}
                  style={{ display: "inline-block" }}
                />
                <span style={{ fontWeight: 600, color: "#003365", fontSize: 16 }}>{t.language}</span>
                <button
                  className="ml-auto"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer"
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{
                      transform:
                        mobileDropdownOpen === "lang"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.2s"
                    }}
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="#495867"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              {mobileDropdownOpen === "lang" && (
                <div
                  id="mobile-lang-dropdown"
                  className="flex flex-col"
                  style={{
                    borderRadius: 8,
                    marginBottom: 8,
                    marginTop: 2
                  }}
                >
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "en");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    English
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "fr");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Français
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "ar");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    العربية
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "es");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Español
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "de");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Deutsch
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "it");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Italiano
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "zh");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    中文 (Chinese)
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "sw");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Kiswahili
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "yo");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Yorùbá
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "am");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    አማርኛ (Amharic)
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.5em 1em",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#495867",
                      fontWeight: 500,
                      fontSize: 15,
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0057AC")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#495867")}
                    onClick={() => {
                      localStorage.setItem("lang", "ha");
                      setMenuOpen(false);
                      window.location.reload();
                    }}
                  >
                    Hausa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
