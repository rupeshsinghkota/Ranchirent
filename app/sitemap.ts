import { MetadataRoute } from 'next';
import { properties } from '@/data/properties';
import { localities } from '@/data/localities';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ranchirent.in';

    // Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/listings',
        '/contact',
        '/landlord',
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

    // Property Routes
    const propertyRoutes = properties.map((property) => ({
        url: `${baseUrl}/property/${property.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...localityRoutes, ...propertyRoutes];
}
