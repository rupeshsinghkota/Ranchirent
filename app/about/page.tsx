import { ShieldCheck, Users, Zap } from "lucide-react";

export const metadata = {
    title: "About Us | RanchiRent",
    description: "Learn about RanchiRent, the most trusted rental platform in Ranchi.",
};

export default function AboutPage() {
    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 bg-gray-50 border-b border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -mr-20 -mt-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -ml-20 -mb-20 animate-pulse delay-700"></div>

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <span className="text-brand-blue font-bold tracking-wider text-sm uppercase mb-4 block animate-fade-in-up">Our Mission</span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight animate-fade-in-up delay-100">
                        Changing How <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Ranchi Rents.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200 mb-12">
                        We started RanchiRent with a simple promise: <strong>No more fake listings. No more endless calling.</strong> Just verified flats and direct connections.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 md:gap-16 border-t border-gray-200 pt-12 max-w-3xl mx-auto animate-fade-in-up delay-300">
                        <div>
                            <div className="text-4xl font-black text-gray-900 mb-1">500+</div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Happy Families</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-gray-900 mb-1">100%</div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Verified Listings</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-gray-900 mb-1">24h</div>
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Move-in Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Started</h2>
                    <div className="prose prose-lg text-gray-500 leading-relaxed space-y-6">
                        <p>
                            Finding a flat in Ranchi used to be a nightmare. You’d call ten numbers from a newspaper, nine would be switched off, and the tenth would be a broker asking unique fees for a flat that looked nothing like the photos.
                        </p>
                        <p>
                            We realized that Ranchi deserves better. A modern city needs a modern way to rent.
                        </p>
                        <p>
                            That's why we built <strong>RanchiRent</strong>. A technology-first platform where every single listing is physically visited, photographed, and verified by our team. We don't just list properties; we curate homes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container mx-auto px-4 pb-24">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1 group duration-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-blue transition-colors duration-300">
                            <ShieldCheck className="w-8 h-8 text-brand-blue group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Verified</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Every flat listed on our platform is physically visited and verified by our team. Legit owners, real photos, no surprises.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1 group duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                            <Zap className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Contact</h3>
                        <p className="text-gray-500 leading-relaxed">
                            We hate forms as much as you do. Click to call or WhatsApp directly to schedule a visit instantly.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1 group duration-300">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                            <Users className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Local Experts</h3>
                        <p className="text-gray-500 leading-relaxed">
                            We are born and raised in Ranchi. We know every lane in Lalpur, Doranda, and Kanke better than Google Maps.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
