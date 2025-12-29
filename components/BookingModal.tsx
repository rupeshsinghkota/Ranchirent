"use client";

import { useState } from "react";
import { X, Calendar, User, Phone, CheckCircle, Loader2 } from "lucide-react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyTitle: string;
    propertyLocation: string;
    propertyId: string | number;
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhU5xYa1CVrQWJ49VBEsXhSuk_fcUD6Mo1hzm4IgTnaAiTvuYi1xkOx0plDtS9SEGO/exec";

export default function BookingModal({ isOpen, onClose, propertyTitle, propertyLocation, propertyId }: BookingModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                full: d.toLocaleDateString('en-GB') // DD/MM/YYYY - Matching Mobile Format
            });
        }
        return dates;
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const formData = {
            Type: "Tenant",
            Name: name,
            Phone: phone,
            Location: propertyLocation,
            Details: `Booking for: ${propertyTitle} (ID: ${propertyId}) on ${date}`,
            Status: "New"
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Crucial for Google Apps Script
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // Track Facebook Pixel Conversion
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Schedule');
            }

            setStatus("success");
            // Optional: Reset form after success delay or keep success state
        } catch (error) {
            console.error("Error submitting form", error);
            setStatus("error");
        }
    };

    const handleWhatsAppRedirect = () => {
        const message = `Hello, I submitted a booking request for *${propertyTitle}* (ID: ${propertyId}).\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Date:* ${date}`;
        window.open(`https://wa.me/917557777987?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden relative">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Book a Visit</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Success State */}
                {status === "success" ? (
                    <div className="p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                        <p className="font-bold text-brand-blue mb-1">Ref ID: #{propertyId}</p>
                        <p className="text-gray-500 mb-8">We have received your details. Our team will call you shortly to confirm the time.</p>

                        <button
                            onClick={handleWhatsAppRedirect}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mb-3"
                        >
                            Message on WhatsApp (Faster)
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    /* Form State */
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your mobile number"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-gray-900 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <div
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 cursor-pointer flex items-center justify-between transition bg-white ${showDatePicker ? 'ring-2 ring-blue-100 border-blue-500' : 'hover:border-gray-300'}`}
                                    >
                                        <span className={date ? "text-gray-900" : "text-gray-400"}>
                                            {date || "Select a Date"}
                                        </span>
                                    </div>

                                    {/* Smart Date Picker List Overlay */}
                                    {showDatePicker && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                                            <div className="sticky top-0 bg-gray-50 border-b border-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Select Date (Next 14 Days)
                                            </div>
                                            {generateDates().map((item, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setDate(item.full);
                                                        setShowDatePicker(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-brand-blue/5 border-b border-gray-50 last:border-0 flex items-center justify-between group transition-colors"
                                                >
                                                    <span className="text-gray-500 font-medium group-hover:text-brand-blue">{item.day}</span>
                                                    <span className="text-gray-900 font-bold group-hover:text-brand-blue">{item.date}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {status === "error" && (
                            <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-brand-blue hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Request...
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-500">
                            We will confirm via call/WhatsApp shortly.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
