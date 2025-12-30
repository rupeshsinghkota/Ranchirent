import { CheckCircle, IndianRupee, Users, TrendingUp } from "lucide-react";
import AgentForm from "@/components/AgentForm";

export const metadata = {
    title: "Become a RanchiRent Agent | Earn 30% Commission | Ranchi",
    description: "Earn money by listing properties in your locality. Get 30% commission on every successful tenant booking. No investment required.",
};

export default function AgentPage() {
    return (
        <main className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                {/* Left Column: Value Prop */}
                <div>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 font-bold text-sm tracking-wide mb-6">
                        EARN WHILE YOU HELP
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        Become a <span className="text-green-600">RanchiRent Agent</span> & Earn Money
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Know vacant flats in your locality? List them with us and earn <strong className="text-green-600">30% commission</strong> on every successful booking.
                    </p>

                    {/* Earnings Calculator */}
                    <div className="bg-green-50 border border-green-100 p-6 rounded-xl mb-8">
                        <p className="text-sm font-bold text-green-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            Your Potential Earnings
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">₹2,400</p>
                                <p className="text-xs text-gray-500">Per ₹8K rent flat</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">₹3,000</p>
                                <p className="text-xs text-gray-500">Per ₹10K rent flat</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-2xl font-bold text-green-600 font-extrabold">₹12K+</p>
                                <p className="text-xs text-gray-500">5 flats/month</p>
                            </div>
                        </div>
                    </div>

                    {/* How it Works */}
                    <div className="space-y-4 mb-8">
                        <h3 className="font-bold text-gray-900 text-lg">How It Works</h3>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600 font-bold text-lg">1</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Find a Vacant Property</h4>
                                <p className="text-gray-500 text-sm">Spot a "For Rent" board or talk to owners in your area.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600 font-bold text-lg">2</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Submit on This Form</h4>
                                <p className="text-gray-500 text-sm">Fill owner details, take photos, and submit. We verify.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600 font-bold text-lg">3</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Get Paid on Success</h4>
                                <p className="text-gray-500 text-sm">When tenant moves in, 30% commission is sent to your UPI.</p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <p className="text-gray-700 font-medium">No investment or registration fee</p>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <Users className="w-6 h-6 text-blue-500" />
                            <p className="text-gray-700 font-medium">Perfect for students & job seekers</p>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                            <p className="text-gray-700 font-medium">Unlimited earning potential</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="relative lg:sticky lg:top-8">
                    <div className="absolute inset-0 bg-green-600/5 rounded-3xl transform rotate-3 scale-105 z-0"></div>
                    <div className="relative z-10">
                        <AgentForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
