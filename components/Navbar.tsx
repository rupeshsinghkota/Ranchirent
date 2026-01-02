'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Home, Building2, ChevronDown, MapPin, UserCheck } from "lucide-react";
import { localities } from "@/data/localities";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    // Top 10 Popular Localities for Dropdown
    const popularLocalities = [
        "Lalpur", "Bariatu", "Morabadi", "Kanke Road", "Doranda", "Hinoo", "Kokar", "Argora", "Harmu", "Ratu Road"
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition shadow-sm group-hover:shadow-md">
                        <Home className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                        Ranchi<span className="text-blue-600">Rent</span>
                    </span>
                </Link>

                {/* Desktop Nav - Pill */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
                    <NavLink href="/" active={isActive('/')}>Home</NavLink>
                    <NavLink href="/listings" active={isActive('/listings')}>Properties</NavLink>

                    {/* Explore Dropdown */}
                    <div className="relative group">
                        <button className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${pathname.startsWith('/rent') ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                            Explore <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-[400px]">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 overflow-hidden">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block px-2">Popular Areas</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {popularLocalities.map(loc => (
                                        <Link
                                            key={loc}
                                            href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition text-sm font-medium"
                                        >
                                            <MapPin className="w-3.5 h-3.5 opacity-50" />
                                            {loc}
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                                    <Link href="/listings" className="text-xs font-bold text-blue-600 hover:underline">
                                        View All Locations
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>


                    <NavLink href="/blog" active={isActive('/blog')}>Blog</NavLink>
                    <NavLink href="/about" active={isActive('/about')}>About</NavLink>
                    <NavLink href="/contact" active={isActive('/contact')}>Contact</NavLink>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-5">
                    <Link href="/agent" className="text-sm font-semibold text-green-600 hover:text-green-700 transition flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Become Agent
                    </Link>
                    <Link href="/landlord" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        List Property
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <a
                        href="tel:+917557777987"
                        className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-all"
                    >
                        <Phone className="h-4 w-4" />
                        <span>Call Now</span>
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                    <MobileLink href="/" onClick={() => setIsMenuOpen(false)} active={isActive('/')}>Home</MobileLink>
                    <MobileLink href="/listings" onClick={() => setIsMenuOpen(false)} active={isActive('/listings')}>Properties</MobileLink>

                    {/* Mobile Explore Accordion */}
                    <div className="border rounded-xl p-3 bg-gray-50/50">
                        <button
                            className="flex items-center justify-between w-full text-lg font-medium text-gray-700"
                            onClick={() => setIsMobileExploreOpen(!isMobileExploreOpen)}
                        >
                            Explore Areas <ChevronDown className={`w-5 h-5 transition-transform ${isMobileExploreOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMobileExploreOpen && (
                            <div className="grid grid-cols-2 gap-2 mt-3 pl-1">
                                {popularLocalities.map(loc => (
                                    <Link
                                        key={loc}
                                        href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm font-medium text-gray-500 hover:text-blue-600 py-1.5 flex items-center gap-1.5"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                        {loc}
                                    </Link>
                                ))}
                            </div>
                        )}

                    </div>

                    <MobileLink href="/blog" onClick={() => setIsMenuOpen(false)} active={isActive('/blog')}>Blog / Insights</MobileLink>
                    <MobileLink href="/about" onClick={() => setIsMenuOpen(false)} active={isActive('/about')}>About Us</MobileLink>
                    <MobileLink href="/contact" onClick={() => setIsMenuOpen(false)} active={isActive('/contact')}>Contact</MobileLink>
                    <hr className="border-gray-100 my-2" />
                    <MobileLink href="/landlord" onClick={() => setIsMenuOpen(false)} active={isActive('/landlord')}>List Your Property</MobileLink>
                    <MobileLink href="/agent" onClick={() => setIsMenuOpen(false)} active={isActive('/agent')}>💰 Become Agent</MobileLink>
                    <a href="tel:+917557777987" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold mt-2 shadow-md active:scale-95 transition">
                        <Phone className="h-4 w-4" /> Call Now
                    </a>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children, active }: { href: string, children: React.ReactNode, active: boolean }) {
    return (
        <Link
            href={href}
            prefetch={href === "/" ? false : undefined}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
        >
            {children}
        </Link>
    )
}

function MobileLink({ href, children, onClick, active }: { href: string, children: React.ReactNode, onClick: () => void, active: boolean }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            prefetch={href === "/" ? false : undefined}
            className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
        >
            {children}
        </Link>
    )
}
