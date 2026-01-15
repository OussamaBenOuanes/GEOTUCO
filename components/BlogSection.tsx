"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLatestBlogs, BlogPost } from '../lib/supabase';
import { translations } from '../translations/translations';

export default function BlogSection() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        let lang = localStorage.getItem("lang");
        if (!lang) {
            lang = navigator.language.startsWith("fr") ? "fr" : "en";
        }
        setLanguage(lang);

        getLatestBlogs(3).then(data => {
            setBlogs(data);
        });

        // Listen for language changes just for translations
        const handleStorageChange = () => {
            const newLang = localStorage.getItem("lang") || "en";
            setLanguage(newLang);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('languageChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('languageChange', handleStorageChange);
        }
    }, []);

    const t = translations[language as keyof typeof translations] || translations.en;

    if (blogs.length === 0) return null;

    return (
        <section style={{
            maxWidth: 1200,
            margin: '0 auto 4rem auto',
            padding: '0 1.5rem',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#2a4d69', fontSize: '2rem', fontWeight: 700 }}>{t.latestNews}</h2>
                <Link href="/blog" style={{
                    color: '#4b86b4',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {t.readMore} &rarr;
                </Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {blogs.map((blog) => (
                    <Link href={`/blog/${blog.slug}`} key={blog.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <article style={{
                            background: '#fff',
                            borderRadius: 16,
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {/* Image */}
                            <div style={{ height: 200, overflow: 'hidden', backgroundColor: '#e3ecfa' }}>
                                {blog.image_url && (
                                    <img
                                        src={blog.image_url}
                                        alt={blog.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </div>
                                <h3 style={{
                                    color: '#2a4d69',
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                    lineHeight: 1.4
                                }}>
                                    {blog.title}
                                </h3>

                                <div style={{ marginTop: 'auto', fontWeight: 600, color: '#4b86b4' }}>
                                    {t.readMore}
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}
