"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Camera } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/data/properties";

// The same Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykc3VpXhn8FDcRFWYcbmEW9QINOyYwuIcoP9ILTDZS8gZY8u8DP4oj69TdGIp9lzJ4/exec";

interface SheetProperty {
    id: number;
    owner: string;
    phone: string;
    address: string;
    location: string;
    rent: number;
    deposit: number;
    amenities: string;
    image: string;
    type: string;
    furnishing: string;
    tenantPref: string;
}

interface VerifiedFeedProps {
    initialProperties?: SheetProperty[];
}

export default function VerifiedFeed({ initialProperties = [] }: VerifiedFeedProps) {
    const [properties, setProperties] = useState<SheetProperty[]>(initialProperties);
    const [loading, setLoading] = useState(initialProperties.length === 0);

    useEffect(() => {
        if (initialProperties.length > 0) return;

        fetch(SCRIPT_URL)
            .then(res => res.json())
            .then(data => {
                setProperties(data.slice(0, 8)); // Show latest 8
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load properties", err);
                setLoading(false);
            });
    }, [initialProperties]);

    // Helper to convert Drive URL to Direct Image URL
    const getDirectUrl = (url: string) => {
        if (!url) return "";
        try {
            // Handle comma separated list
            const firstUrl = url.split(",")[0];

            // Check if it's a Drive Viewer URL
            if (firstUrl.includes("drive.google.com") && firstUrl.includes("/d/")) {
                const idMatches = firstUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (idMatches && idMatches[1]) {
                    // Use Thumbnail API
                    return `https://drive.google.com/thumbnail?id=${idMatches[1]}&sz=w1000`;
                }
            }
            return firstUrl;
        } catch (e) {
            return url.split(",")[0];
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading verified properties...</div>;
    if (properties.length === 0) return null; // Hide if no data

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <span className="text-green-600 font-bold tracking-wider text-xs uppercase mb-2 block">Just Verified</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Fresh from the Field</h2>
                </div>
            </div>

            <div className="flex flex-col gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((p) => {
                    // Adapt SheetProperty to Property interface
                    const adaptedProperty: Property = {
                        id: p.id,
                        title: `${p.type} in ${p.location}`,
                        location: p.location,
                        price: `₹ ${p.rent.toLocaleString()}`,
                        type: p.type,
                        image: getDirectUrl(p.image),
                        beds: parseInt(p.type.split(" ")[0]) || 2, // Extract "2" from "2 BHK"
                        baths: 1, // Default as sheet doesn't have this yet
                        area: "N/A",
                        available: true,
                        furnished: p.furnishing || "Unfurnished",
                        description: "Verified Property",
                        amenities: p.amenities ? p.amenities.split(",") : []
                    };

                    return (
                        <PropertyCard key={p.id} property={adaptedProperty} />
                    );
                })}
            </div>
        </section>
    );
}
