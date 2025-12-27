"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Camera } from "lucide-react";

// The same Script URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw13SI62o3rbRRLFFs71ICaV8n5-l7JNhI9k8qEUKo1WurDHtFA9JfTt4GrG951barq/exec";

interface SheetProperty {
    id: number;
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
                setProperties(data.slice(0, 6)); // Show latest 6
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

            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
                {properties.map((p) => {
                    const imageUrl = getDirectUrl(p.image);
                    const imageCount = p.image.split(",").length;

                    return (
                        <Link
                            href={`/property/${p.id}`}
                            key={p.id}
                            className="group relative bg-white border border-gray-100 rounded-xl md:rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 block md:h-full flex flex-row md:flex-col items-stretch h-28 md:h-auto"
                        >
                            {/* Image Container */}
                            <div className="relative w-[32%] md:w-full md:h-72 flex-shrink-0 bg-gray-100">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt="Property"
                                        fill
                                        sizes="(max-width: 768px) 35vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs font-medium">No Image</div>
                                )}

                                {/* Overlay (Desktop Only) */}
                                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Badges (Desktop Only) */}
                                <div className="hidden md:flex absolute top-4 left-4 gap-2">
                                    <span className="bg-white/90 backdrop-blur-md text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        Verified
                                    </span>
                                </div>

                                {/* Price (Desktop Overlay) */}
                                <div className="hidden md:block absolute bottom-5 left-5 text-white">
                                    <p className="text-2xl font-bold tracking-tight">₹ {p.rent.toLocaleString()}<span className="text-sm font-normal opacity-90">/mo</span></p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-2 md:p-6 flex flex-col flex-grow relative bg-white justify-between">

                                {/* Mobile Header */}
                                <div className="block md:hidden mb-0.5">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Verified</span>
                                        {imageCount > 1 && <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><Camera className="w-3 h-3" /> +{imageCount - 1}</span>}
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 leading-tight">₹ {p.rent.toLocaleString()}</h3>
                                </div>

                                <div className="md:mb-4 md:flex-grow">
                                    <div className="flex items-start justify-between mb-0.5 md:mb-2 text-gray-500 font-medium text-[10px] md:text-sm">
                                        <div className="flex items-center gap-1 md:gap-1.5">
                                            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-brand-blue shrink-0" />
                                            <span className="truncate max-w-[120px] md:max-w-[200px]">{p.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1 md:mt-4">
                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide border border-blue-100">
                                            {p.type || "Flat"}
                                        </span>
                                        <span className="inline-flex items-center bg-gray-50 text-gray-600 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide border border-gray-100">
                                            {p.furnishing || "Unfurnished"}
                                        </span>
                                    </div>

                                    <p className="hidden md:block mt-4 text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                                        {p.amenities}
                                    </p>
                                </div>

                                <div className="hidden md:flex pt-5 border-t border-gray-100 mt-auto items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Details</span>
                                    <div className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:bg-blue-600 transition-all duration-300">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
