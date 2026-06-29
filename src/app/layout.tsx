import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://velour.vercel.app"),
  title: "VÉLOUR — Boutique wine, aged in shadow",
  description:
    "VÉLOUR is a boutique winery crafting small-batch wines in darkness. Explore the collection in interactive 3D.",
  openGraph: {
    title: "VÉLOUR — Boutique wine, aged in shadow",
    description: "Small-batch wines, aged in darkness. Explore in 3D.",
    type: "website",
    images: [
      {
        url: "/velour-label.png",
        width: 1200,
        height: 1200,
        alt: "VÉLOUR Reserve Cabernet Sauvignon label artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VÉLOUR — Boutique wine, aged in shadow",
    description: "Small-batch wines, aged in darkness. Explore in 3D.",
    images: ["/velour-label.png"],
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
      className={`${playfair.variable} ${sourceSerif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-noir text-cream font-serif">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
