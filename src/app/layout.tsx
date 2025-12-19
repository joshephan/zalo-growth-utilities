import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
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
  title: "Zalo Growth Utilities - Công cụ Marketing Zalo cho SME",
  description:
    "Bộ công cụ tự động hóa marketing Zalo dành cho doanh nghiệp vừa và nhỏ tại Việt Nam. Tạo link, xem trước mẫu ZNS, và tạo sticker Zalo.",
  keywords: [
    "Zalo",
    "Marketing",
    "SME",
    "Vietnam",
    "QR Code",
    "ZNS",
    "Sticker",
  ],
  authors: [{ name: "Zalo Growth Utilities" }],
  openGraph: {
    title: "Zalo Growth Utilities",
    description: "Công cụ Marketing Zalo cho doanh nghiệp Việt Nam",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-51YJG5180Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-51YJG5180Q');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
