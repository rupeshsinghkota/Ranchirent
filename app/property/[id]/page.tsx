import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Ruler, CheckCircle, ArrowLeft } from "lucide-react";
import BookingSection from "@/components/BookingSection";
import PropertyGallery from "@/components/PropertyGallery";
import Link from "next/link";
import VerifiedFeed from "@/components/VerifiedFeed";

// Server-side Fetch with Cache (60s)
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw13SI62o3rbRRLFFs71ICaV8n5-l7JNhI9k8qEUKo1WurDHtFA9JfTt4GrG951barq/exec";
    try {
        const res = await fetch(SCRIPT_URL, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

// Helper to convert Drive URL
const getDirectUrl = (url: string) => {
    if (!url) return "";
    try {
        const firstUrl = url.trim();
        if (firstUrl.includes("drive.google.com")) {
            const parts = firstUrl.split(/\/d\/|id=/);
            if (parts.length > 1) {
                const id = parts[1].split(/\//)[0].split(/\?/)[0];
                if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
            }
        }
        return firstUrl;
    } catch (e) {
        return url;
    }
};

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params for Next.js 15+ compatibility
    const { id } = await params;

    // Fetch All Properties (Server Side)
    const allProperties = await getProperties();

    // Find Specific Property
    const rawProperty = allProperties.find((p: any) => p.id == id); // Loose equality for string/number

    if (!rawProperty) {
        return notFound();
    }

    // Process Data
    const rawImages = rawProperty.image ? rawProperty.image.split(",") : [];
    const images = rawImages.map(getDirectUrl);
    const amenities = rawProperty.amenities ? rawProperty.amenities.split(", ") : [];

    const property = {
        ...rawProperty,
        title: `${rawProperty.type} in ${rawProperty.location}`,
        price: `₹${Number(rawProperty.rent).toLocaleString()}`,
        beds: parseInt(rawProperty.type) || 1,
        baths: 1, // Default from sheet logic
        area: "On Request",
        description: `Verified ${rawProperty.type} available for rent in ${rawProperty.location}. Preferred for ${rawProperty.tenantPref}. ${rawProperty.furnishing}.`,
    };

    // Filter "Similar" Properties (Same Location or Same Type)
    const similarProperties = allProperties
        .filter((p: any) => p.id !== rawProperty.id && (p.location === rawProperty.location || p.type === rawProperty.type))
        .slice(0, 3)
        .map((item: any) => ({
            id: item.id,
            title: `${item.type} in ${item.location}`,
            location: item.location,
            price: `₹${Number(item.rent).toLocaleString()}`,
            beds: parseInt(item.type) || 1,
            baths: 1,
            type: item.type,
            furnished: item.furnishing,
            available: true,
            image: getDirectUrl(item.image ? item.image.split(",")[0] : ""),
            description: `Verified ${item.type} in ${item.location}`,
            amenities: item.amenities ? item.amenities.split(", ") : [],
            area: "On Request"
        }));


    return (
        <main className="container mx-auto px-4 py-8 lg:py-12">
            {/* Breadcrumb / Back */}
            <div className="mb-6">
                <Link href="/listings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-blue transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Listings
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 gap-y-12">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">{property.title}</h1>
                                <div className="flex items-center justify-start text-gray-500 font-medium">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                                    <Link href={`/rent/${property.location.toLowerCase().replace(/ /g, '-')}`} className="hover:text-brand-blue hover:underline transition-colors">
                                        {property.location}
                                    </Link>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="block text-3xl font-bold text-brand-blue">{property.price}<span className="text-base text-gray-400 font-medium">/mo</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Premium Gallery Component */}
                    <PropertyGallery images={images} title={property.title} />

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
                            {amenities.length > 0 ? amenities.map((item: string) => (
                                <span key={item} className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100 hover:bg-white hover:shadow-sm transition">
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

            {/* Similar Properties Section */}
            {similarProperties.length > 0 && (
                <div className="mt-24 pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Properties You Might Like</h2>
                    {/* Reuse VerifiedFeed but passed filtered list */}
                    <VerifiedFeed initialProperties={similarProperties} />
                </div>
            )}
        </main>
    );
}
