'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from "@/components/Hero";
import VerifiedFeed from "@/components/VerifiedFeed"; // Import Added
import PropertyGrid from "@/components/PropertyGrid";
import { localities } from "@/data/localities";
import Link from 'next/link';
import { ShieldCheck, Wallet, Clock, ArrowRight } from "lucide-react";
import HomeSeoContent from "@/components/HomeSeoContent";

export default function Home() {
  const router = useRouter();
  const [filters, setFilters] = useState({ locality: "", query: "" });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.locality) params.set("locality", filters.locality);
    if (filters.query) params.set("query", filters.query);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <main>
      <Hero
        onLocalityChange={(loc) => setFilters(prev => ({ ...prev, locality: loc }))}
        onQueryChange={(q) => setFilters(prev => ({ ...prev, query: q }))}
        onSearchClick={handleSearch}
      />

      {/* Trust Strip */}
      <div className="bg-gray-50 border-y border-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 font-medium text-sm md:text-base flex flex-col md:flex-row items-center justify-center gap-2">
            <span>Trusted by <span className="text-gray-900 font-bold">200+ Families</span> in Ranchi</span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span><span className="text-gray-900 font-bold">4.8/5</span> Average Google Rating</span>
          </p>
        </div>
      </div>



      {/* Verified Properties Feed (Real Data) */}
      <VerifiedFeed />

      {/* How It Works Section - Crucial for Brokerage Model */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-2 block">The Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Your journey to a new home in 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>

            {/* Step 1 */}
            <div className="text-center bg-white p-6 animate-fade-in-up delay-100 group cursor-default">
              <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Shortlist</h3>
              <p className="text-gray-500 leading-relaxed">
                Browse verified listings. specific to your needs. No fake photos or outdated prices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center bg-white p-6 animate-fade-in-up delay-200 group cursor-default">
              <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Guided Visit</h3>
              <p className="text-gray-500 leading-relaxed">
                Schedule a visit. Our agent picks you up and shows you the property personally.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center bg-white p-6 animate-fade-in-up delay-300 group cursor-default">
              <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Move In</h3>
              <p className="text-gray-500 leading-relaxed">
                We handle the negotiation, rental agreement, and handover. You just settle in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 mb-16 md:mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Abstract Image Composition using Colors/shapes since we don't have a new image handy immediately, 
                         or re-use a property placeholder effectively */}
            <div className="bg-gray-100 rounded-3xl p-8 h-[500px] flex items-center justify-center relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl opacity-40 -mr-16 -mt-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 -ml-16 -mb-16 animate-pulse delay-700"></div>
              <div className="text-center relative z-10">
                <h3 className="text-4xl font-black text-gray-900 mb-2">1500+</h3>
                <p className="text-gray-500 font-medium">Beds Available</p>
                <div className="my-8 w-24 h-1 bg-gray-200 mx-auto rounded-full"></div>
                <h3 className="text-4xl font-black text-gray-900 mb-2">Zero</h3>
                <p className="text-gray-500 font-medium">Headaches</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-2 block">Why RanchiRent?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">More Than Just a Listing Portal.</h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              We are Ranchi's first tech-enabled brokerage service. We combine the ease of online searching with the trust of offline service.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-brand-blue">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">100% Physically Verified</h4>
                  <p className="text-gray-500 text-sm">Every flat listed here has been visited by our team. Legit owners, real photos.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 text-purple-600">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Expert Negotiation</h4>
                  <p className="text-gray-500 text-sm">We negotiate the best rent for you. Our 15-day commission model ensures we work for YOUR savings.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0 text-green-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">One-Day Move In</h4>
                  <p className="text-gray-500 text-sm">From visit to agreement, we speed up the process. Move in within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localities Cloud */}
      <section className="bg-gray-900 py-12 md:py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Popular Neighborhoods</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {localities.map((loc) => (
              <Link
                key={loc}
                href={`/rent/${loc.toLowerCase().replace(/ /g, '-')}`}
                className="px-6 py-3 rounded-full border border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 transition-all text-sm md:text-base font-medium"
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Reused logic with better styling) */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Families Who Found Their Home</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Rahul & Priya",
              loc: "Lalpur",
              text: "We were tired of calling brokers who never showed up. RanchiRent's agent picked us up and showed us 3 flats in one day. Finalized instantly!"
            },
            {
              name: "Amit Kumar",
              loc: "Khelgaon",
              text: "Best service in Ranchi. They handled the rent agreement and verification. I didn't have to worry about anything. Highly recommended."
            },
            {
              name: "Sneha Singh",
              loc: "Bariatu",
              text: "As a working professional, I didn't have time to search. Their guided visits were a lifesaver. Found a safe and beautiful flat."
            }
          ].map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="text-yellow-400 flex gap-1 mb-4 text-sm">
                {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed text-sm">"{review.text}"</p>
              <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center font-bold text-brand-blue text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{review.loc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HomeSeoContent />
    </main>
  );
}
