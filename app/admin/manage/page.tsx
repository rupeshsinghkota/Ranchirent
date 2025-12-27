"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Eye, Pencil, Power } from "lucide-react";
import EditListingModal from "@/components/EditListingModal";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyw3yzDyA43pTUmt_VjrF5-_Dc-kgwCycmKucpD5AYqiQ5GeZWWKS6z-VHaHxg6GOmF/exec";
const ADMIN_PASSWORD = "Sheikh8051@";

export default function AdminManagePage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingProperty, setEditingProperty] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    const fetchProperties = () => {
        setLoading(true);
        fetch(`${SCRIPT_URL}?key=ranchi_admin_secure`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setProperties(data.reverse());
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
    };

    useEffect(() => {
        // Check if already authenticated
        const auth = localStorage.getItem("admin_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
            fetchProperties();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("admin_auth", "true");
            fetchProperties();
            setAuthError("");
        } else {
            setAuthError("Incorrect password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_auth");
        setPassword("");
    };

    const handleSuspendToggle = async (property: any) => {
        const action = property.isSuspended ? "activate" : "suspend";
        const confirmMsg = property.isSuspended
            ? "Activate this listing? It will be visible to users."
            : "Suspend this listing? It will be hidden from users.";

        if (!confirm(confirmMsg)) return;

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: action,
                    id: property.id
                })
            });

            fetchProperties();
        } catch (error) {
            console.error("Suspend/Activate failed:", error);
            alert("Failed to update listing status. Please try again.");
        }
    };

    // Helper to get image
    const getThumbnail = (url: string) => {
        if (!url) return "";
        if (url.includes("drive.google.com") && url.includes("/d/")) {
            const idMatches = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatches) return `https://drive.google.com/thumbnail?id=${idMatches[1]}&sz=w200`;
        }
        return url;
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
                        <p className="text-gray-500 text-sm">Enter password to manage listings</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                                placeholder="Enter admin password"
                                autoFocus
                            />
                            {authError && (
                                <p className="text-red-500 text-xs mt-2 text-center">{authError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm hover:bg-red-200 transition"
                    >
                        Logout
                    </button>
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
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${p.isSuspended ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                        {p.type || "Unknown Type"}
                                                    </span>
                                                    {p.isSuspended && (
                                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] font-bold rounded uppercase">
                                                            Suspended
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">{p.location || "Unknown"}</td>
                                            <td className="p-4 font-medium">₹{Number(p.rent || 0).toLocaleString()}</td>
                                            <td className="p-4">{p.owner || p.Owner || p.OwnerName || p.name || "-"}</td>
                                            <td className="p-4">{p.phone || p.Phone || p.Mobile || p.contact || "-"}</td>
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
                                                    <button
                                                        onClick={() => setEditingProperty(p)}
                                                        className="text-gray-400 hover:text-green-600 transition p-1"
                                                        title="Edit Listing"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSuspendToggle(p)}
                                                        className={`transition p-1 ${p.isSuspended ? 'text-gray-400 hover:text-green-600' : 'text-gray-400 hover:text-red-600'}`}
                                                        title={p.isSuspended ? "Activate Listing" : "Suspend Listing"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
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

            {editingProperty && (
                <EditListingModal
                    property={editingProperty}
                    onClose={() => setEditingProperty(null)}
                    onSuccess={() => {
                        fetchProperties();
                        setEditingProperty(null);
                    }}
                />
            )}
        </div>
    );
}
