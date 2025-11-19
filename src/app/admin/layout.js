// app/admin/layout.js
"use client";
import "../globals.css";
import AdminSidebar from "../components/sidebar/AdminSidebar.jsx";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function AdminLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-full min-h-screen bg-linear-to-br from-black via-[#003983] to-black bg-fixed`}
      >
        <AdminSidebar />
        <main className="flex-1 pt-6">{children}</main>
      </body>
    </html>
  );
}
