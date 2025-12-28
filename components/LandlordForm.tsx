"use client";

import { localities } from "@/data/localities";
import { useState } from "react";
import { User, Phone, Building2, MapPin, IndianRupee, Loader2, CheckCircle, Camera, Check } from "lucide-react";

// The MAIN Property Database Script (Same as Admin)
const PROPERTY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykc3VpXhn8FDcRFWYcbmEW9QINOyYwuIcoP9ILTDZS8gZY8u8DP4oj69TdGIp9lzJ4/exec";

export default function LandlordForm() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        owner: "",
        phone: "",
        address: "",
        location: "",
        rent: "",
        deposit: "",
        type: "",
        furnishing: "",
        tenantPref: [] as string[],
        amenities: [] as string[]
    });

    // Helper: Toggle Arrays
    const toggleSelection = (field: "tenantPref" | "amenities", item: string) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(item)) return { ...prev, [field]: list.filter(i => i !== item) };
            return { ...prev, [field]: [...list, item] };
        });
    };

    // File Handling
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (files.length + newFiles.length > 5) {
                alert("Maximum 5 images allowed");
                return;
            }
            const validFiles = newFiles.filter(f => f.size < 4 * 1024 * 1024); // 4MB limit
            setFiles(prev => [...prev, ...validFiles]);
            setPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ImgBB Upload
    const uploadToImgBB = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("https://api.imgbb.com/1/upload?key=639af8c66e1d22558be5338e60d150f5", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.success) return data.data.url;
        throw new Error("Image Upload Failed");
    };

    // Submit Handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            // 1. Upload Images
            const imageUrls = await Promise.all(files.map(uploadToImgBB));

            // 2. Prepare Payload for Main Database
            const payload = {
                owner: formData.owner,
                phone: formData.phone,
                address: formData.address,
                location: formData.location,
                rent: formData.rent,
                deposit: formData.deposit,
                type: formData.type,
                furnishing: formData.furnishing,
                tenantPref: formData.tenantPref.join(", "),
                amenities: formData.amenities.join(", "),
                images: imageUrls, // Array of URLs
                // Status defaults to whatever the sheet script sets (usually new row)
            };

            // 3. Submit
            await fetch(PROPERTY_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            setStatus("success");
            setFormData({
                owner: "", phone: "", address: "", location: "", rent: "", deposit: "",
                type: "", furnishing: "", tenantPref: [], amenities: []
            });
            setFiles([]);
            setPreviews([]);

            // Track Pixel
            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'ListingSubmitted');
            }

        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Listed!</h3>
                <p className="text-gray-500 mb-6">Your property has been submitted to our system. It will be live after a quick verification call.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all"
                >
                    List Another Property
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gray-900 p-6 text-white text-center">
                <h3 className="text-xl font-bold">List Your Property</h3>
                <p className="text-gray-400 text-sm mt-1">Free Listing. Verified Tenants.</p>
            </div>

            {/* Alternative: WhatsApp Listing */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 text-center">
                <a
                    href="https://wa.me/917557777987?text=Hi%20RanchiRent%2C%20I%20want%20to%20list%20my%20property."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center justify-center gap-2"
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4" alt="WA" />
                    Prefer sending details on WhatsApp? Click here
                </a>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 pt-6">

                {/* 1. Owner Details */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Owner Details</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="text" placeholder="Your Name" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="tel" placeholder="Mobile Number" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Property Location */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Location</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Locality</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <select required className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}>
                                    <option value="">Select Locality</option>
                                    {localities.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Address / Landmark</label>
                            <input required type="text" placeholder="e.g. Near Nucleus Mall" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* 3. Property Specs */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Property Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                            <select required className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="">Select Type</option>
                                {["1 RK", "1 BHK", "2 BHK", "3 BHK", "Independent House"].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Furnishing</label>
                            <select required className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                value={formData.furnishing} onChange={e => setFormData({ ...formData, furnishing: e.target.value })}>
                                <option value="">Select</option>
                                {["Unfurnished", "Semi-Furnished", "Full Furnished"].map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input required type="number" placeholder="Rent (₹)" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                value={formData.rent} onChange={e => setFormData({ ...formData, rent: e.target.value })} />
                        </div>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input type="number" placeholder="Deposit (₹)" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* 4. Preferences */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Preferences & Amenities</h4>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Tenant(s)</label>
                        <div className="flex flex-wrap gap-2">
                            {["Any", "Family", "Bachelors (Men)", "Bachelors (Women)", "Students"].map(tag => (
                                <button type="button" key={tag} onClick={() => toggleSelection("tenantPref", tag)}
                                    className={`px-3 py-1 text-xs font-medium rounded-full border transition ${formData.tenantPref.includes(tag) ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {["Parking", "Lift", "Power Backup", "WiFi", "Security", "Western Toilet"].map(tag => (
                                <button type="button" key={tag} onClick={() => toggleSelection("amenities", tag)}
                                    className={`px-3 py-1 text-xs font-medium rounded-full border transition ${formData.amenities.includes(tag) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. Photos */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Photos (Max 5)</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {previews.map((src, i) => (
                            <div key={i} className="relative aspect-square">
                                <img src={src} className="w-full h-full object-cover rounded-lg border border-gray-200" alt="preview" />
                                <button type="button" onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">✕</button>
                            </div>
                        ))}
                        {files.length < 5 && (
                            <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                                <Camera className="w-6 h-6 text-gray-400" />
                                <span className="text-[10px] text-gray-500 mt-1">Add Photo</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFile} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                        {status === "submitting" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Listing Property...
                            </>
                        ) : (
                            "Submit Free Listing"
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        By submitting, you agree to our terms. We protect your privacy.
                    </p>
                </div>
            </form>
        </div>
    );
}
