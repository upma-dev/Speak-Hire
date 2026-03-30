import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./client-providers";
import { InterviewDataProvider } from "@/context/InterviewDataContext";
import { Toaster } from "sonner"; // ✅ ADD THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Speak-Hire",
  description: "AI Interview Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-[#0B0F19]
          text-white
        `}
      >
        <InterviewDataProvider>
          <ClientProviders>
            {children}

            {/* 🔥 GLOBAL TOAST */}
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand
              theme="dark"
            />
          </ClientProviders>
        </InterviewDataProvider>
      </body>
    </html>
  );
}
