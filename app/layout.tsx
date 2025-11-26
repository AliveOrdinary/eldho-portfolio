import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Eldho | Art Director & Graphic Designer",
  description: "Eldhose Kuriyan is an Art Director and Graphic Designer based in Toronto, specializing in branding, typography, and illustration.",
  keywords: ["Art Director", "Graphic Designer", "Branding", "Typography", "Illustration", "Toronto", "Portfolio"],
  authors: [{ name: "Eldhose Kuriyan" }],
  creator: "AliveOrdinary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/fonts/PPNeueMontreal-Book.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="" 
        />
        <link 
          rel="preload" 
          href="/fonts/PPNeueMontreal-Medium.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="" 
        />
        <link 
          rel="preload" 
          href="/fonts/PPRightSerif-Medium.otf" 
          as="font" 
          type="font/otf" 
          crossOrigin="" 
        />
      </head>
      <body className="antialiased">
        {children}
        
        <Script 
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
