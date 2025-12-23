'use client';

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Ruler, CheckCircle, Phone, Loader2, Camera, ArrowRight } from "lucide-react";
import Image from "next/image";
import BookingSection from "@/components/BookingSection";

// ✅ THE NEW FRESH START URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw13SI62o3rbRRLFFs71ICaV8n5-l7JNhI9k8qEUKo1WurDHtFA9JfTt4GrG951barq/exec";

interface SheetProperty {
    id: number;
    location: string;
    rent: number;
    deposit: number;
    amenities: string;
    image: string;
    type: string;
    furnishing: string;
    tenantPref: string;
}

export default function PropertyPage(
    props: {
        params: Promise<{ id: string }>;
    }
) {
    // Unwrap params using React.use() or await (Next.js 15 pattern, but for client component we need to handle plain promise or hook)
    // Since we are in 'use client', props.params is a Promise in recent Next.js versions.
    // For safety in this environment, let's use the `use` hook or simple state if supported, 
    // but easier is to just unwrap it in useEffect or use `use(props.params)` if React 19/Next 15.
    // Let's assume standard Next.js behavior where we can use `use` or standard async handling.

    // WORKAROUND: In client components, params might not be a promise in older versions, 
    // but in newer ones it is. Let's use a standard `useEffect` to unwrap if needed or access directly.
    // Actually, `use` hook is best.
    const params = use(props.params);

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(SCRIPT_URL);
                const data = await res.json();
                console.log("Fetched Data:", data);

                // Find Property by ID
                const pId = parseInt(params.id);
                const found = data.find((p: any) => p.id === pId);
                console.log("Params ID:", params.id, "Parsed:", pId, "Found:", found);

                if (found) {
                    // Process Images
                    const rawImages = found.image ? found.image.split(",") : [];
                    console.log("Raw Images:", rawImages);

                    const processedImages = rawImages.map((url: string) => getDirectUrl(url));
                    console.log("Processed Images:", processedImages);

                    setProperty({
                        ...found,
                        title: `${found.type} in ${found.location}`,
                        price: `₹${Number(found.rent).toLocaleString()}`,
                        beds: parseInt(found.type) || 1,
                        baths: 1, // Default
                        area: "On Request",
                        description: `Verified ${found.type} available for rent in ${found.location}. Preferred for ${found.tenantPref}. ${found.furnishing}.`,
                        amenitiesList: found.amenities ? found.amenities.split(", ") : []
                    });
                    setImages(processedImages);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch property:", error);
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params.id]);

    // Helper to convert Drive URL to Direct Image URL
    const getDirectUrl = (url: string) => {
        if (!url) return "";
        try {
            const firstUrl = url.trim();
            // Match /d/ID/ or /d/ID or id=ID
            if (firstUrl.includes("drive.google.com")) {
                let id = "";
                const parts = firstUrl.split(/\/d\/|id=/);
                if (parts.length > 1) {
                    // Get the part after /d/ or id=
                    const afterId = parts[1].split(/\//)[0].split(/\?/)[0];
                    if (afterId) id = afterId;
                }

                if (id) {
                    // Use Thumbnail API (Official & Reliable)
                    // Config 'drive.google.com' must be whitelisted (It is now)
                    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
                }
            }
            return firstUrl;
        } catch (e) {
            return url;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading property details...</p>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h1>
                <p className="text-gray-500">The property you are looking for does not exist or has been removed.</p>
                <a href="/listings" className="mt-6 px-6 py-2 bg-brand-blue text-white rounded-full font-bold">Back to Listings</a>
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid lg:grid-cols-3 gap-8 gap-y-12">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">{property.title}</h1>
                                <div className="flex items-center text-gray-500 font-medium">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                                    {property.location}
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="block text-3xl font-bold text-brand-blue">{property.price}<span className="text-base text-gray-400 font-medium">/mo</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Grid (Dynamic) */}
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100">
                        {/* Main Image */}
                        <div className="col-span-2 row-span-2 relative bg-gray-100">
                            {images[0] ? (
                                <img
                                    src={images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5 z-10 border border-gray-100/50">
                                <CheckCircle className="w-4 h-4 text-brand-blue" /> Verified
                            </div>
                        </div>

                        {/* Smaller Images */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="col-span-1 row-span-1 relative bg-gray-100">
                                {images[i] ? (
                                    <img src={images[i]} alt="Gallery" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 text-xs">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Spec Sheet Strip */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Config</span>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Bed className="w-5 h-5 text-gray-400" />
                                <span className="text-xl font-bold">{property.beds} BHK</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center border-x border-gray-100">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Bathrooms</span>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Bath className="w-5 h-5 text-gray-400" />
                                <span className="text-xl font-bold">{property.baths}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Area</span>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Ruler className="w-5 h-5 text-gray-400" />
                                <span className="text-xl font-bold">{property.area}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About the Property</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                            {property.amenitiesList.length > 0 ? property.amenitiesList.map((item: string) => (
                                <span key={item} className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                                    <CheckCircle className="w-4 h-4 mr-2 text-brand-blue" />
                                    {item}
                                </span>
                            )) : <span className="text-gray-400 text-sm">No specific amenities listed.</span>}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right Column) */}
                <div className="lg:col-span-1">
                    <BookingSection
                        propertyTitle={property.title}
                        propertyLocation={property.location}
                        propertyPrice={property.price}
                    />
                </div>
            </div>

            {/* Area Navigation Strip */}
            <div className="mt-16 pt-12 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Neighborhoods</h3>
                <div className="flex flex-wrap gap-3">
                    {["Lalpur", "Bariatu", "Morabadi", "Kanke Road", "Doranda", "Hinoo", "Kokar", "Argora", "Harmu", "Ratu Road", "Ashok Nagar"].map((loc) => (
                        <a
                            key={loc}
                            href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 hover:text-brand-blue transition-all"
                        >
                            {loc}
                        </a>
                    ))}
                </div>
            </div>

            {/* Add fixed bottom bar for mobile booking if needed later */}
        </main>
    );
}
