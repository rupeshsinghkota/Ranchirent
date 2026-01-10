import Hero from "@/components/Hero";
import HomeProperties from "@/components/HomeProperties";
import { localities } from "@/data/localities";
import Link from 'next/link';
import { ShieldCheck, Wallet, Clock, ArrowRight } from "lucide-react";
import HomeSeoContent from "@/components/HomeSeoContent";

export default function Home() {
  return (
    <main>
      <Hero />

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

      {/* Verified Properties Feed (Self-Contained Suspense) */}
      <HomeProperties />

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
              We are Ranchi&apos;s first tech-enabled brokerage service. We combine the ease of online searching with the trust of offline service.
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

      {/* Owner Acquisition Section - NEW */}
      <section className="bg-blue-600 py-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 border border-blue-400 text-white font-bold text-xs tracking-wide mb-6 backdrop-blur-sm">
                FOR PROPERTY OWNERS
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                Have a Flat to Rent? <br />
                <span className="text-blue-100">Get it Listed for Free.</span>
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-lg">
                Stop dealing with spam calls. We verify tenants, handle visits, and ensure you get the best market rate. Zero upfront fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/landlord" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg text-center">
                  List Your Property
                </Link>
                <a href="https://wa.me/919507623858" target="_blank" rel="noopener noreferrer nofollow" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 filter brightness-0 invert" alt="WhatsApp icon" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Visual Element */}
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm transform rotate-3 hover:rotate-0 transition duration-500 text-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="h-40 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold">
                    Your Property Here
                  </div>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-bold text-green-700 text-sm">Tenant Verified</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
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
              <p className="text-gray-600 mb-6 italic leading-relaxed text-sm">&quot;{review.text}&quot;</p>
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

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-2 block">Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do I rent a flat in Ranchi through RanchiRent?",
                a: "Simply browse our verified listings, shortlist properties you like, and contact us to schedule a guided visit. Our agent will pick you up and show you the properties. Once you finalize, we handle the negotiation and paperwork."
              },
              {
                q: "Is there any brokerage fee for tenants?",
                a: "We charge a nominal service fee equivalent to 15 days rent only after you successfully move in. This covers guided visits, negotiation, and rental agreement assistance."
              },
              {
                q: "Are all properties on RanchiRent verified?",
                a: "Yes! Every property listed on RanchiRent is 100% physically verified by our team. We visit each property to confirm real photos, legitimate owners, and accurate pricing."
              },
              {
                q: "Which areas in Ranchi does RanchiRent cover?",
                a: "We cover all major localities including Lalpur, Bariatu, Morabadi, Kanke Road, Doranda, Hinoo, Kokar, Harmu, Argora, Kadru, Ratu Road, and many more areas across Ranchi."
              },
              {
                q: "How can property owners list their flat on RanchiRent?",
                a: "Property owners can list their flat for free by filling out our landlord form or WhatsApp us directly. We'll verify your property and list it within 24 hours. No upfront fees for owners."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <summary className="px-6 py-5 cursor-pointer flex items-center justify-between font-bold text-gray-900 hover:bg-gray-50 transition list-none">
                  <span>{faq.q}</span>
                  <span className="text-brand-blue text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HomeSeoContent />

      {/* JSON-LD Schema for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "RanchiRent",
            "image": "https://ranchirent.in/icon.png",
            "url": "https://ranchirent.in",
            "telephone": "+919507623858",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Circular Road, Lalpur",
              "addressLocality": "Ranchi",
              "postalCode": "834001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 23.3441,
              "longitude": 85.3096
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "09:00",
              "closes": "19:00"
            },
            "sameAs": [
              "https://www.instagram.com/ranchirent/",
              "https://www.facebook.com/profile.php?id=61585765550042"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "200",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* JSON-LD Schema for FAQ - Helps get rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I rent a flat in Ranchi through RanchiRent?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply browse our verified listings, shortlist properties you like, and contact us to schedule a guided visit. Our agent will pick you up and show you the properties. Once you finalize, we handle the negotiation and paperwork."
                }
              },
              {
                "@type": "Question",
                "name": "Is there any brokerage fee for tenants?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We charge a nominal service fee equivalent to 15 days rent only after you successfully move in. This covers guided visits, negotiation, and rental agreement assistance."
                }
              },
              {
                "@type": "Question",
                "name": "Are all properties on RanchiRent verified?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Every property listed on RanchiRent is 100% physically verified by our team. We visit each property to confirm real photos, legitimate owners, and accurate pricing."
                }
              },
              {
                "@type": "Question",
                "name": "Which areas in Ranchi does RanchiRent cover?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We cover all major localities including Lalpur, Bariatu, Morabadi, Kanke Road, Doranda, Hinoo, Kokar, Harmu, Argora, Kadru, Ratu Road, and many more areas across Ranchi."
                }
              },
              {
                "@type": "Question",
                "name": "How can property owners list their flat on RanchiRent?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Property owners can list their flat for free by filling out our landlord form or WhatsApp us directly. We'll verify your property and list it within 24 hours. No upfront fees for owners."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
