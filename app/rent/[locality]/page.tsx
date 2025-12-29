import { localities } from "@/data/localities";
import PropertyGrid from "@/components/PropertyGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocalitySeoContent from "@/components/LocalitySeoContent";

// Helper to Fetch Data with Cache & Timeout (Reused Pattern)
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzI5WNYtNecLvSDpPl0wavFIUj4jhTyeOYHXqRkJxrCfTxUEfURvWN4LfGY_BRUha31/exec";

    try {
        const fetchPromise = fetch(SCRIPT_URL, { next: { revalidate: 120 } });
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 2500)
        );

        const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    } catch (e) {
        console.error("Locality fetch failed:", e);
        return [];
    }
}

export async function generateStaticParams() {
    return localities.map((loc) => ({
        locality: loc.toLowerCase().replace(/ /g, "-"),
    }));
}

export async function generateMetadata(
    props: {
        params: Promise<{ locality: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    const localityName = localities.find(
        (l) => l.toLowerCase().replace(/ /g, "-") === params.locality
    );

    if (!localityName) {
        return {
            title: "Locality Not Found",
        };
    }

    const title = `Flats for Rent in ${localityName}, Ranchi | Verified Owners`;
    const description = `Find verified 1 BHK, 2 BHK, 3 BHK flats for rent in ${localityName}, Ranchi. Zero brokerage options, guided visits, and direct owner contact.`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://www.ranchirent.in/rent/${params.locality}`,
            siteName: "RanchiRent",
            locale: "en_IN",
            type: "website",
        },
    };
}

export default async function LocalityPage(
    props: {
        params: Promise<{ locality: string }>;
    }
) {
    const params = await props.params;
    const localityName = localities.find(
        (l) => l.toLowerCase().replace(/ /g, "-") === params.locality
    );

    if (!localityName) {
        notFound();
    }

    // Fetch REAL Data
    const rawData = await getProperties();
    const safeData = Array.isArray(rawData) ? rawData : [];

    // Helper to convert Drive URL (Reused Pattern)
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

    const allProperties = safeData.map((item: any) => {
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


    // Filter Real Data
    const filteredProperties = allProperties.filter((p) =>
        p.location.toLowerCase().includes(localityName.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Breadcrumbs items={[
                        { label: "Rent in Ranchi", href: "/listings" },
                        { label: localityName }
                    ]} />
                    <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
                        <div>
                            <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-2 block">
                                Localities in Ranchi
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                                Flats in <span className="text-brand-blue">{localityName}</span>
                            </h1>
                            <p className="text-gray-500 max-w-2xl text-lg">
                                Explore {filteredProperties.length} verified rental properties in {localityName}.
                                Book a guided visit today.
                            </p>
                        </div>
                        {filteredProperties.length > 0 && (
                            <div className="bg-blue-50 px-4 py-2 rounded-lg text-brand-blue font-bold text-sm whitespace-nowrap">
                                {filteredProperties.length} Properties
                            </div>
                        )}
                    </div>
                </div>

                <PropertyGrid properties={filteredProperties} />

                <LocalitySeoContent locality={localityName} />
            </div>
        </main>
    );
}
