import { MapPin, School, Train, Building2 } from "lucide-react";

interface LocalitySeoContentProps {
    locality: string;
}

const localityData: Record<string, {
    vibe: string;
    highlights: string;
    connectivity: string;
    lifestyle: string;
}> = {
    "Lalpur": {
        vibe: "a bustling student and commercial hub",
        highlights: "Nucleus Mall, Women's College, and coaching centers",
        connectivity: "Centrally located with 24/7 auto availability. Key junction connecting Main Road, Kokar, and Bariatu.",
        lifestyle: "Perfect for students and families. Home to top coaching institutes, vegetable markets, and Nucleus Mall for entertainment."
    },
    "Bariatu": {
        vibe: "a peaceful medical and residential zone",
        highlights: "RIMS Hospital, Medical College, and Booty More",
        connectivity: "Direct highway access to Hazaribagh/Patna via Booty More. Low traffic compared to city center.",
        lifestyle: "Ideal for medical professionals and families. Proximity to RIMS ensures world-class healthcare nearby."
    },
    "Morabadi": {
        vibe: "Ranchi's most premium and green VIP area",
        highlights: "Morabadi Ground, Tagore Hill, and Oxygen Park",
        connectivity: "Wide, congestion-free roads. Quick access to Kanke Road and the Governor's House area.",
        lifestyle: "The fitness capital of Ranchi. Morning walks at Morabadi ground and evenings at Tagore Hill make it unique."
    },
    "Kanke Road": {
        vibe: "an upscale luxury living corridor",
        highlights: "Kanke Dam, Rock Garden, and CMPDI",
        connectivity: "Scenic wide roads connecting the city to the Ring Road. 15 mins drive from the main city.",
        lifestyle: "Home to Ranchi's best luxury apartments. Offers scenic views of the Dam and premium dining options."
    },
    "Hinoo": {
        vibe: "a strategic location near the Airport",
        highlights: "Birsa Munda Airport, Mecon Colony, and Doranda",
        connectivity: "Unmatched connectivity for frequent flyers (5 mins to Airport). Gateway to HEC and Dhurwa.",
        lifestyle: "Cosmopolitan crowd due to PSUs like Mecon and SAIL nearby. Excellent schools like Loyola Convent."
    },
    "Harmu": {
        vibe: "a well-planned residential colony",
        highlights: "JSCA Cricket Stadium, MSD's Residence, and Harmu Ground",
        connectivity: "Planned wide roads with a bypass connecting Ratu Road to the Airport.",
        lifestyle: "Structured housing board colony with parks in every block. Great for families looking for community living."
    },
    // Default fallback for others
    "default": {
        vibe: "a prime residential choice",
        highlights: "parks, markets, and schools",
        connectivity: "Located strategically with easy access to public transport and main roads.",
        lifestyle: "A balanced neighborhood offering essential amenities like grocery stores, schools, and clinics within walking distance."
    }
};

export default function LocalitySeoContent({ locality }: LocalitySeoContentProps) {
    // Normalization to handle casing matches if needed, though usually direct match is fine
    // We check for exact match first, then try case-insensitive
    const key = Object.keys(localityData).find(k => k.toLowerCase() === locality.toLowerCase()) || "default";
    const data = localityData[key];

    return (
        <section className="bg-gray-50 py-16 mt-16 rounded-3xl border border-gray-100">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Living in {locality}: A Comprehensive Guide
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Known as {data.vibe}, {locality} is one of the most sought-after residential areas in Ranchi.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Why Rent in {locality}?</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {locality} is famous for {data.highlights}.
                                It offers a perfect blend of peaceful residential living and urban convenience.
                                Whether you are looking for a **1 BHK for rent in {locality}** or a spacious **3 BHK apartment**,
                                this area has options for every budget.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Train className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Connectivity & Transport</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {data.connectivity} Public transport like auto-rickshaws and e-rickshaws are readily available,
                                keeping you connected to the rest of Ranchi seamlessly.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <School className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Lifestyle & Amenities</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {data.lifestyle} Residents enjoy close proximity to daily markets and essential services.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="text-brand-blue w-5 h-5" />
                                <h3 className="text-xl font-bold text-gray-900">Rental Trends in {locality}</h3>
                            </div>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>
                                    <strong className="text-gray-900">1 BHK Flats:</strong> Ideal for singles/students near {data.highlights.split(',')[0]}.
                                </li>
                                <li>
                                    <strong className="text-gray-900">2 BHK Flats:</strong> Most popular choice for small families in {locality}.
                                </li>
                                <li>
                                    <strong className="text-gray-900">3 BHK Apartments:</strong> Premium living with modern amenities.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-white rounded-xl border border-blue-100 text-center">
                    <p className="text-gray-700 italic">
                        "Looking for a <strong>brokerage-free flat in {locality}</strong>? RanchiRent helps you connect directly with verified owners.
                        No hidden charges. 100% verified listings."
                    </p>
                </div>
            </div>
        </section>
    );
}
