'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { trackConversion } from '@/lib/tracking';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhU5xYa1CVrQWJ49VBEsXhSuk_fcUD6Mo1hzm4IgTnaAiTvuYi1xkOx0plDtS9SEGO/exec";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const payload = {
            Type: "Inquiry",
            Name: formData.name,
            Phone: formData.phone,
            Details: formData.message,
            Location: "General Inquiry",
            Status: "New"
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // Track Conversion (FB + GA)
            trackConversion("Contact");

            setStatus("success");
            setFormData({
                name: "",
                phone: "",
                message: ""
            });
        } catch (error) {
            console.error("Error submitting form", error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-8">Thanks for reaching out. We&apos;ll get back to you shortly.</p>
                <button
                    onClick={() => {
                        setFormData({ name: "", phone: "", message: "" });
                        setStatus("idle");
                    }}
                    className="text-brand-blue font-bold hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue transition"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue transition"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue transition"
                ></textarea>
            </div>

            {status === "error" && (
                <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
}
