
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Seller Intelligence | Marketplace Research",
    template: "%s | Seller Intelligence",
  },
  description:
    "Research Etsy listings and explore marketplace product data using live API results.",
  applicationName: "Seller Intelligence",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
