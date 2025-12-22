"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Phone } from "lucide-react";

interface BookingSectionProps {
    propertyTitle: string;
    propertyLocation: string;
    propertyPrice: string;
}

export default function BookingSection({ propertyTitle, propertyLocation, propertyPrice }: BookingSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100/50">
            <div className="sm:hidden mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-brand-blue">{propertyPrice}</span>
                    <span className="text-base text-gray-500 font-medium">/mo</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Interested in this property?</h3>
            <p className="text-sm text-gray-500 mb-6">Book a visit now or chat with us for more details.</p>

            <div className="space-y-3">
                <a
                    href={`https://wa.me/917557777987?text=Hi, I saw ${propertyTitle} in ${propertyLocation} on RanchiRent.in. Need more info.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white py-3.5 text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                >
                    Chat on WhatsApp
                </a>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-blue py-3.5 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all"
                >
                    Book Visit
                </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-center text-gray-400 mb-2">Safe & Secure • Posted by Owner</p>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyTitle={propertyTitle}
                propertyLocation={propertyLocation}
            />
        </div>
    );
}
