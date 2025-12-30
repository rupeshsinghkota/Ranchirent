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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ranchirent.in';
    const allProperties = await getProperties();

    // Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/listings',
        '/contact',
        '/landlord',
        '/agent',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Locality Routes
    const localityRoutes = localities.map((locality) => ({
        url: `${baseUrl}/rent/${locality.toLowerCase().replace(/ /g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Property Routes (REAL Data)
    const propertyRoutes = Array.isArray(allProperties) ? allProperties.map((property: any) => ({
        url: `${baseUrl}/property/${property.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    })) : [];

    return [...staticRoutes, ...localityRoutes, ...propertyRoutes];
}
