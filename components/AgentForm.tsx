"use client";

import { localities } from "@/data/localities";
import { useState } from "react";
import { User, Phone, MapPin, IndianRupee, Loader2, CheckCircle, Camera, Video, UserCheck, Wallet } from "lucide-react";

const PROPERTY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyp8XgTvaV63TicaSpZdkrbJMPo77inIqJ5Q451iM5snzagbNH9EivxZf9bd7nFSiO5/exec";

export default function AgentForm() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [agentData, setAgentData] = useState({
        agentName: "",
        agentMobile: "",
        agentUPI: ""
    });

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
        amenities: [] as string[],
        videoLink: ""
    });

    const toggleSelection = (field: "tenantPref" | "amenities", item: string) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(item)) return { ...prev, [field]: list.filter(i => i !== item) };
            return { ...prev, [field]: [...list, item] };
        });
    };

    // Get amenities based on property type
    const getAmenitiesByType = (type: string) => {
        if (type === "PG/Hostel") {
            return ["WiFi", "Meals Included", "Laundry", "Power Backup", "Attached Bathroom", "AC", "Geyser", "RO Water", "CCTV", "Security", "Parking", "TV"];
        }
        if (type === "Shop/Office") {
            return ["Parking", "Power Backup", "AC", "CCTV", "Lift", "Security", "WiFi", "Main Road Facing", "Western Toilet", "RO Water"];
        }
        // Default for Flats/Houses
        return ["Parking", "Lift", "Power Backup", "WiFi", "Security", "Western Toilet", "Geyser", "AC", "RO Water", "Balcony", "Modular Kitchen", "Washing Machine", "Fridge", "TV", "CCTV", "Garden"];
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(f => f.size < 4 * 1024 * 1024);
            setFiles(prev => [...prev, ...validFiles]);
            setPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const imageUrls = await Promise.all(files.map(uploadToImgBB));

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
                images: imageUrls,
                video: formData.videoLink,
                agentName: agentData.agentName,
                agentMobile: agentData.agentMobile,
                agentUPI: agentData.agentUPI
            };

            await fetch(PROPERTY_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            setStatus("success");
            setFormData({
                owner: "", phone: "", address: "", location: "", rent: "", deposit: "",
                type: "", furnishing: "", tenantPref: [], amenities: [], videoLink: ""
            });
            setAgentData({ agentName: "", agentMobile: "", agentUPI: "" });
            setFiles([]);
            setPreviews([]);

            if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'SubmitApplication');
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Submitted!</h3>
                <p className="text-gray-500 mb-4">Your listing is under review. We&apos;ll verify and make it live.</p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
                    <p className="text-green-800 font-semibold">💰 You&apos;ll earn 30% commission when a tenant is confirmed!</p>
                </div>
                <button
                    onClick={() => setStatus("idle")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                    Add Another Property
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-green-600 p-6 text-white text-center">
                <h3 className="text-xl font-bold">Add a Property</h3>
                <p className="text-green-100 text-sm mt-1">Earn 30% commission on every booking</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 pt-6">

                {/* Agent Details (Required) */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest border-b border-gray-100 pb-2">Your Agent Details</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="text" placeholder="Your Name" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-100 outline-none"
                                    value={agentData.agentName} onChange={e => setAgentData({ ...agentData, agentName: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Mobile</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="tel" placeholder="Your Number" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-100 outline-none"
                                    value={agentData.agentMobile} onChange={e => setAgentData({ ...agentData, agentMobile: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">UPI ID</label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="text" placeholder="yourname@upi" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-green-100 outline-none"
                                    value={agentData.agentUPI} onChange={e => setAgentData({ ...agentData, agentUPI: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Owner Details */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Property Owner Details</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="text" placeholder="Owner's Name" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input required type="tel" placeholder="Owner's Mobile" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
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

                {/* Property Specs */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Property Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                            <select required className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="">Select Type</option>
                                {["1 RK", "1 BHK", "2 BHK", "3 BHK", "Independent House", "PG/Hostel", "Shop/Office"].map(t => <option key={t} value={t}>{t}</option>)}
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

                {/* Preferences */}
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
                            {getAmenitiesByType(formData.type).map(tag => (
                                <button type="button" key={tag} onClick={() => toggleSelection("amenities", tag)}
                                    className={`px-3 py-1 text-xs font-medium rounded-full border transition ${formData.amenities.includes(tag) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Photos</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {previews.map((src, i) => (
                            <div key={i} className="relative aspect-square">
                                <img src={src} className="w-full h-full object-cover rounded-lg border border-gray-200" alt="preview" />
                                <button type="button" onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">✕</button>
                            </div>
                        ))}
                        <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                            <Camera className="w-6 h-6 text-gray-400" />
                            <span className="text-[10px] text-gray-500 mt-1">Add Photo</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFile} />
                        </label>
                    </div>
                </div>

                {/* Video Link */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Video Link (Optional)</h4>
                    <div className="relative">
                        <Video className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            type="url"
                            placeholder="Paste YouTube or Google Drive video link"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                            value={formData.videoLink}
                            onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                        {status === "submitting" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit & Earn Commission"
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        30% of brokerage will be paid to your UPI after successful tenant move-in.
                    </p>
                </div>
            </form>
        </div>
    );
}
