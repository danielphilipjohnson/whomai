import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/layout/Topbar";
import CyberpunkBackground from "@/components/layout/DesktopBackground";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberOS Terminal Desktop",
  description: "A cyberpunk-inspired interactive desktop UI built with Next.js and Tailwind CSS.",
  keywords: [
    "cyberpunk", "terminal", "desktop UI", "Next.js", "Tailwind CSS",
    "retro interface", "hacker aesthetic", "void os", "fake OS"
  ],
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: "CyberOS Terminal Desktop",
    description:
      "Step into a retro-futuristic world with CyberOS — a stylized terminal-inspired desktop interface powered by React and Tailwind CSS.",
    url: "https://yourdomain.com",
    siteName: "CyberOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CyberOS Terminal Interface",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberOS Terminal Desktop",
    description:
      "A stylized cyberpunk terminal UI built in Next.js. Explore the retro-future aesthetic.",
    creator: "@yourhandle",
    images: ["/og-image.png"],
  },
  themeColor: "#00FFE0",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-screen w-full flex flex-col bg-gray-900 overflow-hidden relative">
          <CyberpunkBackground />
          <Topbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
