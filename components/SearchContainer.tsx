'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import PropertyGrid from "@/components/PropertyGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocalitySeoContent from "@/components/LocalitySeoContent";
import { Property } from "@/data/properties"; // Keep interface, remove static data usage
import { Loader2 } from "lucide-react";

// ✅ THE NEW FRESH START URL
// The new deployment URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw13SI62o3rbRRLFFs71ICaV8n5-l7JNhI9k8qEUKo1WurDHtFA9JfTt4GrG951barq/exec";

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
                            <select className="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer">
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Fetching verified properties...</p>
                    </div>
                ) : (
                    <PropertyGrid properties={filteredProperties} />
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
