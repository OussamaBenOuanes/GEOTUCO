import { createClient } from '../utils/supabase/client';

export const supabase = createClient();

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
}

// MOCK DATA for when Supabase keys are not set or for testing
const MOCK_BLOGS: BlogPost[] = [
    {
        id: 1,
        slug: 'future-of-geotech',
        title: 'The Future of Geotechnical Engineering',
        content: `
Geotechnical engineering is evolving rapidly with the integration of AI and machine learning.
This shift allows for more accurate soil analysis and risk prediction.

## Key Trends
    - ** AI - driven simulations **: Predicting landslides before they happen.
- ** Sustainable materials **: Reducing the carbon footprint of construction.
- ** Remote sensing **: Using drones for site surveys.

Stay tuned as we explore these topics in depth!
    `,
        image_url: 'https://images.unsplash.com/photo-1581094794329-cd119277f368?auto=format&fit=crop&w=800&q=80',
        created_at: '2024-03-15T10:00:00Z'
    },
    {
        id: 2,
        slug: 'soil-testing-importance',
        title: 'Why Soil Testing is Crucial',
        content: 'Soil testing determines the bearing capacity of the land...',
        image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        created_at: '2024-03-10T10:00:00Z'
    },
    {
        id: 3,
        slug: 'intro-geotuco',
        title: 'Welcome to GEOTUCO',
        content: 'We are proud to announce our new digital presence...',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        created_at: '2024-03-01T10:00:00Z'
    },
    // French Mocks
    {
        id: 4,
        slug: 'future-of-geotech-fr',
        title: 'L\'avenir de l\'ingénierie géotechnique',
        content: 'L\'ingénierie géotechnique évolue rapidement...',
        image_url: 'https://images.unsplash.com/photo-1581094794329-cd119277f368?auto=format&fit=crop&w=800&q=80',
        created_at: '2024-03-15T10:00:00Z'
    }
];

export async function getLatestBlogs(limit: number = 3): Promise<BlogPost[]> {
    if (!supabase) {
        console.warn("Supabase client not initialized, using MOCK data");
        return MOCK_BLOGS.slice(0, limit);
    }

    // Fallback logic: Fetch posts in requested language AND English
    let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    const { data, error } = await query;

    if (error) {
        console.error("Supabase error:", error);
        return [];
    }

    return data as BlogPost[];
}

export async function getBlogs(): Promise<BlogPost[]> {
    if (!supabase) {
        return MOCK_BLOGS;
    }

    // Fallback logic for list view
    let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error("Supabase error:", error);
        return [];
    }

    return data as BlogPost[];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
    if (!supabase) {
        // Mock fallback
        const blog = MOCK_BLOGS.find(b => b.slug === slug);
        return blog || null;
    }

    // Fetch potential candidates
    let query = supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

    const { data, error } = await query;

    if (error) {
        console.error("Supabase error:", error);
        return null;
    }

    return data as BlogPost;
}
