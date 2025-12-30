/**
 * Generate SEO-friendly slug for property URLs
 * Format: /property/[id]-[type]-[location]-[rent]
 * Example: /property/25-2bhk-flat-lalpur-8000
 */
export function generatePropertySlug(
    id: number | string,
    type?: string,
    location?: string,
    rent?: number | string
): string {
    const slugParts = [id];

    if (type) {
        // Normalize type: "2 BHK" -> "2bhk", "Independent House" -> "independent-house"
        const typeSlug = type.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/\//g, '-');
        slugParts.push(typeSlug);
    }

    if (location) {
        // Normalize location: "Kanke Road" -> "kanke-road"
        const locationSlug = location.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        slugParts.push(locationSlug);
    }

    if (rent) {
        slugParts.push(String(rent));
    }

    return `/property/${slugParts.join('-')}`;
}

/**
 * Extract property ID from SEO slug
 * Example: "25-2bhk-lalpur-8000" -> 25
 */
export function extractIdFromSlug(slug: string): number {
    const id = parseInt(slug.split('-')[0], 10);
    return isNaN(id) ? 0 : id;
}
