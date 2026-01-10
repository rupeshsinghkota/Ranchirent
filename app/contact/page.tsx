import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
    title: "Contact Us | RanchiRent",
    description: "Let&apos;s discuss how we can help you find the perfect home in Ranchi.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-2 block animate-fade-in-up">We&apos;re Here to Help</span>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-6 animate-fade-in-up delay-100">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Have a question about a property or want to list your home? Our team is ready to assist you.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info Card */}
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up delay-300">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 mb-1">Phone</p>
                                    <a href="tel:+919507623858" className="text-lg text-gray-600 hover:text-brand-blue transition font-medium block">+91 95076 23858</a>
                                    <p className="text-sm text-gray-400 mt-1">Mon-Sat, 9am - 7pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 mb-1">Email</p>
                                    <a href="mailto:hello@ranchirent.in" className="text-lg text-gray-600 hover:text-brand-blue transition font-medium block">hello@ranchirent.in</a>
                                    <p className="text-sm text-gray-400 mt-1">For support & inquiries</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 mb-1">Office</p>
                                    <p className="text-lg text-gray-600 leading-relaxed font-medium">Circular Road, Lalpur<br />Ranchi, Jharkhand 834001</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 animate-fade-in-up delay-500">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h2>
                        <p className="text-gray-500 mb-8">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
