import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Melemi Bojana | Prirodna njega tijela",
    template: "%s | Melemi Bojana",
  },
  description: "Melemi Bojana veb-sajt je mjesto gdje ćete pronaći prirodne meleme i njegu tijela.",
  icons: {
    icon: "/melem-favicon-32.png",
  },
  openGraph: {
    type: "website",
    locale: "sr_Latn_BA",
    url: baseUrl,
    siteName: "Melemi Bojana",
    title: "Melemi Bojana | Prirodna njega tijela",
    description: "Melemi Bojana veb-sajt je mjesto gdje ćete pronaći prirodne meleme i njegu tijela.",
  },
  twitter: {
    card: "summary",
    title: "Melemi Bojana | Prirodna njega tijela",
    description: "Melemi Bojana veb-sajt je mjesto gdje ćete pronaći prirodne meleme i njegu tijela.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="sr-Latn" suppressHydrationWarning>
        <body
          className={`${outfit.className} antialiased text-gray-700`}
          suppressHydrationWarning
        >
          <Script id="strip-extension-attrs" strategy="beforeInteractive">
            {`(() => {
  const patterns = [/^bis_/i, /^__processed_/i];
  const strip = (node) => {
    if (!node || node.nodeType !== 1) return;
    const attrs = Array.from(node.attributes || []);
    for (const attr of attrs) {
      if (patterns.some((pattern) => pattern.test(attr.name))) {
        node.removeAttribute(attr.name);
      }
    }
    const children = node.children || [];
    for (const child of children) {
      strip(child);
    }
  };
  strip(document.documentElement);
})();`}
          </Script>
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
              </Script>
            </>
          )}
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
