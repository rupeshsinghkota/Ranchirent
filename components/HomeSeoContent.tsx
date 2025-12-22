import { MapPin, Home, Key, ShieldCheck } from "lucide-react";

export default function HomeSeoContent() {
    return (
        <section className="bg-white py-16 border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Renting in Ranchi Made Easy
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover your perfect home with RanchiRent. From **budget-friendly student flats in Lalpur** and **spacious family homes in Bariatu** to **exclusive luxury apartments on Kanke Road**, we simplify your search for the best rental properties in Ranchi.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Wide Coverage Across Ranchi</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Explore verified listings across Ranchi's most sought-after neighborhoods, including **Lalpur, Kokar, Bariatu, Morabadi, Doranda, and Harmu**. We take pride in our **100% Physical Verification** promise—every property listed is inspected by our team to guarantee authenticity and quality.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Key className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Flexible Rental Options</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Choose from a wide range of **Owner-Direct Listings** for zero-brokerage savings, or opt for our premium **Guided Visit Service** for a concierge experience—complete with scheduled viewings, price negotiation, and paperwork assistance.
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Home className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Wide Range of Homes</h3>
                            </div>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li><strong>1 BHK Flats:</strong> Affordable options from ₹6,000/mo. Ideal for students & bachelors.</li>
                                <li><strong>2 BHK Apartments:</strong> Comfortable living starting at ₹10,000/mo. Perfect for small families.</li>
                                <li><strong>Luxury 3 BHK & Villas:</strong> Premium residences from ₹18,000/mo. offering top-tier amenities.</li>
                                <li><strong>Independent Houses:</strong> Spacious garden homes available in prime areas like Kanke & Bariatu.</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">More Than Just Listings</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                RanchiRent is your complete relocation partner. Beyond connecting you with homes, we assist with **Rental Agreements, Police Verification**, and even **Movers & Packers coordination** to ensure a seamless transition.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
