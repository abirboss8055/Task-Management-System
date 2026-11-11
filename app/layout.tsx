import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Comrades Legacy — Internal Task Management",
  description: "Modern Heritage internal task operations portal for Comrades Legacy clothing brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-ivory text-navy antialiased selection:bg-maroon selection:text-white">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!rounded-none !border-2 !border-navy !bg-surface !text-navy !shadow-none font-sans text-xs font-semibold",
          }}
        />
      </body>
    </html>
  );
}
