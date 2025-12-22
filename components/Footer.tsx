import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column (4 Cols) */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block mb-6 group">
                            <span className="text-3xl font-black tracking-tight text-white group-hover:text-gray-100 transition">
                                Ranchi<span className="text-brand-blue">Rent</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm">
                            We are Ranchi's verified rental marketplace. Bridging the gap between owners and tenants with trust, transparency, and technology.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/ranchirent/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                                <span className="font-bold">Ig</span>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61585765550042" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                                <span className="font-bold">Fb</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all hover:scale-110">
                                <span className="font-bold">Li</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Access (2 Cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400 font-medium">
                            <li><Link href="/about" className="hover:text-brand-blue transition hover:pl-1">About Us</Link></li>
                            <li><Link href="/listings" className="hover:text-brand-blue transition hover:pl-1">All Properties</Link></li>
                            <li><Link href="/landlord" className="hover:text-brand-blue transition hover:pl-1">List Property</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-blue transition hover:pl-1">Contact Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-blue transition hover:pl-1">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-blue transition hover:pl-1">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Localities (3 Cols) */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-white text-lg mb-6">Popular Areas</h4>
                        <ul className="space-y-4 text-sm text-gray-400 font-medium columns-1 sm:columns-2 gap-x-4">
                            {["Lalpur", "Bariatu", "Morabadi", "Kanke Road", "Doranda", "Hinoo", "Kokar", "Argora"].map((loc) => (
                                <li key={loc} className="pb-4 sm:pb-0 break-inside-avoid">
                                    <Link href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`} className="hover:text-brand-blue transition">
                                        {loc}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter (3 Cols) */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-white text-lg mb-6">Stay Connected</h4>
                        <ul className="space-y-4 text-sm text-gray-400 mb-8">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                                <span>Ranchi, Jharkhand, India - 834001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                                <a href="tel:+917557777987" className="hover:text-white transition text-white font-semibold">+91 75577 77987</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                                <a href="mailto:hello@ranchirent.in" className="hover:text-white transition">hello@ranchirent.in</a>
                            </li>
                        </ul>

                        {/* Simple Newsletter */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-brand-blue text-white px-3 rounded-md text-xs font-bold hover:bg-blue-600 transition">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 font-medium">
                    <p>© {new Date().getFullYear()} RanchiRent.in. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span className="flex items-center gap-1.5">
                            Made with <span className="text-red-500 animate-pulse">❤️</span> in Ranchi
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
