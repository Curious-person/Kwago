import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});



export const metadata: Metadata = {
  title: {
    default: "Kwago | Marvel & LOTR Collectibles",
    template: "%s | Kwago",
  },
  description: "The ultimate destination for Marvel and Lord of the Rings collectors. Find premium figures, statues, and expert guides.",
  keywords: ["Marvel Legends", "Weta Workshop", "Lord of the Rings", "Collectibles", "Action Figures"],
  authors: [{ name: "Kwago Team" }],
  openGraph: {
    title: "Kwago | Marvel & LOTR Collectibles",
    description: "Premium Marvel and LOTR collectibles for serious fans.",
    url: "https://kwago-collectibles.com",
    siteName: "Kwago",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kwago Collectibles",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwago | Marvel & LOTR Collectibles",
    description: "Premium Marvel and LOTR collectibles for serious fans.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
