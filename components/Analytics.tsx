import Script from "next/script";

export default function Analytics() {
    return (
        <>
            {/* Google Analytics & Ads */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=G-1VPLGKEXVE`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-1VPLGKEXVE'); 
          gtag('config', 'AW-16683904204'); 
        `}
            </Script>

            {/* Facebook Pixel (Replace 0000000000 with your new ID) */}
            <Script id="facebook-pixel" strategy="afterInteractive">
                {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1774875569893560'); 
          fbq('track', 'PageView');
        `}
            </Script>
        </>
    );
}
