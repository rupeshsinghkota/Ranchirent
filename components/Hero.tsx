'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Zap, MapPin } from "lucide-react";
import { localities } from "@/data/localities";
import Image from "next/image";

export default function Hero() {
    const router = useRouter();
    const [filters, setFilters] = useState({ locality: "", query: "" });

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (filters.locality) params.set("locality", filters.locality);
        if (filters.query) params.set("query", filters.query);
        router.push(`/listings?${params.toString()}`);
    };

    return (
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.jpg"
                    alt="Modern luxury apartment interior in Ranchi - Find verified flats and PG for rent"
                    fill
                    className="object-cover"
                    priority
                    quality={75}
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center text-white">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 flex justify-center animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm font-medium text-blue-100">
                            <ShieldCheck className="h-4 w-4 text-blue-400" />
                            Verified Listings Only
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight drop-shadow-sm">
                        Find Your Home in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Ranchi</span>
                    </h1>

                    <p className="mb-12 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
                        Experience verified living. Direct connections with owners. <br className="hidden sm:block" /> No brokerage, just pure comfort.
                    </p>

                    {/* Glassmorphism Search Bar */}
                    <div className="mx-auto max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow sm:border-r border-white/10">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <MapPin className="h-5 w-5 text-blue-300" />
                            </div>
                            <select
                                onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value }))}
                                className="block w-full rounded-xl border-0 py-4 pl-12 pr-10 text-white bg-transparent ring-0 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-base font-medium cursor-pointer appearance-none [&>option]:text-black"
                            >
                                <option value="" className="text-gray-500">All Locations</option>
                                {localities.map((loc) => (
                                    <option key={loc} value={loc} className="text-gray-900">{loc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative flex-grow">
                            <input
                                type="text"
                                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                                className="block w-full rounded-xl border-0 py-4 px-6 text-white bg-transparent ring-0 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-base transition"
                                placeholder="Search by Project..."
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition-all duration-200 shrink-0"
                        >
                            <Search className="h-5 w-5" />
                            Search
                        </button>
                    </div>

                    <div className="mt-12 flex justify-center gap-8 text-sm font-medium text-gray-300">
                        <div className="flex items-center gap-2">
                            <div className="bg-amber-500/20 p-2 rounded-lg backdrop-blur-sm">
                                <Zap className="h-5 w-5 text-amber-400" />
                            </div>
                            <span>Instant Visits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-green-500/20 p-2 rounded-lg backdrop-blur-sm">
                                <ShieldCheck className="h-5 w-5 text-green-400" />
                            </div>
                            <span>100% Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
