import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientProviders from "./client-providers";

import { InterviewDataProvider } from "@/context/InterviewDataContext";
import { Toaster } from "@/components/ui/sonner";

/* ---------------- FONTS ---------------- */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ---------------- METADATA ---------------- */

export const metadata = {
  title: {
    default: "Speak-Hire",
    template: "%s | Speak-Hire",
  },
  description:
    "Speak-Hire — AI powered interview scheduling and voice interview platform.",

  icons: {
    icon: "/logo.png", // browser tab logo
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  metadataBase: new URL("https://your-domain.com"), // change after deploy
};

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[#0B0F19] text-white overflow-x-hidden`}
      >
        {/* RAZORPAY SCRIPT */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        {/* GLOBAL APP CONTEXT */}
        <InterviewDataProvider>
          <ClientProviders>
            {/* MAIN APP CONTENT */}
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </ClientProviders>
        </InterviewDataProvider>
      </body>
    </html>
  );
}
