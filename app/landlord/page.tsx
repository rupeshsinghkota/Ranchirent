import { CheckCircle } from "lucide-react";
import LandlordForm from "@/components/LandlordForm";

export const metadata = {
    title: "List Your Property | RanchiRent",
    description: "Landlords/Owners: List your flat for rent in Ranchi for free.",
};

export default function LandlordPage() {
    return (
        <main className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                {/* Left Column: value Prop */}
                <div>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue font-bold text-sm tracking-wide mb-6">
                        FOR PROPERTY OWNERS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        List Your Flat for <span className="text-brand-blue">FREE</span> in Ranchi.
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Join 500+ owners who found verified tenants through RanchiRent. We handle the marketing, you handle the keys.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 highlight-card hover:border-blue-100 transition">
                            <div className="bg-blue-100 p-3 rounded-lg text-brand-blue">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">We Handle Everything</h3>
                                <p className="text-gray-500">We find the tenant, show the flat, and handle closing.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 highlight-card hover:border-blue-100 transition">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Verified Tenants</h3>
                                <p className="text-gray-500">We verify identity and employment of every lead.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 highlight-card hover:border-blue-100 transition">
                            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Fast Closure</h3>
                                <p className="text-gray-500">Most properties get rented within 7 days.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-blue/5 rounded-3xl transform rotate-3 scale-105 z-0"></div>
                    <div className="relative z-10">
                        <LandlordForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
