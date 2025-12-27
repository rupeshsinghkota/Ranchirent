import { Property } from "@/data/properties";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
    properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                    We couldn&apos;t find any properties matching your criteria. Try changing your filters or search term.
                </p>
                <a href="/listings" className="text-brand-blue font-semibold hover:text-blue-700">
                    Clear all filters
                </a>
            </div>
        );
    }

    return (
        <section className="bg-transparent" id="listings">
            <div className="flex flex-col gap-4 sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </section>
    );
}
