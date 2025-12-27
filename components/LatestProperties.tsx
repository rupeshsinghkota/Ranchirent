import VerifiedFeed from "@/components/VerifiedFeed";

// Server-side Fetch with Cache and Timeout strategy
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyw3yzDyA43pTUmt_VjrF5-_Dc-kgwCycmKucpD5AYqiQ5GeZWWKS6z-VHaHxg6GOmF/exec";

    try {
        // Aggressive Caching: Revalidate every 1 hour (3600 seconds)
        // This ensures users almost ALWAYS hit the fast Next.js cache
        // instead of waiting for Google Script.
        const fetchPromise = fetch(SCRIPT_URL, { next: { revalidate: 120 } });

        // 2.5s Timeout - slightly more generous since we rely on cache mostly
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 2500)
        );

        const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    } catch (e) {
        console.error("Server fetch failed or timed out:", e);
        return [];
    }
}

export default async function LatestProperties() {
    const properties = await getProperties();
    // Safety check if properties is not an array
    const safeProperties = Array.isArray(properties) ? properties : [];
    const latestProperties = safeProperties.slice(0, 6);

    return <VerifiedFeed initialProperties={latestProperties} />;
}
