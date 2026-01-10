"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Phone } from "lucide-react";

interface BookingSectionProps {
    propertyTitle: string;
    propertyLocation: string;
    propertyPrice: string;
    propertyId: string | number;
}

export default function BookingSection({ propertyTitle, propertyLocation, propertyPrice, propertyId }: BookingSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleWhatsAppClick = () => {
        // Track WhatsApp clicks as Leads
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', 'WhatsAppButtonClick');
        }
    };

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <div className="hidden md:block sticky top-24 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg shadow-gray-100/50">
                <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-brand-blue">{propertyPrice}</span>
                        <span className="text-base text-gray-500 font-medium">/mo</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">Interested in this property?</h3>
                <p className="text-sm text-gray-500 mb-6">Book a visit now or chat with us for more details.</p>

                <div className="space-y-3">
                    <a
                        href={`https://wa.me/919507623858?text=Hi, I saw ${propertyTitle} (ID: ${propertyId}) in ${propertyLocation} on RanchiRent.in. Need more info.`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        onClick={handleWhatsAppClick}
                        className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white py-3.5 text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                    >
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600"><Phone className="w-3 h-3 fill-current" /></span>
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
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 flex items-center gap-3 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
                <a
                    href={`https://wa.me/919507623858?text=Hi, I saw ${propertyTitle} in ${propertyLocation} on RanchiRent.in. Need more info.`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={handleWhatsAppClick}
                    className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-bold text-gray-700 active:scale-95 transition"
                >
                    <span className="text-xs font-normal text-gray-500">More Info</span>
                    <span>WhatsApp</span>
                </a>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-[2] flex flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-blue py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 active:scale-95 transition"
                >
                    <span className="text-[10px] font-medium text-blue-100 uppercase tracking-wide">Schedule</span>
                    <span className="text-base">Book Visit</span>
                </button>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyTitle={propertyTitle}
                propertyLocation={propertyLocation}
                propertyId={propertyId}
            />
        </>
    );
}
