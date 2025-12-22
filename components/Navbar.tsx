'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Home, Building2 } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
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
                    <NavLink href="/about" active={isActive('/about')}>About</NavLink>
                    <NavLink href="/contact" active={isActive('/contact')}>Contact</NavLink>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-5">
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
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                    <MobileLink href="/" onClick={() => setIsMenuOpen(false)} active={isActive('/')}>Home</MobileLink>
                    <MobileLink href="/listings" onClick={() => setIsMenuOpen(false)} active={isActive('/listings')}>Properties</MobileLink>
                    <MobileLink href="/about" onClick={() => setIsMenuOpen(false)} active={isActive('/about')}>About Us</MobileLink>
                    <MobileLink href="/contact" onClick={() => setIsMenuOpen(false)} active={isActive('/contact')}>Contact</MobileLink>
                    <hr className="border-gray-100 my-2" />
                    <MobileLink href="/landlord" onClick={() => setIsMenuOpen(false)} active={isActive('/landlord')}>List Your Property</MobileLink>
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
            className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
        >
            {children}
        </Link>
    )
}
