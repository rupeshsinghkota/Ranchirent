import { NextResponse } from 'next/server';

// ⚠️ The Script URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwv48R71x0VGXdEThGWM3Q0CK7Aw8S775fnISsr7T7e04-L8Am-Oei1W5jytUStm7g/exec";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("🔹 [API] Received Verification Request");
        console.log(`🔹 [API] Owner: ${body.ownerName}, Flat: ${body.flatNo}`);

        // Forward to Google Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const textResult = await response.text();
        console.log("🔸 [API] Google Response Status:", response.status);
        console.log("🔸 [API] Google Response Body:", textResult);

        if (!response.ok) {
            throw new Error(`Google Script failed with ${response.status}: ${textResult}`);
        }

        return NextResponse.json({ success: true, googleResponse: textResult });

    } catch (error: any) {
        console.error("❌ [API] Error forwarding to Google:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
