import { Bed, Bath, MapPin, Phone, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Property } from "@/data/properties";
import { generatePropertySlug } from "@/lib/slugUtils";

interface PropertyProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyProps) {
    // Helper to validate and get safe image URL
    const getImageUrl = (url: string | undefined | null) => {
        if (!url || url === "No Image") return "/property-placeholder.jpg";
        try {
            new URL(url);
            return url;
        } catch {
            return "/property-placeholder.jpg";
        }
    };

    return (
        <div className="group rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row sm:flex-col hover:-translate-y-1 h-28 sm:h-auto">
            {/* Image Placeholder */}
            <Link href={generatePropertySlug(property.id, property.type, property.location)} className="relative w-[32%] sm:w-full sm:aspect-[4/3] flex-shrink-0 bg-gray-100 block group-hover:opacity-95 transition-opacity">
                <Image
                    src={getImageUrl(property.image)}
                    alt={`${property.type} for rent in ${property.location}, Ranchi - ${property.price} per month, ${property.beds} BHK`}
                    fill
                    sizes="(max-width: 768px) 35vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1 z-10 border border-gray-100 uppercase tracking-wider hidden sm:flex">
                    <CheckCircle className="w-3 h-3 text-brand-blue fill-blue-50" /> Verified
                </div>

                <div className="absolute bottom-3 left-3 bg-gray-900/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1 z-10 border border-white/10 uppercase tracking-wide hidden sm:flex">
                    {property.type}
                </div>
            </Link>

            <div className="p-2 sm:p-4 flex flex-col flex-grow justify-between">
                <div>
                    {/* Mobile Header Elements */}
                    <div className="flex sm:hidden justify-between items-center mb-0.5">
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Verified</span>
                        <span className="text-[9px] font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded uppercase tracking-wider">{property.type}</span>
                    </div>

                    <div className="flex justify-between items-start mb-0.5 sm:mb-2 gap-2">
                        <Link href={generatePropertySlug(property.id, property.type, property.location)} className="hover:text-brand-blue transition group-hover:text-brand-blue flex-grow">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 sm:line-clamp-1 leading-tight">{property.title}</h3>
                        </Link>
                        <span className="hidden sm:inline text-base font-bold text-brand-blue whitespace-nowrap">{property.price}<span className="text-xs font-normal text-gray-500">/mo</span></span>
                    </div>
                    {/* Mobile Price */}
                    <p className="sm:hidden text-sm font-bold text-brand-blue leading-tight mb-1">{property.price}<span className="text-[10px] font-normal text-gray-500">/mo</span></p>


                    <div className="flex items-center text-gray-500 text-[10px] sm:text-xs mb-1 sm:mb-4 font-medium">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400 shrink-0" />
                        <Link
                            href={`/rent/${property.location.toLowerCase().replace(/ /g, '-')}`}
                            className="hover:text-brand-blue hover:underline transition-colors truncate"
                        >
                            {property.location}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 border-t border-dashed border-gray-100 pt-3 hidden sm:flex">
                        <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-gray-400" /> <span className="font-semibold">{property.beds}</span> Beds
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-gray-400" /> <span className="font-semibold">{property.baths}</span> Bath
                        </div>
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 hidden sm:grid">
                    <a
                        href={`https://wa.me/919507623858?text=I am interested in ${property.title} at ${property.location}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                    >
                        WhatsApp
                    </a>
                    <Link
                        href={generatePropertySlug(property.id, property.type, property.location)}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
                    >
                        Book
                    </Link>
                </div>
            </div>
        </div>
    );
}
