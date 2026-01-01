"use client";

import { useState } from "react";
import { User, Phone, MapPin, IndianRupee, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { localities } from "@/data/localities";
import { trackConversion } from "@/lib/tracking";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhU5xYa1CVrQWJ49VBEsXhSuk_fcUD6Mo1hzm4IgTnaAiTvuYi1xkOx0plDtS9SEGO/exec"; // Using the contact form script for now, assuming it handles "Type"

export default function TenantRequirementForm({ onSuccess }: { onSuccess?: () => void }) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        locality: "",
        budget: "",
        requirements: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        const payload = {
            Type: "Tenant Requirement",
            Name: formData.name,
            Phone: formData.phone,
            Location: formData.locality,
            Details: `Budget: ${formData.budget} | Requirements: ${formData.requirements}`,
            Status: "New"
        };

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            // Track Conversion (FB + GA)
            trackConversion("Lead");

            setStatus("success");
            if (onSuccess) {
                setTimeout(onSuccess, 3000); // Auto close after 3s if inside modal
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Requirement Posted!</h3>
                <p className="text-gray-600">We will find the best properties for you and contact you shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            required
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            required
                            type="tel"
                            placeholder="Mobile Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <select
                            required
                            value={formData.locality}
                            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                        >
                            <option value="">Select Area</option>
                            {localities.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Max Budget (₹)</label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            required
                            type="number"
                            placeholder="e.g. 10000"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Requirements</label>
                <textarea
                    rows={3}
                    placeholder="e.g. 2 BHK, Ground Floor, Family only, parking needed..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                />
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
                {status === "submitting" ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Posting...
                    </>
                ) : (
                    <>
                        Find Me a Flat <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
            <p className="text-xs text-center text-gray-400">
                We respect your privacy. No spam.
            </p>
        </form>
    );
}
