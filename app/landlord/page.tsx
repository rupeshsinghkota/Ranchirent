import { CheckCircle } from "lucide-react";
import LandlordForm from "@/components/LandlordForm";

export const metadata = {
    title: "List Your Flat for Rent in Ranchi | Free Owner Listing | RanchiRent",
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
                        Find Verified Tenants for <span className="text-brand-blue">Your Flat</span> in Ranchi.
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Join 500+ owners who trust RanchiRent. We handle the marketing, calls, and visits so you don't have to.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8">
                        <p className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-1">Transparent Pricing</p>
                        <p className="text-gray-700 font-medium">
                            We charge 15 days brokerage from Owner & 15 days from Tenant only after a successful agreement. No upfront fees.
                        </p>
                    </div>

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
                                <h3 className="font-bold text-gray-900 text-lg">Fair Brokerage</h3>
                                <p className="text-gray-500">50% rent from Owner + 50% from Tenant. Paid only upon finding you the right tenant.</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick WhatsApp Option */}
                    <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">In a hurry?</h3>
                        <p className="text-gray-600 mb-4">Skip the form. Send us photos and details on WhatsApp directly.</p>
                        <a
                            href="https://wa.me/917557777987?text=Hi%20RanchiRent%2C%20I%20want%20to%20list%20my%20property."
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20bd5a] transition shadow-lg hover:shadow-green-200"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 filter brightness-0 invert" alt="WhatsApp icon" />
                            List via WhatsApp
                        </a>
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
