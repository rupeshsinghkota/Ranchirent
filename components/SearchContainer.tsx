'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import PropertyGrid from "@/components/PropertyGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocalitySeoContent from "@/components/LocalitySeoContent";
import { Property } from "@/data/properties"; // Keep interface, remove static data usage
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import { Loader2, ArrowRight } from "lucide-react";
import LeadCaptureModal from "@/components/LeadCaptureModal";

// ✅ THE NEW FRESH START URL
// The new deployment URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzI5WNYtNecLvSDpPl0wavFIUj4jhTyeOYHXqRkJxrCfTxUEfURvWN4LfGY_BRUha31/exec";

interface SearchContentProps {
    initialProperties?: Property[];
}

function SearchContent({ initialProperties = [] }: SearchContentProps) {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        locality: searchParams.get("locality") || "",
        query: searchParams.get("query") || ""
    });

    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [loading, setLoading] = useState(initialProperties.length === 0);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    // Update filters if URL params change
    // Update filters if URL params change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilters({
            locality: searchParams.get("locality") || "",
            query: searchParams.get("query") || ""
        });
    }, [searchParams]);

    // Fetch Properties if not provided (Client-Side Fallback)
    useEffect(() => {
        if (initialProperties.length > 0) return;

        const fetchProperties = async () => {
            try {
                const res = await fetch(SCRIPT_URL);
                const data = await res.json();

                // Helper to convert Drive URL to Direct Image URL
                const getDirectUrl = (url: string | null) => {
                    if (!url) return null;
                    try {
                        // Check if it's a Drive Viewer URL
                        if (url.includes("drive.google.com") && url.includes("/d/")) {
                            const idMatches = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
                            if (idMatches && idMatches[1]) {
                                // Use Thumbnail API
                                return `https://drive.google.com/thumbnail?id=${idMatches[1]}&sz=w1000`;
                            }
                        }
                        return url;
                    } catch (e) {
                        return url;
                    }
                };

                // Map Sheet Data to Website Property Interface
                const mappedProperties: Property[] = data.map((item: any) => {
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
                        image: getDirectUrl(rawImage), // Use helper
                        description: `Verified ${item.type} available for rent in ${item.location}. Preferred for ${item.tenantPref}.`,
                        amenities: item.amenities ? item.amenities.split(", ") : [],
                        area: "On Request"
                    };
                }).reverse();

                setProperties(mappedProperties);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch properties:", error);
                setLoading(false);
            }
        };

        fetchProperties();
    }, [initialProperties]);

    const [sortBy, setSortBy] = useState("Newest First");

    // ... (keep existing effects)

    const filteredProperties = properties.filter((property) => {
        // Filter by Locality
        if (filters.locality && !property.location.toLowerCase().includes(filters.locality.toLowerCase())) {
            return false;
        }

        // Filter by Query
        if (filters.query) {
            const term = filters.query.toLowerCase();
            const matchesQuery =
                property.title.toLowerCase().includes(term) ||
                property.location.toLowerCase().includes(term) ||
                property.description.toLowerCase().includes(term);

            if (!matchesQuery) return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === "Price: Low to High") {
            const priceA = parseInt(a.price.replace(/[^\d]/g, "")) || 0;
            const priceB = parseInt(b.price.replace(/[^\d]/g, "")) || 0;
            return priceA - priceB;
        }
        if (sortBy === "Price: High to Low") {
            const priceA = parseInt(a.price.replace(/[^\d]/g, "")) || 0;
            const priceB = parseInt(b.price.replace(/[^\d]/g, "")) || 0;
            return priceB - priceA;
        }
        // Default: Newest First (Assuming array is initially fetched newest first, we keep it index order or if there were a date field)
        // Since api returns reverse() order initially, and we trust that order for "Newest", we don't need to re-sort if it's default, 
        // BUT if user switches back to Newest, we need to respect original order. 
        // Ideally we would have an ID or Date. Assuming ID is roughly chronological or original index.
        // For now, let's assume the order in 'properties' is Newest First.
        // We will just return 0 to preserve filtered order, which preserves original order.
        return 0;
    });

    const breadcrumbItems = [
        { label: "Rent", href: "/listings" },
        ...(filters.locality ? [{ label: filters.locality }] : [])
    ];

    const pageTitle = filters.locality
        ? `Flats in ${filters.locality}`
        : "Find Your Dream Home";

    const pageSubtitle = filters.locality
        ? `Explore curated rental properties in ${filters.locality}. Verified and brokerage-free.`
        : "Browse verified flats, houses, and apartments in Ranchi. Direct owner contact.";

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Filter Bar */}
            <div className="pt-20 pb-0">
                <FilterBar
                    filters={filters}
                    onLocalityChange={(locality) => setFilters(prev => ({ ...prev, locality }))}
                    onQueryChange={(query) => setFilters(prev => ({ ...prev, query }))}
                    totalResults={filteredProperties.length}
                />
            </div>

            <div className="container mx-auto px-4 pt-1 pb-4 md:py-8 flex-grow">
                {/* Premium Header Section */}
                <div className="mb-2 md:mb-8 border-b border-gray-100 pb-2 md:pb-8">
                    <div className="hidden md:block">
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>

                    <div className="mt-2 md:mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-brand-blue font-bold tracking-wider text-[10px] md:text-xs uppercase mb-1 md:mb-2 block">
                                {filters.locality ? "Locality View" : "All Properties"}
                            </span>
                            <h1 className="text-xl md:text-4xl font-extrabold text-gray-900 mb-1 md:mb-3 truncate">
                                {pageTitle}
                            </h1>
                            <p className="text-gray-500 max-w-2xl text-lg leading-relaxed hidden md:block">
                                {pageSubtitle}
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                            <span className="text-xs font-bold text-gray-500 uppercase px-2">Sort</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer"
                            >
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Floating "Post Requirement" Button (Mobile/Tablet) */}
                <div className="fixed bottom-6 right-6 z-40 md:hidden">
                    <button
                        onClick={() => setIsLeadModalOpen(true)}
                        className="bg-gray-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-in zoom-in slide-in-from-bottom-4"
                    >
                        <span className="text-sm">Post Requirement</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <PropertyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        <PropertyGrid properties={filteredProperties} />

                        {/* End of List CTA */}
                        <div className="mt-12 bg-blue-50 rounded-2xl p-8 md:p-12 text-center border border-blue-100">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                                Still looking for the perfect home?
                            </h3>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Don&apos;t settle. Tell us exactly what you need, and we&apos;ll find it for you personally.
                            </p>
                            <button
                                onClick={() => setIsLeadModalOpen(true)}
                                className="bg-brand-blue hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                Post Your Requirement
                            </button>
                        </div>
                    </>
                )}

                {/* Dynamic SEO Content (Only if locality is selected) */}
                {filters.locality && (
                    <div className="mt-12">
                        <LocalitySeoContent locality={filters.locality} />
                    </div>
                )}

                {/* Area Navigation Strip */}
                <div className="mt-20 pt-12 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Neighborhoods</h3>
                    <div className="flex flex-wrap gap-3">
                        {["Lalpur", "Bariatu", "Morabadi", "Kanke Road", "Doranda", "Hinoo", "Kokar", "Argora", "Harmu", "Ratu Road", "Ashok Nagar"].map((loc) => (
                            <Link
                                key={loc}
                                href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.locality === loc
                                    ? "bg-brand-blue text-white shadow-md"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-blue"
                                    }`}
                            >
                                {loc}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
        </div>
    );
}

export default function SearchContainer({ initialProperties }: SearchContentProps) {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchContent initialProperties={initialProperties} />
        </Suspense>
    );
}
