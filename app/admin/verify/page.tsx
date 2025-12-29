"use client";

import { localities } from "@/data/localities";
import { useState } from "react";
import { Camera, Check, Loader2 } from "lucide-react";

// The new deployment URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLAG4AvsxJvex5a_wBP_EkF1PoL46p41g67SCnxQ2H5h-TeXc4omr9qZxFCU2YGUPh/exec";

export default function FreshVerificationPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [form, setForm] = useState({
        owner: "",
        phone: "",
        address: "", // Changed from flat
        location: "",
        rent: "",
        deposit: "",
        type: "",         // New
        furnishing: "",   // New
        tenantPref: [] as string[],   // Changed to Array
        amenities: [] as string[]
    });

    const toggleAmenity = (item: string) => {
        setForm(prev => {
            if (prev.amenities.includes(item)) return { ...prev, amenities: prev.amenities.filter(i => i !== item) };
            return { ...prev, amenities: [...prev.amenities, item] };
        });
    };

    const toggleTenantPref = (item: string) => {
        setForm(prev => {
            if (prev.tenantPref.includes(item)) return { ...prev, tenantPref: prev.tenantPref.filter(i => i !== item) };
            return { ...prev, tenantPref: [...prev.tenantPref, item] };
        });
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            // Limit to 5 images total
            if (files.length + newFiles.length > 5) {
                alert("Maximum 5 images allowed");
                return;
            }

            // Size check (Max 4MB per file to be safe)
            const validFiles = newFiles.filter(f => f.size < 4 * 1024 * 1024);
            if (validFiles.length < newFiles.length) alert("Some files skipped (Max 4MB each)");

            setFiles(prev => [...prev, ...validFiles]);

            // Create previews
            const newPreviews = validFiles.map(f => URL.createObjectURL(f));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Upload to ImgBB
    const uploadToImgBB = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        // API Key provided by user
        const res = await fetch("https://api.imgbb.com/1/upload?key=639af8c66e1d22558be5338e60d150f5", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.success) return data.data.url;
        throw new Error("ImgBB Upload Failed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            // 1. Upload Images using ImgBB
            const imageUrls = await Promise.all(files.map(uploadToImgBB));

            // 2. Send Data (Images are just links now!)
            const payload = {
                owner: form.owner,
                phone: form.phone,
                address: form.address,
                location: form.location,
                rent: form.rent,
                deposit: form.deposit,
                type: form.type,
                furnishing: form.furnishing,
                tenantPref: form.tenantPref.join(", "), // Join array to string
                amenities: form.amenities.join(", "),
                images: imageUrls, // Array of Strings
            };

            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            setStatus("success");
            setForm({
                owner: "", phone: "", address: "", location: "", rent: "", deposit: "",
                type: "", furnishing: "", tenantPref: [], amenities: []
            });
            setFiles([]);
            setPreviews([]);
            window.scrollTo(0, 0);

        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified!</h2>
                    <p className="text-gray-500 mb-6">Data saved to your new sheet.</p>
                    <button onClick={() => setStatus("idle")} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">Add Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-800">New Verification</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-4">

                {/* Contact */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <label className="text-xs font-bold text-blue-600 uppercase">Owner Details</label>
                    <input required placeholder="Owner Name" className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} />
                    <input required type="tel" placeholder="Phone Number" className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>

                {/* Property */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <label className="text-xs font-bold text-blue-600 uppercase">Property Info</label>

                    {/* Location Dropdown */}
                    <select required className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                        <option value="">Select Location (Public)</option>
                        {localities.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>

                    <textarea required rows={2} placeholder="Full Address (Private - Sheet Only)" className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                        <input required type="number" placeholder="Rent (₹)" className="p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.rent} onChange={e => setForm({ ...form, rent: e.target.value })} />
                        <input type="number" placeholder="Deposit (₹)" className="p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.deposit} onChange={e => setForm({ ...form, deposit: e.target.value })} />
                    </div>
                </div>

                {/* Details: Type, Furnishing, Preferred */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <label className="text-xs font-bold text-blue-600 uppercase">Details</label>

                    {/* Type */}
                    <select required className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="">Property Type</option>
                        {["1 RK", "1 BHK", "2 BHK", "3 BHK", "Independent House", "Single Room"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Furnishing */}
                    <select required className="w-full p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        value={form.furnishing} onChange={e => setForm({ ...form, furnishing: e.target.value })}>
                        <option value="">Furnishing Status</option>
                        {["Unfurnished", "Semi-Furnished", "Full Furnished"].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>

                    {/* Tenant Preference - Multi Select */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Preferred Tenant (Select Multiple)</label>
                        <div className="flex flex-wrap gap-2">
                            {["Any", "Family", "Bachelors (Men)", "Bachelors (Women)", "Students"].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => toggleTenantPref(p)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition ${form.tenantPref.includes(p)
                                        ? "bg-purple-600 text-white border-purple-600"
                                        : "bg-gray-50 text-gray-600 border-gray-200"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        {form.tenantPref.length === 0 && <p className="text-xs text-red-400 mt-1">Please select at least one.</p>}
                    </div>
                </div>

                {/* Amenities */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <label className="text-xs font-bold text-blue-600 uppercase mb-3 block">Quick Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {["Parking", "Lift", "Power Backup", "WiFi", "Security", "Furnished", "Attached Washroom", "Common Washroom", "Western Toilet", "Indian Toilet"].map(tag => (
                            <button key={tag} type="button" onClick={() => toggleAmenity(tag)}
                                className={`px-3 py-1.5 text-sm rounded-full border transition ${form.amenities.includes(tag) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Photo Upload (Multi) */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <label className="text-xs font-bold text-blue-600 uppercase mb-3 block">Property Photos (Max 5)</label>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {previews.map((src, i) => (
                            <div key={i} className="relative aspect-square">
                                <img src={src} alt="Uploaded Property" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                                <button type="button" onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">✕</button>
                            </div>
                        ))}

                        {files.length < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                                <Camera className="w-6 h-6 text-gray-400" />
                                <span className="text-[10px] text-gray-500 font-medium mt-1">Add</span>
                                <input type="file" multiple accept="image/*" onChange={handleFile} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={status === "submitting"} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                    {status === "submitting" ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save to Sheet"}
                </button>

            </form>
        </div>
    );
}
