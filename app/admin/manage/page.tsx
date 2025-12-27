"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ExternalLink, Pencil, Eye } from "lucide-react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw13SI62o3rbRRLFFs71ICaV8n5-l7JNhI9k8qEUKo1WurDHtFA9JfTt4GrG951barq/exec";

export default function AdminManagePage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(SCRIPT_URL)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setProperties(data.reverse()); // Show newest first
                } else {
                    throw new Error("Invalid data format received");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message || "Something went wrong");
                setLoading(false);
            });
    }, []);

    // Helper to get image
    const getThumbnail = (url: string) => {
        if (!url) return "";
        if (url.includes("drive.google.com") && url.includes("/d/")) {
            const idMatches = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatches) return `https://drive.google.com/thumbnail?id=${idMatches[1]}&sz=w200`;
        }
        return url;
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <Loader2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Listings</h3>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm w-full"
                    >
                        Retry
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        If this persists, check the Google Script or your internet connection.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
                    <Link
                        href="https://docs.google.com/spreadsheets/d/1Z_u1v4i7q9g3k5h6j8f0s2d4q5w8e9r7t6y5u4i3o/edit#gid=0"
                        target="_blank"
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition"
                    >
                        <ExternalLink className="w-4 h-4" /> Open Spreadsheet
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                                        <th className="p-4">Image</th>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Rent</th>
                                        <th className="p-4">Owner</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                    {properties.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={getThumbnail(typeof p.image === 'string' ? p.image.split(",")[0] : "") || "https://via.placeholder.com/100"}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-gray-400">#{p.id || "N/A"}</td>
                                            <td className="p-4 font-bold text-gray-900">{p.type || "Unknown Type"}</td>
                                            <td className="p-4">{p.location || "Unknown"}</td>
                                            <td className="p-4 font-medium">₹{Number(p.rent || 0).toLocaleString()}</td>
                                            <td className="p-4">{p.owner || "-"}</td>
                                            <td className="p-4">{p.phone || "-"}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/property/${p.id}`}
                                                        target="_blank"
                                                        className="text-gray-400 hover:text-brand-blue transition p-1"
                                                        title="View on Site"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href="https://docs.google.com/spreadsheets/d/1Z_u1v4i7q9g3k5h6j8f0s2d4q5w8e9r7t6y5u4i3o/edit#gid=0"
                                                        target="_blank"
                                                        className="text-gray-400 hover:text-green-600 transition p-1"
                                                        title="Edit in Sheet"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
