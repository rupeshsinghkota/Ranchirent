"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Property } from "@/data/properties";

interface SimilarPropertiesProps {
    properties: Property[]; // Using the full Property interface for simplicity
}

export default function SimilarProperties({ properties }: SimilarPropertiesProps) {
    if (!properties || properties.length === 0) return null;

    return (
        <div className="relative">
            {/* Mobile: Horizontal Scroll container */}
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 snap-x snap-mandatory hide-scrollbar">
                {properties.map((p) => (
                    <Link
                        href={`/property/${p.id}`}
                        key={p.id}
                        className="flex-shrink-0 w-[85vw] sm:w-auto snap-center group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="relative w-full aspect-[4/3] sm:h-56 bg-gray-100">
                            <Image
                                src={p.image || "/property-placeholder.png"}
                                alt={p.title}
                                fill
                                sizes="(max-width: 768px) 85vw, 33vw"
                                className="object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                            />

                            {/* Price Overlay */}
                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-sm">
                                {p.price}
                            </div>

                            <div className="absolute top-3 right-3 bg-brand-blue text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                {p.type}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-base font-bold text-gray-900 mb-1 truncate">{p.title}</h3>

                            <div className="flex items-center text-gray-500 text-xs font-medium mb-3">
                                <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                <span className="truncate">{p.location}</span>
                            </div>

                            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-semibold text-brand-blue">View Details</span>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Fade hint for horizontal scroll (Mobile only) */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none sm:hidden" />
        </div>
    );
}
