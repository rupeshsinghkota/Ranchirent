import { properties } from "@/data/properties";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Ruler, CheckCircle, Phone } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import BookingSection from "@/components/BookingSection";

export async function generateStaticParams() {
    return properties.map((property) => ({
        id: property.id.toString(),
    }));
}

export async function generateMetadata(
    props: {
        params: Promise<{ id: string }>;
    }
): Promise<Metadata> {
    const params = await props.params;
    const property = properties.find((p) => p.id === parseInt(params.id));

    if (!property) {
        return {
            title: "Property Not Found",
        };
    }

    return {
        title: `${property.title} in ${property.location} | RanchiRent`,
        description: `Verified ${property.beds} BHK for rent. ${property.price}/mo. ${property.description}`,
        openGraph: {
            title: property.title,
            description: property.description,
            images: ['/og-placeholder.jpg']
        }
    };
}

export default async function PropertyPage(
    props: {
        params: Promise<{ id: string }>;
    }
) {
    const params = await props.params;
    const property = properties.find((p) => p.id === parseInt(params.id));

    if (!property) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid lg:grid-cols-3 gap-8 gap-y-12">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">{property.title}</h1>
                                <div className="flex items-center text-gray-500 font-medium">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                                    {property.location}
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="block text-3xl font-bold text-brand-blue">{property.price}<span className="text-base text-gray-400 font-medium">/mo</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100">
                        <div className="col-span-2 row-span-2 relative bg-gray-100">
                            <Image
                                src={property.image || "/property-placeholder.png"}
                                alt={property.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5 z-10 border border-gray-100/50">
                                <CheckCircle className="w-4 h-4 text-brand-blue" /> Verified
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 relative bg-gray-100">
                            <Image src="/property-placeholder.png" alt="Gallery" fill className="object-cover opacity-80 hover:opacity-100 transition" />
                        </div>
                        <div className="col-span-1 row-span-1 relative bg-gray-100">
                            <Image src="/property-placeholder.png" alt="Gallery" fill className="object-cover opacity-80 hover:opacity-100 transition" />
                        </div>
                        <div className="col-span-1 row-span-1 relative bg-gray-100">
                            <Image src="/property-placeholder.png" alt="Gallery" fill className="object-cover opacity-80 hover:opacity-100 transition" />
                        </div>
                        <div className="col-span-1 row-span-1 relative bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-sm cursor-pointer hover:bg-gray-200 transition">
                            +3 Photos
                        </div>
                    </div>

                    {/* Spec Sheet Strip */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Config</span>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Bed className="w-5 h-5 text-gray-400" />
                                <span className="text-xl font-bold">{property.beds} BHK</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center border-x border-gray-100">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Bathrooms</span>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Bath className="w-5 h-5 text-gray-400" />
                                <span className="text-xl font-bold">{property.baths}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Area</span>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Ruler className="w-5 h-5 text-gray-400" />
                                <span className="text-xl font-bold">{property.area}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About the Property</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                            {property.amenities.map((item) => (
                                <span key={item} className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100">
                                    <CheckCircle className="w-4 h-4 mr-2 text-brand-blue" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right Column) */}
                <div className="lg:col-span-1">
                    <BookingSection
                        propertyTitle={property.title}
                        propertyLocation={property.location}
                        propertyPrice={property.price}
                    />
                </div>
            </div>
            {/* Area Navigation Strip */}
            <div className="mt-16 pt-12 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Neighborhoods</h3>
                <div className="flex flex-wrap gap-3">
                    {["Lalpur", "Bariatu", "Morabadi", "Kanke Road", "Doranda", "Hinoo", "Kokar", "Argora", "Harmu", "Ratu Road", "Ashok Nagar"].map((loc) => (
                        <a
                            key={loc}
                            href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 hover:text-brand-blue transition-all"
                        >
                            {loc}
                        </a>
                    ))}
                </div>
            </div>
        </main>
    );
}
