"use client";

import { usePathname } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingContactButtons() {
    // Optional: Hide on specific pages if needed, e.g., inside a booking modal or admin panel
    // const pathname = usePathname();
    // if (pathname.includes('/admin')) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-2 gap-3">
                <a
                    href="tel:+917557777987"
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-gray-800 active:scale-95 transition-all text-sm"
                >
                    <Phone className="w-4 h-4" />
                    Call Now
                </a>
                <a
                    href="https://wa.me/917557777987?text=Hi,%20I%20am%20looking%20for%20a%20flat%20in%20Ranchi."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl shadow-sm hover:bg-[#128C7E] active:scale-95 transition-all text-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                </a>
            </div>
            {/* Safety padding for iPhones with home indicator is handled by pb-safe or just general bottom padding of the page content */}
        </div>
    );
}
