"use client";

import { X } from "lucide-react";
import TenantRequirementForm from "@/components/TenantRequirementForm";
import { useEffect } from "react";

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-brand-blue p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-extrabold mb-1">Detailed Requirement</h2>
                        <p className="text-blue-100 text-sm">Tell us exactly what you need. We'll find it.</p>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8">
                    <TenantRequirementForm onSuccess={onClose} />
                </div>
            </div>
        </div>
    );
}
