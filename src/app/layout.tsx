import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nav-eCOM ✦ Shop Smarter, Live Better",
  description: "Discover millions of products across electronics, fashion, home, books and more. Fast shipping, secure checkout, easy returns.",
  keywords: ["Nav-eCOM", "ecommerce", "online shopping", "electronics", "fashion", "deals"],
  authors: [{ name: "Nav-eCOM" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Nav-eCOM ✦ Shop Smarter, Live Better",
    description: "Millions of products. Fast shipping. Secure checkout.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
