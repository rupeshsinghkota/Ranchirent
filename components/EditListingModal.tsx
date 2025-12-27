"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Camera } from "lucide-react";
import { localities } from "@/data/localities";

interface EditListingModalProps {
    property: any;
    onClose: () => void;
    onSuccess: () => void;
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6AsKgaiiRMvkqPJOh1EnFllCzFG5grAr2rP3wpPlTXM-U5Xro8TD7uT60ipgHFhV5/exec";

export default function EditListingModal({ property, onClose, onSuccess }: EditListingModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        owner: "",
        phone: "",
        address: "",
        location: "",
        rent: "",
        deposit: "",
        type: "",
        furnishing: "",
        tenantPref: "",
        amenities: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (property) {
            setFormData({
                owner: property.owner || "",
                phone: property.phone || "",
                address: property.address || "",
                location: property.location || "",
                rent: property.rent?.toString() || "",
                deposit: property.deposit?.toString() || "",
                type: property.type || "",
                furnishing: property.furnishing || "",
                tenantPref: property.tenantPref || "",
                amenities: property.amenities || ""
            });

            // Parse existing images
            if (property.image && typeof property.image === 'string') {
                const imageUrls = property.image.split(',').map((url: string) => url.trim()).filter((url: string) => url);
                setExistingImages(imageUrls);
            }
        }
    }, [property]);

    // File Handling
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const totalImages = existingImages.length + files.length + newFiles.length;
            if (totalImages > 5) {
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

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Upload new images
            const newImageUrls = await Promise.all(files.map(uploadToImgBB));

            // Combine existing and new images
            const allImageUrls = [...existingImages, ...newImageUrls];

            const payload = {
                action: "edit",
                id: property.id,
                owner: formData.owner,
                phone: formData.phone,
                address: formData.address,
                location: formData.location,
                rent: formData.rent,
                deposit: formData.deposit,
                type: formData.type,
                furnishing: formData.furnishing,
                tenantPref: formData.tenantPref,
                amenities: formData.amenities,
                images: allImageUrls
            };

            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Edit failed:", error);
            alert("Failed to update listing. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-900 text-white p-6 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold">Edit Listing #{property.id}</h2>
                    <button onClick={onClose} className="hover:bg-gray-800 p-2 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Owner Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Owner Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.owner}
                                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Location</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Locality</label>
                                <select
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                >
                                    <option value="">Select Locality</option>
                                    {localities.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Property Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                >
                                    <option value="">Select Type</option>
                                    {["1 RK", "1 BHK", "2 BHK", "3 BHK", "Independent House"].map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Furnishing</label>
                                <select
                                    required
                                    value={formData.furnishing}
                                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                >
                                    <option value="">Select</option>
                                    {["Unfurnished", "Semi-Furnished", "Full Furnished"].map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Rent (₹)</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.rent}
                                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Deposit (₹)</label>
                                <input
                                    type="number"
                                    value={formData.deposit}
                                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Preferences</h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tenant Preference</label>
                            <input
                                type="text"
                                placeholder="e.g. Family, Bachelors"
                                value={formData.tenantPref}
                                onChange={(e) => setFormData({ ...formData, tenantPref: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Amenities</label>
                            <input
                                type="text"
                                placeholder="e.g. Parking, WiFi, Lift"
                                value={formData.amenities}
                                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none"
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Property Images (Max 5)</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {/* Existing Images */}
                            {existingImages.map((src, i) => (
                                <div key={`existing-${i}`} className="relative aspect-square">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} className="w-full h-full object-cover rounded-lg border border-gray-200" alt="existing" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                                        OLD
                                    </div>
                                </div>
                            ))}

                            {/* New Image Previews */}
                            {previews.map((src, i) => (
                                <div key={`new-${i}`} className="relative aspect-square">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} className="w-full h-full object-cover rounded-lg border border-gray-200" alt="preview" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-green-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                                        NEW
                                    </div>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {(existingImages.length + files.length) < 5 && (
                                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                                    <Camera className="w-6 h-6 text-gray-400" />
                                    <span className="text-[10px] text-gray-500 mt-1">Add Photo</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFile} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
