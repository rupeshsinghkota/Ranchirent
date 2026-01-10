type TrackingEvent =
    | "Contact"
    | "Lead"
    | "SubmitApplication"
    | "WhatsAppButtonClick"
    | "CallButtonClick"
    | "ScheduleVisit";

type GAEventName =
    | "generate_lead"
    | "form_submit"
    | "select_content"
    | "contact";

interface WindowWithAnalytics extends Window {
    fbq?: (command: string, eventName: string, params?: any) => void;
    gtag?: (command: string, eventName: string, params?: any) => void;
}

declare let window: WindowWithAnalytics;

export const trackConversion = (event: TrackingEvent, params?: any) => {
    if (typeof window === "undefined") return;

    // 1. Facebook Pixel
    if (window.fbq) {
        if (["Contact", "Lead", "SubmitApplication"].includes(event)) {
            window.fbq("track", event, params);
        } else if (event === "ScheduleVisit") {
            window.fbq("track", "Schedule", params);
        } else {
            window.fbq("trackCustom", event, params);
        }
    }

    // 2. Google Analytics (GA4)
    if (window.gtag) {
        let gaEventName: GAEventName = "generate_lead"; // Default fallback
        let gaParams = { ...params };

        switch (event) {
            case "Contact":
                gaEventName = "contact";
                gaParams.method = "Contact Form";
                break;
            case "Lead":
                gaEventName = "generate_lead";
                gaParams.type = "Tenant Requirement";
                break;
            case "SubmitApplication":
                gaEventName = "form_submit";
                gaParams.form_name = "Landlord Listing";
                break;
            case "WhatsAppButtonClick":
                gaEventName = "select_content";
                gaParams.content_type = "whatsapp_button";
                break;
            case "CallButtonClick":
                gaEventName = "select_content";
                gaParams.content_type = "call_button";
                break;
            case "ScheduleVisit":
                gaEventName = "generate_lead";
                gaParams.event_category = "engagement";
                gaParams.event_label = "schedule_visit";
                break;
        }

        window.gtag("event", gaEventName, gaParams);
    }
};
