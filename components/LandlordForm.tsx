"use client";

import { useState } from "react";
import { User, Phone, Building2, MapPin, IndianRupee, Loader2, CheckCircle } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhU5xYa1CVrQWJ49VBEsXhSuk_fcUD6Mo1hzm4IgTnaAiTvuYi1xkOx0plDtS9SEGO/exec";

// Extend Window interface for Facebook Pixel
declare global {
    interface Window {
        fbq: any;
    }
}

export default function LandlordForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        type: "2 BHK",
        location: "",
        rent: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const dataToSend = {
            Type: "Landlord",
            Name: formData.name,
            Phone: formData.phone,
            Location: formData.location,
            Details: `${formData.type} - Rent: ₹${formData.rent}`,
            Status: "New"
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            setStatus("success");

            // Track Lead in Facebook Pixel
            if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'Lead');
            }

            setFormData({ name: "", phone: "", type: "2 BHK", location: "", rent: "" }); // Reset form
        } catch (error) {
            console.error("Error submitting form", error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h3>
                <p className="text-gray-500 mb-6">We will call you shortly to verify the details and schedule a photoshoot.</p>
                <div className="space-y-3">
                    <button
                        onClick={() => window.open("https://wa.me/917557777987", "_blank")}
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        Chat on WhatsApp
                    </button>
                    <button
                        onClick={() => setStatus("idle")}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all"
                    >
                        Submit Another Property
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-6 text-white text-center">
                <h3 className="text-xl font-bold">List Your Property Now</h3>
                <p className="text-blue-100 text-sm mt-1">Get verified tenants quickly.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Owner Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {/* Property Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Type</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 text-gray-900 appearance-none cursor-pointer"
                            >
                                <option value="1 RK">1 RK / Studio</option>
                                <option value="1 BHK">1 BHK</option>
                                <option value="2 BHK">2 BHK</option>
                                <option value="3 BHK">3 BHK</option>
                                <option value="4+ BHK">4+ BHK / Villa</option>
                                <option value="Independent House">Independent House</option>
                            </select>
                        </div>
                    </div>

                    {/* Expected Rent */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expected Rent (₹/mo)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                name="rent"
                                required
                                value={formData.rent}
                                onChange={handleChange}
                                placeholder="e.g. 15000"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Locality / Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Lalpur, near Nucleus Mall"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-gray-50 text-gray-900"
                        />
                    </div>
                </div>

                {status === "error" && (
                    <p className="text-red-500 text-sm text-center">Connection failed. Please check internet or WhatsApp us.</p>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                        {status === "loading" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting Details...
                            </>
                        ) : (
                            "List My Property"
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-3">
                        By submitting, you agree to receive inquiries from RanchiRent.
                    </p>
                </div>
            </form>
        </div>
    );
}
