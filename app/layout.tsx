import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThirdwebProviderWrapper } from "@/components/providers/thirdweb-provider";
import { Navigation } from "@/components/navigation";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Polypuff",
  description: "Polygon Copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} antialiased flex flex-col h-screen overflow-hidden`}
      >
        <ThirdwebProviderWrapper>
          <div className="flex flex-col h-full">
            <Navigation />
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        </ThirdwebProviderWrapper>
      </body>
    </html>
  );
}
