"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { getBlogs, BlogPost } from '../../lib/supabase';
import { translations } from '../../translations/translations';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let lang = localStorage.getItem("lang");
        if (!lang) {
            lang = navigator.language.startsWith("fr") ? "fr" : "en";
        }
        setLanguage(lang);

        getBlogs().then(data => {
            setBlogs(data);
            setLoading(false);
        });

        // Listen for language changes just for UI translations
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

    return (
        <>
            <main style={{ minHeight: '80vh', background: '#f8fafc', padding: '4rem 0' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
                    <h1 style={{
                        color: '#2a4d69',
                        fontSize: '3rem',
                        fontWeight: 800,
                        marginBottom: '3rem',
                        textAlign: 'center'
                    }}>
                        {t.latestNews}
                    </h1>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading...</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '2.5rem'
                        }}>
                            {blogs.map((blog) => (
                                <Link href={`/blog/${blog.slug}`} key={blog.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <article style={{
                                        background: '#fff',
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                                        }}
                                    >
                                        {/* Image */}
                                        <div style={{ height: 240, overflow: 'hidden', backgroundColor: '#e3ecfa' }}>
                                            {blog.image_url && (
                                                <img
                                                    src={blog.image_url}
                                                    alt={blog.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.75rem' }}>
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </div>
                                            <h2 style={{
                                                color: '#2a4d69',
                                                fontSize: '1.4rem',
                                                fontWeight: 700,
                                                marginBottom: '1rem',
                                                lineHeight: 1.3
                                            }}>
                                                {blog.title}
                                            </h2>
                                            {/* Excerpt simulated by line clamping logic or just hidden */}
                                            <div style={{ marginTop: 'auto', fontWeight: 600, color: '#4b86b4', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {t.readMore} &rarr;
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                            {blogs.length === 0 && (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#666', fontSize: '1.2rem' }}>
                                    No posts found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
