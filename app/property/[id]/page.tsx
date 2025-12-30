import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Bed, Bath, Ruler, CheckCircle, ArrowLeft } from "lucide-react";
import BookingSection from "@/components/BookingSection";
import PropertyGallery from "@/components/PropertyGallery";
import Link from "next/link";
import SimilarProperties from "@/components/SimilarProperties";

// Server-side Fetch with Cache (60s)
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyp8XgTvaV63TicaSpZdkrbJMPo77inIqJ5Q451iM5snzagbNH9EivxZf9bd7nFSiO5/exec";
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
    } catch {
        return url;
    }
};

// Generate Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const allProperties = await getProperties();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const property = allProperties.find((p: any) => p.id == id);

    if (!property) {
        return {
            title: "Property Not Found | RanchiRent",
            description: "The requested property could not be found."
        };
    }

    const title = `${property.type} for Rent in ${property.location} - ₹${Number(property.rent).toLocaleString()} | RanchiRent`;
    const description = `Verified ${property.type} available in ${property.location}, Ranchi. Rent: ₹${Number(property.rent).toLocaleString()}. Preferred for ${property.tenantPref}. Call Owner/Broker directly.`;
    const image = getDirectUrl(property.image ? property.image.split(",")[0] : "");

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://ranchirent.in/property/${id}`,
            images: image ? [{ url: image }] : [],
            type: "article",
        },
    };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params for Next.js 15+ compatibility
    const { id } = await params;

    // Fetch All Properties (Server Side)
    const allProperties = await getProperties();

    // Find Specific Property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => p.id !== rawProperty.id && (p.location === rawProperty.location || p.type === rawProperty.type))
        .slice(0, 3)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <main className="container mx-auto px-0 sm:px-4 py-0 sm:py-8 lg:py-12 pb-24 lg:pb-12">
            {/* Breadcrumb / Back (Hidden on Mobile, now in Gallery) */}
            <div className="hidden sm:block mb-6 pt-4 sm:pt-0 px-4 sm:px-0">
                <Link href="/listings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-blue transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Listings
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 gap-y-12">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">

                    {/* Header */}
                    {/* Header - Mobile Sheet Top */}
                    <div className="px-5 sm:px-0 pt-6 sm:pt-0 pb-4 sm:pb-0 order-2 sm:order-1 relative z-10 -mt-6 sm:mt-0 bg-white rounded-t-3xl sm:rounded-none shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] sm:shadow-none">

                        {/* Mobile Drag Handle (Visual) */}
                        <div className="sm:hidden w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

                        <div className="flex flex-col gap-2 sm:gap-4 mb-2 sm:mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{property.title}</h1>

                            <div className="flex flex-row items-center justify-between">
                                <Link
                                    href={`/rent/${property.location.toLowerCase().replace(/ /g, '-')}`}
                                    className="flex items-center text-gray-500 font-medium text-sm hover:text-brand-blue transition-colors"
                                >
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-gray-400" />
                                    {property.location}
                                </Link>

                                <div className="text-right sm:hidden">
                                    <span className="block text-2xl font-bold text-brand-blue">
                                        {property.price}
                                        <span className="text-xs text-gray-400 font-medium ml-1">/mo</span>
                                    </span>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <span className="block text-3xl font-bold text-brand-blue">
                                        {property.price}
                                        <span className="text-base text-gray-400 font-medium ml-1">/mo</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Gallery Component */}
                    <div className="order-1 sm:order-2 relative z-auto">
                        <PropertyGallery images={images} title={property.title} />
                    </div>

                    {/* Spec Sheet Strip - Premium Redesign */}
                    <div className="bg-white mx-4 sm:mx-0 relative z-10 rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg sm:shadow-sm p-4 sm:p-6 flex items-center justify-between divide-x divide-gray-100 order-3">
                        <div className="flex flex-col items-center justify-center text-center flex-1 px-2">
                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Config</span>
                            <div className="flex items-center gap-1.5 text-gray-900">
                                <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue opacity-80" />
                                <span className="text-base sm:text-xl font-bold">{property.beds} BHK</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center flex-1 px-2">
                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Baths</span>
                            <div className="flex items-center gap-1.5 text-gray-900">
                                <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue opacity-80" />
                                <span className="text-base sm:text-xl font-bold">{property.baths}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center flex-1 px-2">
                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Area</span>
                            <div className="flex items-center gap-1.5 text-gray-900">
                                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue opacity-80" />
                                <span className="text-base sm:text-xl font-bold">{property.area}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-5 sm:px-0 order-4 relative z-10 bg-white">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">About the Property</h3>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-lg">{property.description}</p>
                    </div>

                    {/* Property Video */}
                    {rawProperty.video && (
                        <div className="px-5 sm:px-0 order-5 relative z-10 bg-white">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Property Video</h3>
                            <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                {rawProperty.video.includes('youtube.com') || rawProperty.video.includes('youtu.be') ? (
                                    <iframe
                                        src={rawProperty.video
                                            .replace('watch?v=', 'embed/')
                                            .replace('youtu.be/', 'www.youtube.com/embed/')
                                            .replace('/shorts/', '/embed/')
                                            .split('?')[0]}
                                        title="Property Video"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : rawProperty.video.includes('drive.google.com') ? (
                                    <iframe
                                        src={rawProperty.video.replace('/view', '/preview')}
                                        title="Property Video"
                                        className="w-full h-full"
                                        allow="autoplay"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video src={rawProperty.video} controls className="w-full h-full" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Amenities */}
                    <div className="px-5 sm:px-0 order-5 relative z-10 bg-white">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Amenities</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {amenities.length > 0 ? amenities.map((item: string) => (
                                <span key={item} className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 text-gray-700 rounded-full text-xs sm:text-sm font-medium border border-gray-100 hover:bg-white hover:shadow-sm transition">
                                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-brand-blue" />
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
                        propertyId={property.id}
                    />
                </div>
            </div>

            {/* Similar Properties Section */}
            {similarProperties.length > 0 && (
                <div className="mt-8 pt-8 sm:mt-24 sm:pt-12 border-t border-gray-100 px-4 sm:px-0">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Similar Properties</h2>
                    </div>
                    <SimilarProperties properties={similarProperties} />
                </div>
            )}

            {/* JSON-LD Schema for Real Estate Listing */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": property.title,
                        "image": images.length > 0 ? images : ["https://ranchirent.in/property-placeholder.png"],
                        "description": property.description,
                        "brand": {
                            "@type": "Brand",
                            "name": "RanchiRent"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://ranchirent.in/property/${property.id}`,
                            "priceCurrency": "INR",
                            "price": rawProperty.rent,
                            "priceValidUntil": "2025-12-31",
                            "availability": "https://schema.org/InStock",
                            "itemCondition": "https://schema.org/NewCondition"
                        }
                    })
                }}
            />
        </main>
    );
}
