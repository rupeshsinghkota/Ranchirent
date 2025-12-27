"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ExternalLink } from "lucide-react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw13SI62o3rbRRLFFs71ICaV8n5-l7JNhI9k8qEUKo1WurDHtFA9JfTt4GrG951barq/exec";

export default function AdminManagePage() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(SCRIPT_URL)
            .then((res) => res.json())
            .then((data) => {
                setProperties(data.reverse()); // Show newest first
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
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
                                                        src={getThumbnail(p.image?.split(",")[0]) || "https://via.placeholder.com/100"}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-gray-400">#{p.id}</td>
                                            <td className="p-4 font-bold text-gray-900">{p.type}</td>
                                            <td className="p-4">{p.location}</td>
                                            <td className="p-4 font-medium">₹{Number(p.rent).toLocaleString()}</td>
                                            <td className="p-4">{p.owner}</td>
                                            <td className="p-4">{p.phone}</td>
                                            <td className="p-4 text-right">
                                                <Link
                                                    href={`/property/${p.id}`}
                                                    target="_blank"
                                                    className="inline-block text-brand-blue hover:underline text-xs font-bold"
                                                >
                                                    View
                                                </Link>
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
