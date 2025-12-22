'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import PropertyGrid from "@/components/PropertyGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocalitySeoContent from "@/components/LocalitySeoContent";
import { properties } from "@/data/properties";

function SearchContent() {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        locality: searchParams.get("locality") || "",
        query: searchParams.get("query") || ""
    });

    // Update filters if URL params change (e.g. back button)
    useEffect(() => {
        setFilters({
            locality: searchParams.get("locality") || "",
            query: searchParams.get("query") || ""
        });
    }, [searchParams]);

    const filteredProperties = properties.filter((property) => {
        // Filter by Locality
        if (filters.locality && !property.location.includes(filters.locality)) {
            return false;
        }

        // Filter by Query (if present)
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

    // Determine content based on filters
    const pageTitle = filters.locality
        ? `Flats in ${filters.locality}`
        : "Find Your Dream Home";

    const pageSubtitle = filters.locality
        ? `Explore curated rental properties in ${filters.locality}. Verified and brokerage-free.`
        : "Browse verified flats, houses, and apartments in Ranchi. Direct owner contact.";

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Filter Bar */}
            <div className="pt-20 pb-4">
                <FilterBar
                    filters={filters}
                    onLocalityChange={(locality) => setFilters(prev => ({ ...prev, locality }))}
                    onQueryChange={(query) => setFilters(prev => ({ ...prev, query }))}
                    totalResults={filteredProperties.length}
                />
            </div>

            <div className="container mx-auto px-4 py-8 flex-grow">
                {/* Premium Header Section */}
                <div className="mb-8 border-b border-gray-100 pb-8">
                    <Breadcrumbs items={breadcrumbItems} />

                    <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-2 block">
                                {filters.locality ? "Locality View" : "All Properties"}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                                {pageTitle}
                            </h1>
                            <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
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

                <PropertyGrid properties={filteredProperties} />

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
                            <a
                                key={loc}
                                href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.locality === loc
                                    ? "bg-brand-blue text-white shadow-md"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-brand-blue"
                                    }`}
                            >
                                {loc}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchContainer() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchContent />
        </Suspense>
    );
}
