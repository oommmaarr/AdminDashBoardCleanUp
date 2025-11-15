import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clean Up | خدمات التنظيف المتكاملة",
  description: "موقع يقدم خدمات تنظيف احترافية للمنازل والمباني في السعودية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-lyon relative min-h-screen h-full bg-linear-to-br from-black via-[#003983] to-black bg-fixed`}
      >
        <main className="relative z-10 pt-6">{children}</main>
      </body>
    </html>
  );
}
