"use client";
import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { getBlogBySlug, BlogPost } from '../../../lib/supabase';
import { translations } from '../../../translations/translations';

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        let lang = localStorage.getItem("lang");
        if (!lang) {
            lang = navigator.language.startsWith("fr") ? "fr" : "en";
        }
        setLanguage(lang);

        if (slug) {
            getBlogBySlug(slug).then(data => {
                setBlog(data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
        // Listen for language changes if Navbar doesn't reload (but it does)
        const handleStorageChange = () => {
            const newLang = localStorage.getItem("lang") || "en";
            setLanguage(newLang);
            // We no longer need to re-fetch the blog on language change as content is language-agnostic
        };
        // Just in case we move to SPA nav later
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('languageChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('languageChange', handleStorageChange);
        }
    }, [slug]);

    const t = translations[language as keyof typeof translations] || translations.en;

    if (loading) {
        return (
            <>
                <Navbar />
                <main style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div>Loading...</div>
                </main>
                <Footer />
            </>
        );
    }

    if (!blog) {
        return notFound();
    }

    return (
        <>
            <main style={{ minHeight: '80vh', background: '#fff', paddingBottom: '5rem' }}>
                {/* Hero Image */}
                <div style={{
                    height: '40vh',
                    minHeight: 300,
                    width: '100%',
                    position: 'relative',
                    backgroundColor: '#2a4d69',
                    overflow: 'hidden'
                }}>
                    {blog.image_url && (
                        <img
                            src={blog.image_url}
                            alt={blog.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                        />
                    )}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        padding: '4rem 1.5rem 2rem 1.5rem',
                        color: '#fff'
                    }}>
                        <div style={{ maxWidth: 800, margin: '0 auto' }}>
                            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
                                {blog.title}
                            </h1>
                            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                                {new Date(blog.created_at).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article style={{
                    maxWidth: 800,
                    margin: '0 auto',
                    padding: '4rem 1.5rem',
                    fontSize: '1.2rem',
                    lineHeight: 1.8,
                    color: '#333'
                }}>
                    <Link href="/blog" style={{
                        display: 'inline-block',
                        marginBottom: '2rem',
                        color: '#4b86b4',
                        textDecoration: 'none',
                        fontWeight: 600
                    }}>
                        &larr; {t.backToPosts || "Back to all posts"}
                    </Link>

                    <div className="prose prose-lg prose-blue" style={{ fontFamily: 'Georgia, serif' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {blog.content}
                        </ReactMarkdown>
                    </div>
                </article>
            </main>
        </>
    );
}
