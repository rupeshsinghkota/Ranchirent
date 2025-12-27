import SearchContainer from "@/components/SearchContainer";

// Server-side Fetch with Cache and Timeout strategy
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6AsKgaiiRMvkqPJOh1EnFllCzFG5grAr2rP3wpPlTXM-U5Xro8TD7uT60ipgHFhV5/exec";

    try {
        // Aggressive Caching: Revalidate every 1 hour (3600 seconds)
        const fetchPromise = fetch(SCRIPT_URL, { next: { revalidate: 120 } });

        // 2.5s Timeout
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

export default async function ListingsContent() {
    // Fetch and Map Data on Server
    const rawData = await getProperties();
    const safeData = Array.isArray(rawData) ? rawData : [];

    // Helper to convert Drive URL
    const getDirectUrl = (url: string | null) => {
        if (!url) return null;
        try {
            if (url.includes("drive.google.com") && url.includes("/d/")) {
                const idMatches = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (idMatches && idMatches[1]) {
                    return `https://drive.google.com/thumbnail?id=${idMatches[1]}&sz=w1000`;
                }
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    const initialProperties = safeData.map((item: any) => {
        const rawImage = item.image ? item.image.split(",")[0] : null;
        return {
            id: item.id,
            title: `${item.type} in ${item.location}`,
            location: item.location,
            price: `₹${Number(item.rent).toLocaleString()}`,
            beds: parseInt(item.type) || 1,
            baths: 1,
            type: item.type,
            furnished: item.furnishing,
            available: true,
            image: getDirectUrl(rawImage),
            description: `Verified ${item.type} available for rent in ${item.location}. Preferred for ${item.tenantPref}.`,
            amenities: item.amenities ? item.amenities.split(", ") : [],
            area: "On Request"
        };
    }).reverse();

    return <SearchContainer initialProperties={initialProperties} />;
}
