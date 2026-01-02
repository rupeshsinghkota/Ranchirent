import { MetadataRoute } from 'next';

import { localities } from '@/data/localities';

// Helper to Fetch Data with Cache & Timeout (Reused Pattern)
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyp8XgTvaV63TicaSpZdkrbJMPo77inIqJ5Q451iM5snzagbNH9EivxZf9bd7nFSiO5/exec";

    try {
        const fetchPromise = fetch(SCRIPT_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
        );

        const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    } catch (e) {
        console.error("Sitemap fetch failed:", e);
        return [];
    }
}

// Helper to get first valid image URL
function getFirstImage(imageStr: string | null): string | null {
    if (!imageStr) return null;
    const firstImg = imageStr.split(',')[0]?.trim();
    if (!firstImg || firstImg === 'No Image') return null;

    // Convert Drive URLs to direct image
    if (firstImg.includes('drive.google.com') && firstImg.includes('/d/')) {
        const match = firstImg.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match?.[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
        }
    }
    return firstImg;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ranchirent.in';
    const allProperties = await getProperties();
    const today = new Date();

    // Static Routes with proper priorities
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: today,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/listings`,
            lastModified: today,
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/landlord`,
            lastModified: today,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/agent`,
            lastModified: today,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: today,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: today,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: today,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: today,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Locality Routes - High priority for SEO
    const localityRoutes: MetadataRoute.Sitemap = localities.map((locality) => ({
        url: `${baseUrl}/rent/${locality.toLowerCase().replace(/ /g, '-')}`,
        lastModified: today,
        changeFrequency: 'daily',
        priority: 0.9,
    }));

    // Property Routes with SEO slugs and images
    const propertyRoutes: MetadataRoute.Sitemap = Array.isArray(allProperties)
        ? allProperties.map((property: any) => {
            // Generate SEO slug: id-type-location
            const typeSlug = (property.type || '').toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
            const locationSlug = (property.location || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const slug = [property.id, typeSlug, locationSlug].filter(Boolean).join('-');

            // Get property image for sitemap
            const image = getFirstImage(property.image);

            const entry: any = {
                url: `${baseUrl}/property/${slug}`,
                lastModified: today,
                changeFrequency: 'weekly',
                priority: 0.8,
            };

            // Add image if available (Google Image Sitemap)
            if (image) {
                entry.images = [image];
            }

            return entry;
        })
        : [];



    // Blog Routes
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const fs = await import('fs');
        const path = await import('path');
        const blogPath = path.join(process.cwd(), 'data', 'blog_posts.json');

        if (fs.existsSync(blogPath)) {
            const fileContents = fs.readFileSync(blogPath, 'utf8');
            const posts = JSON.parse(fileContents);

            blogRoutes = posts.map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'monthly',
                priority: 0.7,
            }));
        }
    } catch (e) {
        console.error("Failed to add blog posts to sitemap:", e);
    }

    // Add Blog Index
    const blogIndexRoute = {
        url: `${baseUrl}/blog`,
        lastModified: today,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    };

    return [...staticRoutes, blogIndexRoute, ...localityRoutes, ...propertyRoutes, ...blogRoutes];
}

