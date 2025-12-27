import { Suspense } from "react";
import VerifiedFeed from "@/components/VerifiedFeed";

// Server-side Fetch with Cache and Timeout
async function getProperties() {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6AsKgaiiRMvkqPJOh1EnFllCzFG5grAr2rP3wpPlTXM-U5Xro8TD7uT60ipgHFhV5/exec";

    try {
        // 1 Hour Cache - Static Speed
        const fetchPromise = fetch(SCRIPT_URL, { next: { revalidate: 120 } });

        // 2s Safety Timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 2000)
        );

        const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    } catch (e) {
        console.error("Home properties fetch failed:", e);
        return [];
    }
}

async function PropertiesList() {
    const data = await getProperties();
    const properties = Array.isArray(data) ? data.slice(0, 3) : [];

    return (
        <div className="flex flex-col items-center">
            <VerifiedFeed initialProperties={properties} />

            <div className="mt-8 text-center">
                <a
                    href="/listings"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-full hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg hover:scale-105"
                >
                    View All Verified Properties
                </a>
            </div>
        </div>
    );
}

export default function HomeProperties() {
    return (
        <Suspense fallback={<PropertiesSkeleton />}>
            <PropertiesList />
        </Suspense>
    );
}

function PropertiesSkeleton() {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        {/* Image Skeleton */}
                        <div className="h-64 w-full bg-gray-200 animate-pulse" />

                        <div className="p-5">
                            {/* Title Skeleton */}
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />

                            {/* Price Skeleton */}
                            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-4" />

                            {/* Specs Skeleton */}
                            <div className="flex gap-4 mb-4">
                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* Button Skeleton */}
                            <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
