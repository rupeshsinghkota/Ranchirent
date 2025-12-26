"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, ArrowRight, Camera } from "lucide-react";

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
                    <h2 className="text-3xl font-extrabold text-gray-900">Fresh from the Field</h2>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {properties.map((p) => {
                    const imageUrl = getDirectUrl(p.image);
                    const imageCount = p.image.split(",").length;

                    return (
                        <Link
                            href={`/property/${p.id}`}
                            key={p.id}
                            className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative h-72 overflow-hidden">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt="Property"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs font-medium">No Image Available</div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white/90 backdrop-blur-md text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        Verified
                                    </span>
                                </div>

                                {imageCount > 1 && (
                                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                                        <Camera className="w-3 h-3" />
                                        +{imageCount - 1}
                                    </div>
                                )}

                                <div className="absolute bottom-5 left-5 text-white">
                                    <p className="text-2xl font-bold tracking-tight">₹ {p.rent.toLocaleString()}<span className="text-sm font-normal opacity-90">/mo</span></p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow relative bg-white">

                                <div className="mb-4 flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                                            <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                                            <span className="truncate max-w-[200px]">{p.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-blue-100">
                                            <Bed className="w-3.5 h-3.5" /> {p.type || "Flat"}
                                        </span>
                                        <span className="inline-flex items-center bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-gray-100">
                                            {p.furnishing || "Unfurnished"}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                                        {p.amenities}
                                    </p>
                                </div>

                                <div className="pt-5 border-t border-gray-100 mt-auto flex items-center justify-between">
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
