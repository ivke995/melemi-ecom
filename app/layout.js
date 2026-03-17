import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Melemi Bojana | Prirodna njega tijela",
  description: "Melemi Bojana veb-sajt je mjesto gdje ćete pronaći prirodne meleme i njegu tijela.",
  icons: {
    icon: "/melem-favicon-32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="sr-Latn">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
