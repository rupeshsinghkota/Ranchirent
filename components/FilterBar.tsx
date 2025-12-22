'use client';

import { Search, MapPin } from "lucide-react";
import { localities } from "@/data/localities";

interface FilterBarProps {
    filters: {
        locality: string;
        query: string;
    };
    onLocalityChange: (locality: string) => void;
    onQueryChange: (query: string) => void;
    totalResults: number;
}

export default function FilterBar({ filters, onLocalityChange, onQueryChange, totalResults }: FilterBarProps) {
    return (
        <div className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-grow max-w-4xl">

                        {/* Locality Dropdown */}
                        <div className="relative min-w-[200px]">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MapPin className="h-4 w-4 text-brand-blue" />
                            </div>
                            <select
                                value={filters.locality}
                                onChange={(e) => onLocalityChange(e.target.value)}
                                className="block w-full rounded-lg border-2 border-gray-100 py-2.5 pl-9 pr-8 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-gray-300 transition cursor-pointer"
                            >
                                <option value="">All Locations</option>
                                {localities.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={filters.query}
                                onChange={(e) => onQueryChange(e.target.value)}
                                className="block w-full rounded-lg border-2 border-gray-100 py-2.5 pl-9 pr-4 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-gray-300 transition"
                                placeholder="Search projects or amenities..."
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="hidden md:block whitespace-nowrap text-sm font-semibold text-gray-600">
                        {totalResults} {totalResults === 1 ? 'Property' : 'Properties'} Found
                    </div>
                </div>
            </div>
        </div>
    );
}
