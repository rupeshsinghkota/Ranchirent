import { Bed, Bath, MapPin, Phone, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Property } from "@/data/properties";

interface PropertyProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyProps) {
    return (
        <div className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <Image
                    src={property.image || "/property-placeholder.png"}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1 z-10 border border-gray-100 uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3 text-brand-blue fill-blue-50" /> Verified
                </div>

                <div className="absolute bottom-3 left-3 bg-gray-900/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1 z-10 border border-white/10 uppercase tracking-wide">
                    {property.type}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <Link href={`/property/${property.id}`} className="hover:text-brand-blue transition group-hover:text-brand-blue">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                    </Link>
                    <span className="text-base font-bold text-brand-blue whitespace-nowrap">{property.price}<span className="text-xs font-normal text-gray-500">/mo</span></span>
                </div>

                <div className="flex items-center text-gray-500 text-xs mb-4 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    <Link
                        href={`/rent/${property.location.toLowerCase().replace(/ /g, '-')}`}
                        className="hover:text-brand-blue hover:underline transition-colors"
                    >
                        {property.location}
                    </Link>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 border-t border-dashed border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-gray-400" /> <span className="font-semibold">{property.beds}</span> Beds
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-gray-400" /> <span className="font-semibold">{property.baths}</span> Bath
                    </div>
                    {/* Size could go here if available */}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                    <a
                        href={`https://wa.me/917557777987?text=I am interested in ${property.title} at ${property.location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                    >
                        WhatsApp
                    </a>
                    <Link
                        href={`/property/${property.id}`}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
                    >
                        Book
                    </Link>
                </div>
            </div>
        </div>
    );
}
