import { Suspense } from 'react';
import ListingsContent from "@/components/ListingsContent";

export const metadata = {
    title: "All Listings | RanchiRent",
    description: "Browse verified flats for rent in Ranchi.",
};

export default function ListingsPage() {
    return (
        <main>
            <Suspense fallback={
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading search results...</p>
                </div>
            }>
                <ListingsContent />
            </Suspense>
        </main>
    );
}
